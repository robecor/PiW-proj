const express = require('express');
const http = require("http");
const path = require("path");
const {startWebsocket} = require("./websocketServer.js");

const app = express();
const server = http.createServer(app);

//Define the absolute path and the view path
const absolutePath = `${__dirname}/../../`;
const viewPath = `${absolutePath}/client/views`;

server.listen(3005, function () {
  console.log("Started the websocket server at 3005");

  //Start the websocket server
  startWebsocket(server);
});

app.use(express.static(viewPath));

app.get("/", function (req, res) {
  res.sendFile(path.join(`${viewPath}/index.html`));
});
app.get("/docs", function (req, res) {
  res.set({
    'Content-Type': 'text/html'
  });

  res.sendFile(path.join(`${viewPath}/docs.html`));
});
app.get("/steps-docs", function (req, res) {
  res.set({
    'Content-Type': 'text/html'
  });

  res.sendFile(path.join(`${viewPath}/steps-docs.html`));
});
app.get("/progress-docs", function (req, res) {
  res.set({
    'Content-Type': 'text/html'
  });

  res.sendFile(path.join(`${viewPath}/progress-docs.html`));
});
app.get("/guide-docs", function (req, res) {
  res.set({
    'Content-Type': 'text/html'
  });

  res.sendFile(path.join(`${viewPath}/guide-docs.html`));
});
app.get("/uml-docs.xml", function (req, res) {
  res.set({
    'Content-Type': 'text/xml'
  });

  res.sendFile(path.join(`${viewPath}/docs/PiW-architecture.xml`));
});
app.get("/uml-docs.png", function (req, res) {
  res.set({
    'Content-Type': 'image/png'
  });

  res.sendFile(path.join(`${viewPath}/docs/PiW-architecture.png`));
});

app.listen(3000, function () {
  console.log("App open on port 3000!");
});