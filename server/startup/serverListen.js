const express = require('express');
const app = express();

app.get("/", function (req, res) {
  console.log("Hello world");
  res.send("Hello world!")
});

app.listen(3000, function () {
  console.log("App open on port 3000!");
});