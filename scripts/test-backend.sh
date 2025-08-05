#!/bin/bash

# Backend Test Script
# This script runs all backend tests with proper error handling

set -e  # Exit on any error

echo "🚀 Starting Backend Tests..."

echo "📦 Implementing Docker Run..."
docker run -itd --rm --name cicd-postgres \
  -e POSTGRES_DB=cicd_workshop \
  -e POSTGRES_USER=cicd_user \
  -e POSTGRES_PASSWORD=cicd_password \
  -p 5432:5432 postgres:15-alpine


# Navigate to backend directory
cd backend

echo "📦 Installing dependencies..."
npm install

echo "🔄 Running database migrations..."
npm run migrate

echo "🧪 Running unit tests..."
npm run test:unit

echo "🔗 Running integration tests..."
npm run test:integration

echo "📊 Running all tests with coverage..."
npm test

echo "✅ All backend tests completed successfully!" 