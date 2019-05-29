var path = require('path');
const { exec } = require('child_process');

const files = []
files.push('Creative-Designers-Icons.tarhan.ir.rar');
files.push('Anniversary-Invitation.tarhan.ir.rar');
files.push('Snowdrops-Photo-Overlays.tarhan.ir.rar');
files.push('Soccer-Flyer-5.tarhan.ir.rar');

files.forEach(file => {
    const extension = path.extname(file);
    const newName = file.replace('tarhan.ir', 'irangfx.com').replace(extension, '');
    if (extension === '.rar') {
        exec(`./rar-extractor.sh '${file}' '${newName}'`);
    } else if (extension === '.zip') {}
});