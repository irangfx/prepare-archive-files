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

const c = new Client();
const downloadList = [];
const uploadList = [];
const basePath = 'public_html/premium/wall/'

c.on('ready', function () {
    c.list(basePath, function (err, list) {
        if (err) throw err;

        list.map(function (entry) {
            if (entry.name.match(/\.rar$/))
                downloadList.push(entry.name);
        });

        downloadList.map(function (file) {
            c.get(basePath + file, function (err, stream) {
                if (err) throw err;
                stream.once('close', function () { c.end(); });
                stream.pipe(fs.createWriteStream(file));
                console.log('Finish Download  => ' + file);
            });
        });

        downloadList.forEach(file => {
            const extension = path.extname(file);
            const newName = file.replace('tarhan.ir', 'irangfx.com').replace(extension, '');
            if (extension === '.rar') {
                exec(`./rar-extractor.sh '${file}' '${newName}'`, (error, stdout, stderr) => {
                    uploadList.push(newName + '.rar');
                });
            } else if (extension === '.zip') { }
        });

        c.end();
    });
});

c.on('end', function () {

    if (uploadList.length > 0) {

        console.log("Uploading...");

        var d = new Client();
        d.on('ready', function () {
            uploadList.map(function (filename) {
                d.put(filename, basePath + filename, function (err) {
                    if (err) throw err;
                    d.end();
                });
            });
        });

        d.connect(srcFTP);

    } else {
        console.log("Error: Download list empty.");
    }
});

c.connect(srcFTP);