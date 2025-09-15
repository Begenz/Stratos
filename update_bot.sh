#!/bin/bash

# Navigate to the bot directory
cd "$(dirname "$0")"

echo "🔄 Resetting local repo and pulling latest changes..."
git reset --hard HEAD
git checkout main  # Change this if your branch is different
git pull

echo "📦 Installing/updating dependencies..."
npm install

echo "🧼 Cleaning up old containers and images..."
docker compose down --remove-orphans
docker image prune -f

echo "🐳 Rebuilding Docker container with no cache..."
docker compose build --no-cache

echo "🚀 Starting bot in detached mode..."
docker compose up -d

echo "✅ Bot update complete and running the latest version."
