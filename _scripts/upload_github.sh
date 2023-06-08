#!/bin/bash

rm -rf seanssurfreport
git clone --depth=1 git@github.com:jonalport/seanssurfreport.git
cd seanssurfreport
rm ./locations/one.jpg
git add -A
git commit -m "Remove one pic"
cp /home/pi/pictures/picture.jpg ./locations/one.jpg
git add -A
git commit -m "Add one pic"
git push origin main
cd ..
rm -rf seanssurfreport
echo "Done"
