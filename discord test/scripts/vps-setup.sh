#!/bin/bash
# إعداد سريع على Ubuntu VPS
set -e
sudo apt update && sudo apt install -y curl git
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2
cd "$(dirname "$0")/.."
npm install
npm run deploy
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
echo "Done. Bot running 24/7 with PM2."
