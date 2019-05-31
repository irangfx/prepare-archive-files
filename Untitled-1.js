require('dotenv').config()

const fs = require('fs');
var path = require('path');
const Client = require('ftp');
const { exec } = require('child_process');

var EasyFtp = require('easy-ftp');
var ftp = new EasyFtp();

var config = {
    host: process.env.FTP_HOST,
    port: process.env.FTP_PORT,
    user: process.env.FTP_USERNAME,
    password: process.env.FTP_PASSWORD,
    type : 'ftp'
};
 
ftp.connect(config);

const downloadList = [];
const basePath = 'public_html/premium/wall/'

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
                console.log('Extract Finish => ' + newName + '.rar');
            });
        } else if (extension === '.zip') { }
    });
});