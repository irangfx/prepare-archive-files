require('dotenv').config()

const fs = require('fs');
var path = require('path');
const Client = require('ftp');

// SOURCE FTP CONNECTION SETTINGS
const srcFTP = {
    host: process.env.FTP_HOST,
    port: process.env.FTP_PORT,
    user: process.env.FTP_USERNAME,
    password: process.env.FTP_PASSWORD
}

const basePath = 'public_html/premium/wall/';


fs.readdir('./', function (err, files) {
    if (err) throw err;

    files.filter(function (file) {
        return file.match(/\.rar$/)
    }).forEach(function (file) {
        console.log(file);
        

        // const ftpUpload = new Client();

        // ftpUpload.on('ready', function () {
        //     ftpUpload.put(file, basePath + file, function (err) {
        //         if (err) throw err;
        //         ftpUpload.end();
        //     });
        // });

        // ftpUpload.connect(srcFTP);
    });
});