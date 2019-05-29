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

c.on('ready', function () {
    c.list('public_html/premium/wall/', function (err, list) {
        if (err) throw err;

        list.map(function (entry) {
            if (entry.name.match(/\.rar$/))
                downloadList.push(entry.name);
        });

        downloadList.map(function (file) {
            c.get('public_html/premium/wall/' + file, function (err, stream) {
                if (err) throw err;
                stream.once('close', function () { c.end(); });
                stream.pipe(fs.createWriteStream(file));
            });
        });

        files.forEach(file => {
            const extension = path.extname(file);
            const newName = file.replace('tarhan.ir', 'irangfx.com').replace(extension, '');
            if (extension === '.rar') {
                exec(`./rar-extractor.sh '${file}' '${newName}'`, (error, stdout, stderr) => {
                    c.put(newName + '.rar', 'public_html/premium/wall/' + newName + '.rar', function (err) {
                        if (err) throw err;
                    });
                });
            } else if (extension === '.zip') { }
        });

        c.end();
    });
});

c.on('end', function () {
    console.log(downloadList);
});

c.connect(srcFTP);