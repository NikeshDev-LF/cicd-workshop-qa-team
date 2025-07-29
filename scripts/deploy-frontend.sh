#!/bin/bash
set -e

# Move to frontend directory
cd frontend

# Install dependencies
npm ci

# Build the frontend
npm run build

# Deploy to S3
aws s3 sync build/ s3://$S3_BUCKET_NAME --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_DISTRIBUTION_ID --paths "/*"
##