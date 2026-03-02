#!/usr/bin/env node

if (require.main !== module) {
  return;
}

const os = require("os");
const chalk = require("chalk");
const webpack = require("webpack");
const WebSocket = require("ws");
const WebpackDevServer = require("webpack-dev-server");
const packageJson = require("./package.json");
const config = require("./webpack.dev.js");
const { exec } = require("child_process");

const VERSION = packageJson.version;

/* -------------------------------------------------- */
/* Banner */
/* -------------------------------------------------- */

const showBanner = () => {
  console.log(
    chalk.white(`
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
  console.log(chalk.gray("The Future-Ready Frontend Framework"));
  console.log(chalk.gray("🚀 https://afront.asggen.com\n"));
};

console.clear();
showBanner();

/* -------------------------------------------------- */
/* Server Info */
/* -------------------------------------------------- */

const port = process.env.PORT || config.devServer.port || 9999;
config.devServer.port = port;

console.log(
  chalk.green("➜ Local:   ") + chalk.white(`http://localhost:${port}`),
);

let networkUrl = null;

const networkInterfaces = os.networkInterfaces();

for (const name of Object.keys(networkInterfaces)) {
  for (const net of networkInterfaces[name]) {
    if (net.family === "IPv4" && !net.internal) {
      networkUrl = `http://${net.address}:${port}`;

      console.log(chalk.green("➜ Network: ") + chalk.white(networkUrl));
    }
  }
}

console.log("");

/* -------------------------------------------------- */
/* Browser → Terminal Log Bridge */
/* -------------------------------------------------- */

const wss = new WebSocket.Server({ port: 9797 });

wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message.toString());

      const level = data.level?.toUpperCase() || "INFO";
      const text = data.message || "";

      if (level === "ERROR") {
        console.log(chalk.red("[Browser][ERROR]"), chalk.white(text));
      } else if (level === "WARN") {
        console.log(chalk.yellow("[Browser][WARN]"), chalk.white(text));
      } else {
        console.log(chalk.cyan("[Browser][INFO]"), chalk.white(text));
      }
    } catch {
      console.log(chalk.magenta("[Browser]"), message.toString());
    }
  });
});

/* -------------------------------------------------- */
/* Webpack Dev Server */
/* -------------------------------------------------- */

let isFirstCompile = true;

const compiler = webpack(config);

// Real compile hook (professional way)
compiler.hooks.done.tap("afront", async (stats) => {
  const time = stats.endTime - stats.startTime;

  if (stats.hasErrors()) {
    console.log(chalk.red("✖ Compilation failed\n"));
    return;
  }

  if (isFirstCompile) {
    console.log(chalk.green(`✔ Ready in ${time}ms\n`));
    isFirstCompile = false;

    const url = networkUrl || `http://localhost:${port}`;
    let command;

    if (process.platform === "darwin") {
      command = `open "${url}"`;
    } else if (process.platform === "win32") {
      command = `cmd /c start "" "${url}"`;
    } else {
      command = `xdg-open "${url}"`;
    }

    if (!process.env.CI && process.stdout.isTTY) {
      exec(command, (err) => {
        if (err) {
          console.log(chalk.yellow("Could not open browser automatically"));
        }
      });
    }
  } else {
    console.log(chalk.cyan(`↻ Rebuilt in ${time}ms`));
  }
});

// Start dev server
const server = new WebpackDevServer(config.devServer, compiler);

server.start().catch((err) => {
  console.error(chalk.red("Failed to start server"));
  console.error(err);
  process.exit(1);
});

/* -------------------------------------------------- */
/* Graceful Shutdown */
/* -------------------------------------------------- */

process.on("SIGINT", async () => {
  console.log("\n");
  console.log(chalk.yellow("Shutting down AFront..."));

  await server.stop();
  process.exit(0);
});
