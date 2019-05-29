oldPassword='tarhan.ir';
newPassword='irangfx.com';

mkdir "$2"
unrar "e -p$oldPassword $1 ./$2"
cd "$2"
mv Tarhan.ir.url IranGFX.com.url
sed "'s+www.tarhan.ir/academy+irangfx.com+g' IranGFX.com.url"