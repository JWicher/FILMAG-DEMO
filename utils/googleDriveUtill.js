const fs = require("fs");
const { google } = require("googleapis");
const drive = google.drive("v3");
const config = require('config');

async function sendFileToGoogleDrive({fileName, path}){
    
    try{
        const client_email = config.get('client_email');
        const private_key = config.get('private_key');
        const folderId = config.get('folderId');
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
        const media = { mimeType: 'application/zip', body: fs.createReadStream( path ) };
        
        await drive.files.create({
            auth: jwToken,
            resource: fileMetadata,
            media: media,
        });

    }
    catch(ex){
        console.error(ex)
    }
}

module.exports.sendFileToGoogleDrive = sendFileToGoogleDrive;