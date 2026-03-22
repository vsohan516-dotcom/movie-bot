#!/data/data/com.termux/files/usr/bin/bash

while true
do
  echo "Starting Server..."
  node server.js &

  echo "Starting Bot..."
  node bot.js

  echo "Restarting in 5 sec..."
  sleep 5
done

