#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { https } = require('follow-redirects');
const { exec } = require('child_process');
const os = require('os');
const tmp = require('tmp');
const AdmZip = require('adm-zip');
const readline = require('readline');

// Configuration
const GITHUB_ZIP_URL = 'https://github.com/Asggen/afront/archive/refs/tags/v1.0.20.zip'; // Updated URL

// Define files to skip
const SKIP_FILES = ['FUNDING.yml', 'CODE_OF_CONDUCT.md', 'SECURITY.md', 'install.js', '.npmrc'];

// Initialize readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Spinner function
const spinner = (text, delay = 100) => {
  const spinnerChars = ['|', '/', '-', '\\'];
  let i = 0;
  const interval = setInterval(() => {
    readline.cursorTo(process.stdout, 0);
    process.stdout.write(`${text} ${spinnerChars[i++]}`);
    i = i % spinnerChars.length;
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
    const stopSpinner = spinner('Downloading');
    https.get(url, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        return downloadFile(response.headers.location, destination).then(resolve).catch(reject);
      }
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download file. Status code: ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(() => {
          if (fs.statSync(destination).size > 0) {
            stopSpinner();
            resolve();
          } else {
            stopSpinner();
            reject(new Error('Downloaded file is empty.'));
          }
        });
      });
    }).on('error', (err) => {
      // attempt to remove partial download only if it's inside allowed temp locations
      safeUnlink(destination).finally(() => reject(err));
    });
  });
};

const extractZip = (zipPath, extractTo) => {
  return new Promise((resolve, reject) => {
    const stopSpinner = spinner('Extracting');
    try {
      const zip = new AdmZip(zipPath);
      zip.extractAllTo(extractTo, true);
      fs.readdir(extractTo, (err, files) => {
        if (err) {
          stopSpinner();
          console.error('Error reading extracted folder:', err);
          reject(err);
        } else {
          stopSpinner();
          resolve();
        }
      });
    } catch (err) {
      stopSpinner();
      console.error('Error extracting zip file:', err);
      reject(err);
    }
  });
};

const runNpmInstall = (directory) => {
  return new Promise((resolve, reject) => {
    const stopSpinner = spinner('Running npm install');
    exec('npm install --legacy-peer-deps --no-audit --no-fund', { cwd: directory }, (err, stdout, stderr) => {
      if (err) {
        stopSpinner();
        console.error('Error running npm install:', stderr);
        reject(err);
      } else {
        stopSpinner();
        console.log('npm install output:', stdout);
        resolve();
      }
    });
  });
};

const createDirIfNotExists = (dirPath) => {
  return new Promise((resolve, reject) => {
    fs.mkdir(dirPath, { recursive: true }, (err) => {
      if (err) {
        reject(new Error('Error creating directory:', err));
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

const safeUnlink = async (targetPath, extraAllowedRoots = []) => {
  const allowed = [process.cwd(), os.tmpdir(), ...extraAllowedRoots].map((p) => path.resolve(p));
  const resolved = path.resolve(targetPath);
  if (!allowed.some((root) => isPathInside(root, resolved))) {
    throw new Error(`Refusing to unlink outside allowed roots: ${resolved}`);
  }
  try {
    await fs.promises.unlink(resolved);
  } catch (e) {
    // ignore missing file errors
    if (e.code !== 'ENOENT') throw e;
  }
};

const safeRm = (dirPath, cb) => {
  const resolved = path.resolve(dirPath);
  if (!isPathInside(process.cwd(), resolved)) {
    return cb(new Error(`Refusing to remove directory outside current working directory: ${resolved}`));
  }
  fs.rm(resolved, { recursive: true, force: true }, cb);
};

// Perform an atomic-safe move: open source with O_NOFOLLOW, stream to a temp file, fsync, then rename
const safeMoveFile = async (resolvedSrc, resolvedDest) => {
  const srcFlags = fs.constants.O_RDONLY | fs.constants.O_NOFOLLOW;
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
      throw new Error('Source is a directory');
    }

    await createDirIfNotExists(path.dirname(resolvedDest));

    destHandle = await fs.promises.open(tmpName, fs.constants.O_WRONLY | fs.constants.O_CREAT | fs.constants.O_TRUNC, stats.mode);

    const bufferSize = 64 * 1024;
    const buffer = Buffer.allocUnsafe(bufferSize);
    let position = 0;
    while (true) {
      const { bytesRead } = await srcHandle.read(buffer, 0, bufferSize, position);
      if (!bytesRead) break;
      let written = 0;
      while (written < bytesRead) {
        const { bytesWritten } = await destHandle.write(buffer, written, bytesRead - written);
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
      await safeUnlink(tmpName, [path.dirname(resolvedDest)]).catch(() => {});
    } catch (e) {}
    try {
      if (srcHandle) await srcHandle.close();
    } catch (e) {}
    throw err;
  }
};

const promptForFolderName = async () => {
  const answer = await askQuestion('AFront: Enter the name of the destination folder: ');
  return answer;
};

const promptForReplace = async (dirPath) => {
  const answer = await askQuestion(`The directory ${dirPath} already exists. Do you want to replace it? (yes/no): `);
  return answer === 'yes' || answer === 'y';
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

const moveFiles = (srcPath, destPath) => {
  return new Promise((resolve, reject) => {
    fs.readdir(srcPath, (err, files) => {
      if (err) {
        return reject(err);
      }
      let pending = files.length;
      if (!pending) return resolve();
      files.forEach((file) => {
        // Normalize and validate file name to avoid path traversal
        const fileName = path.basename(file);
        if (SKIP_FILES.includes(fileName)) {
          if (!--pending) resolve();
          return;
        }

        const srcRoot = path.resolve(srcPath);
        const destRoot = path.resolve(destPath);
        const resolvedSrc = path.resolve(srcPath, file);
        const resolvedDest = path.resolve(destPath, file);

        // Ensure resolved paths are inside their respective roots
        if (
          !(resolvedSrc === srcRoot || resolvedSrc.startsWith(srcRoot + path.sep)) ||
          !(resolvedDest === destRoot || resolvedDest.startsWith(destRoot + path.sep))
        ) {
          console.warn(`Skipping suspicious path: ${file}`);
          if (!--pending) resolve();
          return;
        }

        // Use lstat to detect symlinks and refuse to follow them
        fs.lstat(resolvedSrc, (err, stats) => {
          if (err) {
            return reject(err);
          }

          if (stats.isSymbolicLink()) {
            console.warn(`Skipping symbolic link for safety: ${resolvedSrc}`);
            if (!--pending) resolve();
            return;
          }

          if (stats.isDirectory()) {
            createDirIfNotExists(resolvedDest)
              .then(() => moveFiles(resolvedSrc, resolvedDest))
              .then(() => {
                if (!--pending) resolve();
              })
              .catch(reject);
          } else {
                // Use atomic-safe move: copy from a non-following FD to temp file, then rename
                createDirIfNotExists(path.dirname(resolvedDest))
                  .then(() => {
                    safeMoveFile(resolvedSrc, resolvedDest)
                      .then(() => {
                        if (!--pending) resolve();
                      })
                      .catch(reject);
                  })
                  .catch(reject);
          }
        });
      });
    });
  });
};

const main = async () => {
  try {
    const tmpDir = tmp.dirSync({ unsafeCleanup: true });
    const zipPath = path.join(tmpDir.name, 'archive.zip');

    let folderName = process.argv[2];
    if (folderName === '.') {
      folderName = path.basename(process.cwd());
    } else if (!folderName) {
      folderName = await promptForFolderName();
    }

    const destDir = path.join(process.cwd(), folderName);

    if (fs.existsSync(destDir)) {
      const replace = await promptForReplace(destDir);
      if (replace) {
        await removeDir(destDir);
        await createDirIfNotExists(destDir);
      } else {
        console.log('Operation aborted.');
        rl.close();
        process.exit(0);
      }
    } else {
      await createDirIfNotExists(destDir);
    }

    await downloadFile(GITHUB_ZIP_URL, zipPath);
    console.log('Downloaded successfully.');

    await extractZip(zipPath, tmpDir.name);

    const extractedFolderName = fs.readdirSync(tmpDir.name)[0];
    const extractedFolderPath = path.join(tmpDir.name, extractedFolderName);

    fs.readdirSync(extractedFolderPath);

    await moveFiles(extractedFolderPath, destDir);

    await runNpmInstall(destDir);

    rl.close();

    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    rl.close();
    process.exit(1);
  }
};

main();
