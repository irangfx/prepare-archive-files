require('dotenv').config()

const fs = require('fs');
var path = require('path');
const Client = require('ftp');
const { exec } = require('child_process');

const srcFTP = {
    host: process.env.FTP_HOST,
    port: process.env.FTP_PORT,
    user: process.env.FTP_USERNAME,
    password: process.env.FTP_PASSWORD
}

const ftpList = new Client();
const ftpUpload = new Client();
const ftpDownload = new Client();

const UploadList = [];
const downloadList = [];
const basePath = '/imap/pz10448.parspack.net/public_html/premium/New/';

ftpList.on('ready', function () {
    ftpList.list(basePath, function (err, list) {
        if (err) throw err;

        list.forEach(entry => {
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

ftpDownload.on('ready', function () {
    downloadList.forEach(file => {
        if (fs.existsSync(file)) {
            console.log('File Already Exist => ' + file);
            return;
        }

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
        const newName = file.replace('tarhan.ir', 'irangfx.com');

        if (fs.existsSync(newName)) {
            console.log('File Already Exist => ' + file);
            return;
        }

        exec(`./rar-extractor.sh '${file}' '${newName}'`, (error, stdout, stderr) => {
            console.log('Extract Finish => ' + newName);
            UploadList.push(newName);
        });
    });

    // ftpUpload.connect(srcFTP);
});

ftpUpload.on('ready', function () {
    UploadList.forEach(file => {
        console.log('Uplaod File => ' + file);

        ftpUpload.put(file, basePath + file, function (err) {
            if (err) throw err;
            console.log('Uplaoded File => ' + file);
            ftpUpload.end();
        });
    });
});


// Run FTP
ftpList.connect(srcFTP);