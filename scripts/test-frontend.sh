#!/bin/bash

# Frontend Test Script
# This script runs all frontend tests with proper error handling

set -e  # Exit on any error

echo "🚀 Starting Frontend Tests..."

# Navigate to frontend directory
cd frontend

echo "📦 Installing dependencies..."
npm install

echo "🧪 Running unit tests..."
npm run test:unit

echo "🔗 Running integration tests..."
npm run test:integration

echo "📊 Running all tests with coverage..."
npm test

echo "✅ All frontend tests completed successfully!" 