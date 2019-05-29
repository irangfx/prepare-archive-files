var path = require('path')
const { exec } = require('child_process');

const file = 'Creative-Designers-Icons.tarhan.ir.rar';
const newFile = file.replace('tarhan.ir', 'irangfx.com');

exec('mkdir ' + newFile.replace('.rar', ''));
// exec('./bash.sh');