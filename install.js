#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const https = require("https");
const { spawn } = require("child_process");
const os = require("os");
const AdmZip = require("adm-zip");
const readline = require("readline");
const chalk = require("chalk");
const semver = require("semver");
const cliProgress = require("cli-progress");
const packageJson = require("./package.json");

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "afront-"));
const VERSION = packageJson.version;
const MIN_NODE_VERSION = "20.18.1";

if (!semver.gte(process.version, MIN_NODE_VERSION)) {
  console.error(
    chalk.red(
      `\n✖ AFront requires Node.js ${MIN_NODE_VERSION} or higher.\nCurrent: ${process.version}\n`,
    ),
  );
  process.exit(1);
}

process.on("SIGINT", () => {
  console.log(chalk.yellow("\n\nInstallation cancelled."));
  rl.close();
  cleanup();
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error(chalk.red("\nUnexpected error:\n"), err);
  rl.close();
  cleanup();
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.error(chalk.red("\nUnhandled promise rejection:\n"), err);
  rl.close();
  cleanup();
  process.exit(1);
});

// Configuration
const GITHUB_ZIP_URL = `https://codeload.github.com/Asggen/afront/zip/refs/tags/v${VERSION}`;

// Define files to skip
const SKIP_FILES = [
  "FUNDING.yml",
  "CODE_OF_CONDUCT.md",
  "SECURITY.md",
  "install.js",
  ".npmrc",
];

// Initialize readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const cleanup = () => {
  try {
    if (fs.existsSync(tmpDir)) {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  } catch (err) {
    console.error("Error cleaning up temporary directory:", err);
  }
};

// Spinner function
const spinner = (text, delay = 100) => {
  if (!process.stdout.isTTY) {
    console.log(text);
    return () => {};
  }

  const spinnerChars = ["|", "/", "-", "\\"];
  let i = 0;

  const interval = setInterval(() => {
    readline.cursorTo(process.stdout, 0);
    process.stdout.write(`${text} ${spinnerChars[i++]}`);
    i %= spinnerChars.length;
  }, delay);

  return () => {
    clearInterval(interval);
    readline.cursorTo(process.stdout, 0);
    process.stdout.write(`${text} Done.\n`);
  };
};

const askQuestion = (question) => {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim().toLowerCase());
    });
  });
};

const downloadFile = (url, destination) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destination);
    file.on("error", (err) => {
      reject(err);
    });

    https
      .get(url, (response) => {
        if (
          response.statusCode >= 300 &&
          response.statusCode < 400 &&
          response.headers.location
        ) {
          return downloadFile(response.headers.location, destination)
            .then(resolve)
            .catch(reject);
        }

        if (response.statusCode !== 200) {
          return reject(
            new Error(
              `Failed to download file. Status code: ${response.statusCode}`,
            ),
          );
        }

        const totalHeader = response.headers["content-length"];
        const total = totalHeader ? Number(totalHeader) : null;

        let bar;
        let downloaded = 0;

        const useTTY = process.stdout.isTTY;

        const formatBytes = (bytes) => {
          if (bytes < 1024) return bytes + " B";
          if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
          return (bytes / (1024 * 1024)).toFixed(1) + " MB";
        };

        if (useTTY && total) {
          let downloadedBytes = 0;
          const totalFormatted = formatBytes(total);

          bar = new cliProgress.SingleBar({
            format: (options, params) => {
              const percentage = Math.floor(
                (params.value / params.total) * 100,
              );

              const termWidth = process.stdout.columns || 80;
              const barLength = Math.max(10, Math.min(termWidth - 60, 30));
              const filledLength = Math.round(barLength * params.progress);

              const barVisual =
                "█".repeat(filledLength) + "░".repeat(barLength - filledLength);

              const downloadedFormatted = formatBytes(params.value);
              const totalFormatted = formatBytes(params.total);

              return (
                chalk.cyan("⬇ Downloading template  ") +
                chalk.green(barVisual) +
                chalk.white(` ${percentage}%`) +
                chalk.gray(` (${downloadedFormatted} / ${totalFormatted})`)
              );
            },
            hideCursor: true,
            clearOnComplete: false,
          });

          bar.start(total, 0);

          response.on("data", (chunk) => {
            downloadedBytes += chunk.length;
            bar.update(downloadedBytes);
          });
        } else {
          console.log(chalk.cyan("⬇ Downloading template..."));
        }

        response.pipe(file);

        file.on("finish", () => {
          file.close(() => {
            if (bar) {
              bar.stop();
              const totalFormatted = formatBytes(total);
              console.log(
                chalk.green(`✔ Downloaded template (${totalFormatted})`),
              );
            }
            resolve();
          });
        });
      })
      .on("error", (err) => {
        reject(err);
      });
  });
};

const extractZip = (zipPath, extractTo) => {
  return new Promise((resolve, reject) => {
    const stopSpinner = spinner(chalk.yellow("📦 Extracting files..."));
    try {
      const zip = new AdmZip(zipPath);
      zip.extractAllTo(extractTo, true);
      fs.readdir(extractTo, (err, files) => {
        if (err) {
          stopSpinner();
          console.error("Error reading extracted folder:", err);
          reject(err);
        } else {
          stopSpinner();
          resolve();
        }
      });
    } catch (err) {
      stopSpinner();
      console.error("Error extracting zip file:", err);
      reject(err);
    }
  });
};

const runNpmInstall = (directory) => {
  return new Promise((resolve, reject) => {
    const isWindows = process.platform === "win32";

    // ✅ Non-interactive (CI / Docker / GitHub Actions)
    if (!process.stdout.isTTY) {
      const child = spawn(
        isWindows ? "npm.cmd" : "npm",
        ["install", "--legacy-peer-deps"],
        {
          cwd: directory,
          stdio: "inherit",
          shell: isWindows,
        },
      );

      child.on("close", (code) =>
        code === 0 ? resolve() : reject(new Error("npm install failed")),
      );

      child.on("error", reject);
      return;
    }

    // ✅ Interactive terminal (with progress bar)
    console.log();

    const bar = new cliProgress.SingleBar(
      {
        format:
          chalk.magenta("📦 Installing dependencies  ") +
          chalk.green("{bar}") +
          chalk.white(" {percentage}%"),
        barCompleteChar: "█",
        barIncompleteChar: "░",
        hideCursor: true,
        clearOnComplete: false,
      },
      cliProgress.Presets.shades_classic,
    );

    bar.start(100, 0);

    let progress = 0;

    // Smooth simulated progress
    const interval = setInterval(() => {
      if (progress < 90) {
        progress += Math.random() * 5;
        bar.update(Math.floor(progress));
      }
    }, 200);

    const child = spawn(
      isWindows ? "npm.cmd" : "npm",
      [
        "install",
        "--legacy-peer-deps",
        "--no-audit",
        "--no-fund",
        "--no-progress",
        "--loglevel=error",
      ],
      {
        cwd: directory,
        stdio: "ignore",
        shell: isWindows,
      },
    );

    child.on("close", (code) => {
      clearInterval(interval);

      if (code === 0) {
        bar.update(100);
        bar.stop();
        console.log();
        resolve();
      } else {
        bar.stop();
        reject(new Error(`npm exited with code ${code}`));
      }
    });

    child.on("error", (err) => {
      clearInterval(interval);
      bar.stop();
      reject(err);
    });
  });
};

const createDirIfNotExists = (dirPath) => {
  return new Promise((resolve, reject) => {
    fs.mkdir(dirPath, { recursive: true }, (err) => {
      if (err) {
        reject(new Error("Error creating directory:", err));
      } else {
        resolve();
      }
    });
  });
};

const isPathInside = (root, target) => {
  const r = path.resolve(root);
  const t = path.resolve(target);
  return t === r || t.startsWith(r + path.sep);
};

// Security: path validated against SAFE_UNLINK_ROOT before unlink
const SAFE_UNLINK_ROOT = fs.realpathSync(process.cwd());

const safeUnlink = async (targetPath) => {
  const resolved = await fs.promises.realpath(targetPath);

  if (!resolved.startsWith(SAFE_UNLINK_ROOT + path.sep)) {
    throw new Error(`Blocked unlink outside safe root: ${resolved}`);
  }

  const stats = await fs.promises.lstat(resolved);

  if (!stats.isFile()) {
    throw new Error(`Refusing to unlink non-file: ${resolved}`);
  }

  await fs.promises.unlink(resolved);
};

const safeRm = (dirPath, cb) => {
  const resolved = path.resolve(dirPath);
  if (!isPathInside(process.cwd(), resolved)) {
    return cb(
      new Error(
        `Refusing to remove directory outside current working directory: ${resolved}`,
      ),
    );
  }
  fs.rm(resolved, { recursive: true, force: true }, cb);
};

// Perform an atomic-safe move: open source with O_NOFOLLOW, stream to a temp file, fsync, then rename
const safeMoveFile = async (resolvedSrc, resolvedDest) => {
  const srcFlags =
    process.platform === "win32"
      ? fs.constants.O_RDONLY
      : fs.constants.O_RDONLY | fs.constants.O_NOFOLLOW;
  let srcHandle;
  let destHandle;
  const tmpName = `${resolvedDest}.tmp-${process.pid}-${Date.now()}`;
  try {
    srcHandle = await fs.promises.open(resolvedSrc, srcFlags);
  } catch (err) {
    throw err;
  }

  try {
    const stats = await srcHandle.stat();
    if (stats.isDirectory()) {
      await srcHandle.close();
      throw new Error("Source is a directory");
    }

    await createDirIfNotExists(path.dirname(resolvedDest));

    destHandle = await fs.promises.open(
      tmpName,
      fs.constants.O_WRONLY | fs.constants.O_CREAT | fs.constants.O_TRUNC,
      stats.mode,
    );

    const bufferSize = 64 * 1024;
    const buffer = Buffer.allocUnsafe(bufferSize);
    let position = 0;
    while (true) {
      const { bytesRead } = await srcHandle.read(
        buffer,
        0,
        bufferSize,
        position,
      );
      if (!bytesRead) break;
      let written = 0;
      while (written < bytesRead) {
        const { bytesWritten } = await destHandle.write(
          buffer,
          written,
          bytesRead - written,
        );
        written += bytesWritten;
      }
      position += bytesRead;
    }

    await destHandle.sync();
    await destHandle.close();
    await srcHandle.close();

    await fs.promises.rename(tmpName, resolvedDest);
  } catch (err) {
    try {
      if (destHandle) await destHandle.close();
    } catch (e) {}
    try {
      await fs.promises.unlink(tmpName).catch(() => {});
    } catch (e) {}
    try {
      if (srcHandle) await srcHandle.close();
    } catch (e) {}
    throw err;
  }
};

const promptForFolderName = async () => {
  const answer = await askQuestion(
    "AFront: Enter the name of the destination folder: ",
  );
  return answer;
};

const promptForReplace = async (dirPath) => {
  const answer = await askQuestion(
    `The directory ${dirPath} already exists. Do you want to replace it? (yes/no): `,
  );
  return answer === "yes" || answer === "y";
};

const removeDir = (dirPath) => {
  return new Promise((resolve, reject) => {
    console.log(`Removing existing directory: ${dirPath}`);
    safeRm(dirPath, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
};

const safeReaddir = async (dirPath, safeRoot) => {
  const resolvedDir = await fs.promises.realpath(dirPath);
  const resolvedRoot = await fs.promises.realpath(safeRoot);

  if (
    !resolvedDir.startsWith(resolvedRoot + path.sep) &&
    resolvedDir !== resolvedRoot
  ) {
    throw new Error(`Blocked readdir outside safe root: ${resolvedDir}`);
  }

  const stats = await fs.promises.lstat(resolvedDir);
  if (!stats.isDirectory()) {
    throw new Error(`Not a directory: ${resolvedDir}`);
  }

  return fs.promises.readdir(resolvedDir);
};

const moveFiles = async (srcPath, destPath, safeRoot) => {
  const files = await safeReaddir(srcPath, safeRoot);

  for (const file of files) {
    const fileName = path.basename(file);
    if (SKIP_FILES.includes(fileName)) continue;

    const resolvedSrc = path.resolve(srcPath, file);
    const resolvedDest = path.resolve(destPath, file);

    const stats = await fs.promises.lstat(resolvedSrc);

    if (stats.isSymbolicLink()) {
      console.warn(`Skipping symbolic link: ${resolvedSrc}`);
      continue;
    }

    if (stats.isDirectory()) {
      await createDirIfNotExists(resolvedDest);
      await moveFiles(resolvedSrc, resolvedDest, safeRoot);
    } else {
      await createDirIfNotExists(path.dirname(resolvedDest));
      await safeMoveFile(resolvedSrc, resolvedDest);
    }
  }
};

const main = async () => {
  try {
    const zipPath = path.join(tmpDir, "archive.zip");

    let folderName = process.argv[2];
    if (folderName === ".") {
      folderName = path.basename(process.cwd());
    } else if (!folderName) {
      folderName = await promptForFolderName();
    }

    // Sanitize the provided folder name to prevent path traversal or absolute paths
    const sanitizeFolderName = (name) => {
      if (!name) return "";
      // If user provided '.', use current dir basename
      if (name === ".") return path.basename(process.cwd());
      // Disallow absolute paths
      if (path.isAbsolute(name)) {
        console.warn(
          "Absolute paths are not allowed for destination; using basename.",
        );
        name = path.basename(name);
      }
      // Disallow parent traversal and nested paths
      if (name === ".." || name.includes(path.sep) || name.includes("..")) {
        console.warn(
          "Path traversal detected in destination name; using basename of input.",
        );
        name = path.basename(name);
      }
      // Finally, ensure it's a single path segment
      name = path.basename(name);
      if (!name) throw new Error("Invalid destination folder name");
      return name;
    };

    folderName = sanitizeFolderName(folderName);

    if (folderName === path.basename(process.cwd())) {
      console.log(
        chalk.yellow(
          "\nYou are creating a project inside the current directory.\n",
        ),
      );
    }

    console.log(
      chalk.green(`Creating project in ${chalk.bold(`./${folderName}`)}\n`),
    );

    const destDir = path.join(process.cwd(), folderName);

    if (fs.existsSync(destDir)) {
      const replace = await promptForReplace(destDir);
      if (replace) {
        await removeDir(destDir);
        await createDirIfNotExists(destDir);
      } else {
        console.log("Operation aborted.");
        rl.close();
        process.exit(0);
      }
    } else {
      await createDirIfNotExists(destDir);
    }

    await downloadFile(GITHUB_ZIP_URL, zipPath);

    await extractZip(zipPath, tmpDir);

    const extractedItems = fs.readdirSync(tmpDir);

    const extractedFolderName = extractedItems.find((item) => {
      const fullPath = path.join(tmpDir, item);

      return fs.lstatSync(fullPath).isDirectory() && item.startsWith("afront-");
    });

    if (!extractedFolderName) {
      throw new Error("Extraction failed: extracted folder not found.");
    }

    const extractedFolderPath = path.join(tmpDir, extractedFolderName);

    await moveFiles(extractedFolderPath, destDir, tmpDir);

    // Remove any bundled lockfiles from the extracted archive to avoid integrity
    // checksum mismatches originating from the release zip's lockfile.
    try {
      await safeUnlink(path.join(destDir, "package-lock.json")).catch(() => {});
      await safeUnlink(path.join(destDir, "npm-shrinkwrap.json")).catch(
        () => {},
      );
    } catch (e) {
      // ignore
    }

    if (!fs.existsSync(path.join(destDir, "package.json"))) {
      throw new Error("package.json not found after extraction.");
    }

    await runNpmInstall(destDir);

    console.log(chalk.green("\n✔ AFront project created successfully!\n"));

    console.log(chalk.bold("Next steps:"));
    console.log(chalk.cyan(`  cd ${folderName}`));
    console.log(chalk.cyan("  npm start\n"));

    console.log(chalk.gray("Happy building with AFront 🚀"));

    rl.close();
    cleanup();
    process.exit(0);
  } catch (err) {
    console.error(chalk.red("✖ Error:"), err.message);
    rl.close();
    process.exit(1);
  }
};

const showBanner = () => {
  console.log(
    chalk.cyan.white(`
██████████████████████████████████████████████████
██████████████████████████████████████████████████
██████████████████████████████████████████████████
██████████████████████████████████████████████████
██████████████████████████████████████████████████
██████████████████████████████████████    ████████
████████████████████████████████████    ██████████
██████████████████████████████████     ███████████
████████████████████████████████     █████████████
██████████████████████████████     ███████████████
████████████████████████████     █████████████████
███████████████████████████    ███████████████████
█████████████████████████     ████████████████████
███████████████████████     ██████████████████████
█████████████████████     ████████████████████████
███████████████████     ██████████████████████████
█████████████████     ████████████████████████████
████████████████    ██████████████████████████████
██████████████    ████████████████████████████████
████████████     █████████████████████████████████
██████████     ███████████████████████████████████
████████     █████████████████████████████████████
██████████████████████████████████████████████████
██████████████████████████████████████████████████
██████████████████████████████████████████████████
██████████████████████████████████████████████████
██████████████████████████████████████████████████

`),
  );

  console.log(
    chalk.cyan.bold(`
 █████╗ ███████╗██████╗  ██████╗ ███╗   ██╗████████╗
██╔══██╗██╔════╝██╔══██╗██╔═══██╗████╗  ██║╚══██╔══╝
███████║█████╗  ██████╔╝██║   ██║██╔██╗ ██║   ██║   
██╔══██║██╔══╝  ██╔══██╗██║   ██║██║╚██╗██║   ██║   
██║  ██║██║     ██║  ██║╚██████╔╝██║ ╚████║   ██║   
╚═╝  ╚═╝╚═╝     ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═══╝   ╚═╝   
`),
  );

  console.log(chalk.cyan.bold(`⚡ AFront v${VERSION}\n`));
  console.log(chalk.gray("The Future-Ready Frontend Framework\n"));
  console.log(chalk.gray("🚀 https://afront.dev\n"));
};

(async () => {
  try {
    showBanner();
    await main();
  } catch (err) {
    console.error(chalk.red("✖ Fatal Error:"), err.message);
    cleanup();
    process.exit(1);
  }
})();
