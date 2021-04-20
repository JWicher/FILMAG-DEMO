const fs = require("fs-extra");
const exec = require('child_process').exec
const config = require('config');
const { sendFileToGoogleDrive } = require('./googleDriveUtill');
const { zip } = require('zip-a-folder');
const Task = require('../models/task');

async function makeBackupDB() {
    try {
        const fileName = `FILMAG-EKOPAK_${new Date().toISOString().slice(0, 13)}.zip`;
        const path = "temporaryBackupDB/" + fileName;
        const mongodumpCommand = config.get('mongodumpCommand');
        const pathToFolder = __dirname + "/../temporaryBackupDB";

        exec(mongodumpCommand, async (err, stdout, stderr) => {
            if (!err) {
                await zip(pathToFolder + "/dump", path)
                await sendFileToGoogleDrive({ fileName, path })
                await fs.remove(pathToFolder);
                console.log("Wykonano backup, przesłano na chmurę i kopię usunięto z serwera.")
            }
        })
    }

    catch (ex) {
        console.log('Wystąpił błąd podczas wykonywnia backupu DB:', ex)
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
            }
        )
    io.emit('tasks_updated', `Task time incrementation`);
    }
    catch (ex) { console.log(ex) }
};

module.exports = {
    makeBackupDB,
    increasePendingTime
}