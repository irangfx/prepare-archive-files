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

const ftpUpload = new Client();

const downloadList = [];
const basePath = '/imap/pz10448.parspack.net/public_html/premium/New/'

ftpUpload.on('ready', function () {
    ftpUpload.list(basePath, function (err, list) {
        if (err) throw err;

        list.forEach(entry => {
            if (entry.name.match(/\.rar$/))
                downloadList.push(entry.name);
        });

        ftpUpload.end();
    });
});

ftpUpload.on('end', function () {
    console.log("Error: Download list empty.");
});

ftpUpload.connect(srcFTP);