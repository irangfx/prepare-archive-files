require('dotenv').config()

const fs = require('fs');
var path = require('path');
const Client = require('ftp');
const { exec } = require('child_process');

// SOURCE FTP CONNECTION SETTINGS
const srcFTP = {
    host: process.env.FTP_HOST,
    port: process.env.FTP_PORT,
    user: process.env.FTP_USERNAME,
    password: process.env.FTP_PASSWORD
}

const ftpList = new Client();
const ftpUpload = new Client();
const ftpDownload = new Client();

const downloadList = [];
const uploadList = [];
const basePath = 'public_html/premium/New/'

ftpList.on('ready', function () {
    ftpList.list(basePath, function (err, list) {
        if (err) throw err;

        list.map(function (entry) {
            if (entry.name.match(/\.rar$/))
                downloadList.push(entry.name);
        });

        ftpList.end();
    });
});

ftpList.on('end', function () {
    if (downloadList.length > 0)
        ftpDownload.connect(srcFTP);
    else console.log("Error: Download list empty.");
});

ftpList.connect(srcFTP);

ftpDownload.on('ready', function () {
    downloadList.forEach(file => {
        console.log('Start Download  => ' + file);
        ftpDownload.get(basePath + file, function (err, stream) {
            if (err) throw err;
            stream.once('close', function () { ftpDownload.end(); });
            stream.pipe(fs.createWriteStream(file));
            console.log('Finish Download  => ' + file);
        });
    });

    ftpDownload.end();
});

ftpDownload.on('end', function () {
    downloadList.forEach(file => {
        const extension = path.extname(file);
        const newName = file.replace('tarhan.ir', 'irangfx.com').replace(extension, '');
        if (extension === '.rar') {
            exec(`./rar-extractor.sh '${file}' '${newName}'`, (error, stdout, stderr) => {
                uploadList.push(newName + '.rar');
                console.log('Extract Finish => ' + newName + '.rar');
            });
        } else if (extension === '.zip') { }
    });

    ftpUpload.connect(srcFTP);
});

ftpUpload.on('ready', function () {
    uploadList.forEach(filename => {
        console.log("Start Uploading => " + filename);
        ftpUpload.put(filename, basePath + filename, function (err) {
            if (err) throw err;
            console.log("Finish Uploading => " + filename);
            ftpUpload.end();
        });
    });
});