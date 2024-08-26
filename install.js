#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { https } = require('follow-redirects');
const { exec } = require('child_process');
const tmp = require('tmp');
const AdmZip = require('adm-zip');
const readline = require('readline');

// Configuration
const GITHUB_ZIP_URL = 'https://github.com/Asggen/afront/archive/refs/tags/v1.0.8.zip'; // Updated URL

// Define files to skip
const SKIP_FILES = ['FUNDING.yml', 'CODE_OF_CONDUCT.md', 'SECURITY.md', 'install.js'];

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
      fs.unlink(destination, () => reject(err));
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
    exec('npm install', { cwd: directory }, (err, stdout, stderr) => {
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
    fs.rm(dirPath, { recursive: true, force: true }, (err) => {
      if (err) {
        return reject(err);
      }
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
        if (SKIP_FILES.includes(file)) {
          if (!--pending) resolve();
          return;
        }

        const srcFile = path.join(srcPath, file);
        const destFile = path.join(destPath, file);
        fs.stat(srcFile, (err, stats) => {
          if (err) {
            return reject(err);
          }
          if (stats.isDirectory()) {
            createDirIfNotExists(destFile)
              .then(() => moveFiles(srcFile, destFile))
              .then(() => {
                if (!--pending) resolve();
              })
              .catch(reject);
          } else {
            fs.rename(srcFile, destFile, (err) => {
              if (err) {
                return reject(err);
              }
              if (!--pending) resolve();
            });
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
