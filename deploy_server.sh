#!/bin/bash
set -e

echo "1. Pulling latest code..."
cd /home/ubuntu/SaasVault
git fetch origin
git reset --hard origin/main

echo "2. Setting up frontend..."
# move the .env we uploaded into the frontend folder
mv /home/ubuntu/.env /home/ubuntu/SaasVault/frontend/.env

cd /home/ubuntu/SaasVault/frontend
npm install
npm run build

echo "3. Deploying frontend to Nginx..."
sudo rm -rf /var/www/saas_vault/*
sudo cp -r dist/* /var/www/saas_vault/
sudo chown -R www-data:www-data /var/www/saas_vault/

echo "4. Deploying backend..."
# copy backend code to the running backend directory
cp -r /home/ubuntu/SaasVault/backend/* /home/ubuntu/backend/

echo "5. Restarting backend service..."
pkill -f 'python3 app.py' || true
cd /home/ubuntu/backend
source venv/bin/activate
nohup python3 app.py > backend.log 2>&1 </dev/null & sleep 2

echo "Deployment complete!"
