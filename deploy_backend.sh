#!/bin/bash
set -e

echo "1. Pulling latest code..."
cd /home/ubuntu/SaasVault
git pull origin main

echo "2. Deploying backend..."
# copy backend code to the running backend directory
cp -r /home/ubuntu/SaasVault/backend/* /home/ubuntu/backend/

echo "3. Restarting backend service..."
pkill -f 'python3 app.py' || true
cd /home/ubuntu/backend
source venv/bin/activate
nohup python3 app.py > backend.log 2>&1 </dev/null & sleep 2

echo "Backend Deployment complete!"
