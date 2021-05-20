const fs = require("fs");
const { google } = require("googleapis");
const drive = google.drive("v3");
const config = require('config');
const logger = require("./logger");

async function sendFileToGoogleDrive({fileName, path, folderId}){
    try{
        const client_email = config.get('client_email');
        const private_key = config.get('private_key');
        const fixedKey = private_key.replace(new RegExp("\\\\n", "\g"), "\n")
        const jwToken = new google.auth.JWT(
            client_email,
            null,
            fixedKey,
            ["https://www.googleapis.com/auth/drive"],
            null
        );

        jwToken.authorize();

        const fileMetadata = { 'name': fileName, parents: [folderId] };
        const media = { mimeType: 'application/zip', body: fs.createReadStream(path) };
        
        await drive.files.create({
            auth: jwToken,
            resource: fileMetadata,
            media: media,
        });

        logger.info(`Send file: "${fileName}" to gdrive`);
    }
    catch(ex){
        logger.info(`Send file to gdrive failed - file name: "${fileName}"; error: ${JSON.stringify(err)}`);
    }
}

module.exports = {
    sendFileToGoogleDrive
};
