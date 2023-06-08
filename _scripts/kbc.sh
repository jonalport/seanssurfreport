#!/bin/bash

ffmpeg -y -threads 4 -rtsp_transport tcp -i \
rtsp://admin:Admin123@192.168.10.11:554 -s 1920x1080 -q:v 5 -frames:v 1 -vf \
"
drawtext=text=%{localtime}: \
fontcolor=white: \
fontsize=44: \
box=1: \
boxcolor=black@0.8: \
boxborderw=18: \
fontfile=/home/pi/fonts/goth_med.ttf: \
x=70: y=70, \

drawtext=text='Kite Beach Center, UAQ': \
fontcolor=white: \
fontsize=44: \
box=1: \
boxcolor=black@0.8: \
boxborderw=18: \
fontfile=/home/pi/fonts/goth_med.ttf: \
x=70: y=975, \

drawtext=text='www.seanssurfreport.com': \
fontcolor=white: \
fontsize=44: \
box=1: \
boxcolor=black@0.8: \
boxborderw=16: \
fontfile=/home/pi/fonts/goth_med.ttf: \
x=1250: y=975
" \
/home/pi/pictures/picture.jpg

sleep 5

# Upload the file

scp -i ~/.ssh/id_rsa /home/pi/pictures/picture.jpg root@138.68.168.120:/var/www/vhosts/seanssurfreport.com/httpdocs/wp-content/uploads/from_kbc/
