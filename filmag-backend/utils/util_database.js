const exec = require('child_process').exec;
const fs = require("fs-extra");
const config = require('config');
const { zip } = require('zip-a-folder');
const googleDriveUtill = require('./googleDriveUtill');
const Task = require('../models/task');
const logger = require("./logger");

async function makeBackupDB() {
    try {
        const pathToBackupDBFolder = "./temporaryBackupDB";
        const fileName = `FILMAG-EKOPAK_${new Date().toISOString().slice(0, 13)}.zip`;
        const pathToBackupDBFile = pathToBackupDBFolder + "/" + fileName;
        const pathToDumpFolder = pathToBackupDBFolder + "/dump";
        const basicMongodumpCommand = config.get('mongodumpCommand');
        const fullMongodumpCommand = `${basicMongodumpCommand} --out ${pathToDumpFolder}`;

        exec(fullMongodumpCommand, async (error) => {
            if (!error) {
                await zip(pathToDumpFolder, pathToBackupDBFile);

                const folderId = config.get('backupFolderId_DB');

                await googleDriveUtill.sendFileToGoogleDrive({ fileName, path: pathToBackupDBFile, folderId });
                await fs.remove(pathToBackupDBFolder);
        
                logger.info("DB backup successfully done and sended to cloud");
            }
        })
    }

    catch (ex) {
        logger.error(`Error while making DB backup. Error: ${JSON.stringify(ex)}`);
    }
}

async function increasePendingTime(io) {
    try {
        await Task.model.updateMany({
                isDone: false,
                time: { $lte: 1440 }
            },
            {
                $inc: {
                    time: +1,
                    partialTime: +1
                }
        });

        io.emit('tasks_updated', `Task time incrementation`);
    }
    catch (ex) {
        logger.error(`Error while increasing tasks time in DB. Error: ${JSON.stringify(ex)}`);
    }
};

module.exports = {
    makeBackupDB,
    increasePendingTime
};
