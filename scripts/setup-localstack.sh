#!/bin/bash

# Setup LocalStack AWS resources
echo "Setting up LocalStack AWS resources..."

# Wait for LocalStack to be ready
echo "Waiting for LocalStack to be ready..."
max_attempts=60
attempt=1

while [ $attempt -le $max_attempts ]; do
    if curl -s http://localhost:4566/_localstack/health > /dev/null 2>&1; then
        echo "LocalStack is ready!"
        break
    fi
    
    echo "Attempt $attempt/$max_attempts: LocalStack is not ready yet. Waiting..."
    sleep 10
    attempt=$((attempt + 1))
done

if [ $attempt -gt $max_attempts ]; then
    echo "Error: LocalStack failed to start within the expected time."
    echo "Please check the LocalStack logs:"
    echo "docker-compose -f docker-compose.dev.yml logs localstack"
    exit 1
fi

# Additional wait to ensure services are fully initialized
echo "Waiting for services to be fully initialized..."
sleep 10

# Configure AWS CLI for LocalStack
export AWS_ACCESS_KEY_ID=test
export AWS_SECRET_ACCESS_KEY=test
export AWS_DEFAULT_REGION=us-east-1
export AWS_ENDPOINT_URL=http://localhost:4566

# Create S3 buckets
echo "Creating S3 buckets..."

# Function to create bucket with error handling
create_bucket() {
    local bucket_name=$1
    echo "Creating bucket: $bucket_name"
    
    if aws --endpoint-url=http://localhost:4566 s3 mb s3://$bucket_name 2>/dev/null; then
        echo "✓ Created bucket: $bucket_name"
        
        # Set CORS configuration
        aws --endpoint-url=http://localhost:4566 s3api put-bucket-cors \
            --bucket $bucket_name \
            --cors-configuration '{
                "CORSRules": [
                    {
                        "AllowedHeaders": ["*"],
                        "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
                        "AllowedOrigins": ["*"],
                        "ExposeHeaders": ["ETag"]
                    }
                ]
            }' 2>/dev/null
        
        echo "✓ Set CORS for bucket: $bucket_name"
    else
        echo "⚠ Bucket $bucket_name might already exist or failed to create"
    fi
}

# Create all buckets
create_bucket "sa-academy-files"
create_bucket "sa-academy-thumbnails"
create_bucket "sa-academy-avatars"
create_bucket "sa-academy-videos"
create_bucket "sa-academy-curriculum"

# List created buckets
echo ""
echo "Created S3 buckets:"
aws --endpoint-url=http://localhost:4566 s3 ls 2>/dev/null || echo "Could not list buckets"

echo ""
echo "LocalStack setup completed!"
echo ""
echo "Available services:"
echo "- LocalStack: http://localhost:4566"
echo "- S3 buckets: sa-academy-files, sa-academy-thumbnails, sa-academy-avatars, sa-academy-videos, sa-academy-curriculum"
echo ""
echo "You can now use these AWS services in your application with the following configuration:"
echo "AWS_ACCESS_KEY_ID=test"
echo "AWS_SECRET_ACCESS_KEY=test"
echo "AWS_REGION=us-east-1"
echo "AWS_S3_ENDPOINT=http://localhost:4566"
echo "AWS_S3_FORCE_PATH_STYLE=true" 