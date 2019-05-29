var fs = require('fs');
var path = require('path');
const { exec } = require('child_process');

const oldPassword = 'tarhan.ir';
const newPassword = 'irangfx.com';

const file = 'Creative-Designers-Icons.tarhan.ir.rar';

const extension = path.extname(file);
const newName = file.replace('tarhan.ir', 'irangfx.com').replace(extension, '');

if (extension === '.rar') {
    exec(`./newshell.sh '${file}' '${newName}'`);
} else if (extension === '.zip') {

}

async function extractArchive() {
    await spawn(`unrar e -p${oldPassword} ${file} ./${newName}`);
    await spawn(`mv ./${newName}/Tarhan.ir.url ./${newName}/IranGFX.com.url`);
    await spawn(`sed 's+www.tarhan.ir/academy+irangfx.com+g' ./${newName}/IranGFX.com.url`);
}