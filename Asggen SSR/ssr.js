require("@babel/register")({
  presets: ["@babel/preset-env", "@babel/preset-react"],
});

const express = require("express");
const fs = require("fs").promises;
const path = require("path");
const helmet = require("helmet");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const { StaticRouter } = require("react-router");
const App = require("../src/App").default;
const headHtml = require("./Head");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT;
const HOST = process.env.HOST;

// Disable the X-Powered-By header to avoid exposing Express
app.disable("x-powered-by");

// Use Helmet to set various HTTP headers for better security
app.use(helmet());

const buildProdPath = path.resolve(__dirname, "../build-prod");

// Handle the root route
app.get("/", async (req, res) => {
  try {
    await createReactApp(req.url, res);
  } catch (err) {
    console.error("Error reading index file:", err);
    res.status(500).send("Error loading the index file");
  }
});

app.use(express.static(buildProdPath));

// Handle all other routes
app.get("*", async (req, res) => {
  try {
    await createReactApp(req.url, res);
  } catch (error) {
    console.error("Error rendering app:", error);
    res.status(500).send("Internal Server Error");
  }
});

const createReactApp = async (location, res) => {
  const context = {};
  let didError = false;

  const stream = ReactDOMServer.renderToPipeableStream(
    <StaticRouter location={location} context={context}>
      <App context={context} />
    </StaticRouter>,
    {
      onShellReady() {
        res.statusCode = didError ? 500 : 200;
        res.setHeader("Content-type", "text/html");

        fs.readFile(path.resolve(buildProdPath, "index.html"), "utf8")
          .then((html) => {
            const updatedHtml = headHtml(html, context);
            // console.log(context);
            const [head] = updatedHtml.split(
              '<asggenapp id="asggen"></asggenapp>'
            );
            res.write(head + `<asggenapp id="asggen">`);
            stream.pipe(res, { end: false });
          })
          .catch((err) => {
            console.error("Error reading index file:", err);
            res.status(500).send("Internal Server Error");
          });
      },
      onShellError(error) {
        didError = true;
        console.error("Error during onShellError:", error);
        res.status(500).send("Internal Server Error");
      },
      onError(error) {
        didError = true;
        console.error("Error during streaming:", error);
      },
    }
  );
};

app.listen(PORT, HOST, () => {
  console.log(`Server is running on port http://${HOST}:${PORT}`);
});
