#!/bin/bash

# Backend Test Script
# This script runs all backend tests with proper error handling

set -e  # Exit on any error

echo "🚀 Starting Backend Tests..."

echo "📦 Running Docker Compose..."
docker-compose up --build --abort-on-container-exit --exit-code-from test-backend

# Navigate to backend directory
cd backend

echo "📦 Installing dependencies..."
npm install

echo "🧪 Running unit tests..."
npm run test:unit

echo "🔗 Running integration tests..."
npm run test:integration

echo "📊 Running all tests with coverage..."
npm test

echo "✅ All backend tests completed successfully!" 