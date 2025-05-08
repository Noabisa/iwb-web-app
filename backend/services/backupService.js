const { google } = require('googleapis');
const fs = require('fs');
const { exec } = require('child_process');
require('dotenv').config();

const KEYFILEPATH = 'service-account.json';
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: SCOPES,
});

async function uploadToDrive(filePath, fileName) {
  const drive = google.drive({ version: 'v3', auth: await auth.getClient() });

  const fileMetadata = {
    name: fileName,
  };

  const media = {
    mimeType: 'application/sql',
    body: fs.createReadStream(filePath),
  };

  const response = await drive.files.create({
    requestBody: fileMetadata,
    media: media,
    fields: 'id',
  });

  return response.data.id;
}

async function backupDatabase() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const fileName = `backup-${timestamp}.sql`;
  const filePath = `./${fileName}`;

  const dumpCommand = `mysqldump -u ${process.env.DB_USER} -p${process.env.DB_PASSWORD} ${process.env.DB_NAME} > ${fileName}`;

  return new Promise((resolve, reject) => {
    exec(dumpCommand, async (err) => {
      if (err) {
        console.error('Backup failed:', err);
        return reject(err);
      }

      try {
        const fileId = await uploadToDrive(filePath, fileName);
        fs.unlinkSync(filePath); // delete local file
        resolve(fileId);
      } catch (uploadErr) {
        reject(uploadErr);
      }
    });
  });
}

module.exports = { backupDatabase };
