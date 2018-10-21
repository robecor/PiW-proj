const express = require('express');
const http = require("http");
const path = require("path");
const { startWebsocket } = require("./websocketServer.js");

const app = express();
const server = http.createServer(app);

//Define the absolute path and the view path
const absolutePath = `${__dirname}/../../`;
const viewPath = `${absolutePath}/client/views`;

server.listen(3005, function() {
  console.log("Started the websocket server at 3005");

  //Start the websocket server
  startWebsocket(server);
});

app.use(express.static(viewPath));

app.get("/", function (req, res) {
  res.sendFile(path.join(`${viewPath}/index.html`));
});

app.listen(3000, function () {
  console.log("App open on port 3000!");
});