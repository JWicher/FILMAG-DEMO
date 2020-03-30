const config = require('config');
const express = require('express');
const app = express();

require("./startup/cors")(app);
require('./startup/routes')(app);
require('./startup/config')();
require('./startup/db')();
require('./startup/prod')(app);

const port = process.env.PORT || config.get("port");
const server = app.listen(port, () =>
  console.log(`Słucham portu ${port}...`)
);

module.exports = server;