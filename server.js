const express = require('express');
const config = require('config');
const app = express();
const appServer = require("http").createServer(app);
const io = require("socket.io")(appServer);

const port = process.env.PORT || config.get("port");

require("./startup/cors")(app);
require('./startup/routes')(app, io);
require('./startup/config')();
require('./startup/db')();
require('./startup/crons')(io);
require('./startup/prod')(app);

const server = appServer.listen(port, () =>{
  console.log(`Listening to port ${port}...`)
});

module.exports = server;