const express = require('express');
const app = express();
const path = require("path");

//Define the absolute path and the view path
const absolutePath = `${__dirname}/../../`;
const viewPath = `${absolutePath}/client/views`;

app.use(express.static(viewPath));

app.get("/", function (req, res) {
  res.sendFile(path.join(`${viewPath}/index.html`));
});

app.listen(3000, function () {
  console.log("App open on port 3000!");
});