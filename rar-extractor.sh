oldPassword='tarhan.ir';
newPassword='irangfx.com';

mkdir $2
unrar e -p$oldPassword $1 ./$2
rm $1
cd $2
sed 's+www.tarhan.ir/academy+irangfx.com+g' Tarhan.ir.url > IranGFX.com.url
rm Tarhan.ir.url
cd ..
rar -p$newPassword a -r -rr10 $2.rar $2
rm -rf $2