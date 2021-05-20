const express = require('express');
const config = require('config');
const logger = require("./utils/logger");
const { ioOptions } = require("./utils/util_sockeio");

function startServerListening(appServer){
    const port = process.env.PORT || config.get("port");

    return new Promise((resolve, reject) => {
        const server = appServer.listen(port, () =>{
            logger.info(`✔︎ - Listening on port ${port}...`);
            resolve(server)
        });
    })
}

async function start(){
    logger.info('Starting app!');
    
    const app = express();
    const appServer = require("http").createServer(app);
    const io = require("socket.io")(appServer, ioOptions);
    
    require('./startup/config')();
    require("./startup/cors")(app);
    require('./startup/routes')(app, io);
    require('./startup/crons')(io);
    require('./startup/prod')(app);
    await require('./startup/db')();
    
    const server = await startServerListening(appServer);

    server.on("error", (error) => {
        logger.error(`✖ - Shutting down app. Fatal error: ${error}`);
        process.exit(1);
    })

    logger.info('App setup complited!');
    logger.info('====================');
    logger.warn('usun sciezke do backupd db dub: --out sciezka');
    logger.warn('podmien custom evinronment dla folderId zrzut gdrive ');

    return server
}

module.exports = {
    start
};
