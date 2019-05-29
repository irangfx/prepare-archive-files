require('dotenv').config()

var fs = require('fs');
var Client = require('ftp');

// SOURCE FTP CONNECTION SETTINGS
var srcFTP = {
    host: process.env.FTP_HOST,
    port: process.env.FTP_PORT,
    user: process.env.FTP_USERNAME,
    password: process.env.FTP_PASSWORD
}

var c = new Client();

c.on('ready', function () {
    const file = 'index.html';

    // c.get('public_html/' + file, function (err, stream) {
    //     if (err) throw err;
    //     stream.once('close', function () { c.end(); });
    //     stream.pipe(fs.createWriteStream(file));
    // });

    c.put('foo.txt', 'public_html/foo.txt', function (err) {
        if (err) throw err;
        console.log('asdasd');
        c.end();
    });
});

c.connect(srcFTP);