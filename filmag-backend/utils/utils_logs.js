const config = require('config');
const fs = require("fs-extra");
const { zip } = require('zip-a-folder');
const googleDriveUtill = require('./googleDriveUtill');
const logger = require("./logger");

const directory = "./applogs";
const tempFolderPath = `${directory}/temp`;

function zipLogs(){
    return Promise.resolve()
        .then(() => {
            return fs.mkdir(tempFolderPath);
        })
        .catch((err) => {})
        .then(() => {
            return fs.readdir(directory)
        .then(async (files) => {
            const logFiles = files.filter(filename => filename.endsWith('.log') )
            const promises = logFiles.map( async (fileName) => {
                await fs.copy(`${directory}/${fileName}`, `${tempFolderPath}/${fileName}`) 
            });

            return Promise.all(promises).then(()=> logFiles);
        })
        .then( async (logFiles) => {
            const fileName = `FILMAG-EKOPAK_LOGS_${new Date().toISOString().slice(0, 13)}.zip`;
            await zip(tempFolderPath, `${directory}/${fileName}`);

            logger.info("Backup logs - zipped with success");

            return {zipFile: fileName, logFiles};
        })
    })
}

function cleanLogFiles(logFiles) {
    return Promise.resolve()
        .then(() => {
            return fs.readdir(directory)
        })
        .then( async (files) => {
            const zipFiles = files.filter(filename => filename.endsWith('.zip') );
            const filesToRemove = [...logFiles, ...zipFiles]
            await fs.remove(tempFolderPath);

            const promises = filesToRemove.map( async (fileName) => {
                await fs.remove(`${directory}/${fileName}`) 
            });
            return Promise.all(promises);
        })
        .then(() => {
            logger.info("Backup logs - removed logs and .zip files");
        })
}

const utils_logs = {
    async makeLogsBackup() {
        logger.info("Backup logs - [start]");

        try{
            const {zipFile: fileName, logFiles} = await zipLogs();
            
            const folderId = config.get('backupFolderId_Logs');
            
            await googleDriveUtill.sendFileToGoogleDrive({ fileName, path: `${directory}/${fileName}`, folderId });
            await cleanLogFiles(logFiles);
        }
        catch(err){
            logger.info(`Backup logs - error: ${JSON.stringify(err)}`);
        }

        logger.info("Backup logs - [end]");
    }
}

module.exports = utils_logs