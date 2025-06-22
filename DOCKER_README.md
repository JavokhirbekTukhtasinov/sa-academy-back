# Docker Setup with LocalStack

This project includes a complete Docker setup with LocalStack for local development and testing of AWS services.

## Prerequisites

- Docker and Docker Compose installed
- AWS CLI (optional, for LocalStack setup)
- Node.js 20+ (for local development without Docker)

## Quick Start

### Development Environment

1. **Start the development environment:**
   ```bash
   docker-compose -f docker-compose.dev.yml up -d
   ```

2. **Setup LocalStack resources:**
   ```bash
   chmod +x scripts/setup-localstack.sh
   ./scripts/setup-localstack.sh
   ```

3. **Run database migrations:**
   ```bash
   docker-compose -f docker-compose.dev.yml exec app npx prisma migrate dev
   ```

4. **Access the application:**
   - NestJS App: http://localhost:3000
   - GraphQL Playground: http://localhost:3000/graphql
   - pgAdmin: http://localhost:5050 (admin@sa-academy.com / admin)
   - LocalStack: http://localhost:4566

### Production Environment

1. **Start the production environment:**
   ```bash
   docker-compose up -d
   ```

2. **Setup LocalStack resources:**
   ```bash
   chmod +x scripts/setup-localstack.sh
   ./scripts/setup-localstack.sh
   ```

## Services Overview

### Core Services

- **NestJS Application**: Main application server
- **PostgreSQL**: Primary database
- **LocalStack**: AWS services simulation
- **Redis**: Caching layer (optional)
- **pgAdmin**: Database management interface (development only)

### LocalStack AWS Services

LocalStack provides the following AWS services locally:

- **S3**: File storage
- **Lambda**: Serverless functions
- **SQS**: Message queuing
- **SNS**: Push notifications
- **SES**: Email service
- **CloudWatch**: Monitoring and logging

## S3 Buckets

The setup script creates the following S3 buckets:

- `sa-academy-files`: General application files
- `sa-academy-thumbnails`: Course thumbnails
- `sa-academy-avatars`: User profile pictures
- `sa-academy-videos`: Lecture videos
- `sa-academy-curriculum`: Curriculum attachments

## Environment Variables

### Required Environment Variables

```bash
# Database
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/sa_academy
DIRECT_URL=postgresql://postgres:postgres@postgres:5432/sa_academy

# AWS Configuration (LocalStack)
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test
AWS_REGION=us-east-1
AWS_S3_ENDPOINT=http://localstack:4566
AWS_S3_FORCE_PATH_STYLE=true

# JWT
JWT_SECRET=your-super-secret-jwt-key-here

# OAuth (Google)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Telegram
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
```

## Useful Commands

### Development

```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f app

# Execute commands in the app container
docker-compose -f docker-compose.dev.yml exec app yarn test
docker-compose -f docker-compose.dev.yml exec app npx prisma studio

# Stop development environment
docker-compose -f docker-compose.dev.yml down
```

### Production

```bash
# Start production environment
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop production environment
docker-compose down
```

### Database Operations

```bash
# Run migrations
docker-compose -f docker-compose.dev.yml exec app npx prisma migrate dev

# Generate Prisma client
docker-compose -f docker-compose.dev.yml exec app npx prisma generate

# Open Prisma Studio
docker-compose -f docker-compose.dev.yml exec app npx prisma studio

# Reset database
docker-compose -f docker-compose.dev.yml exec app npx prisma migrate reset
```

### LocalStack Operations

```bash
# Setup LocalStack resources
./scripts/setup-localstack.sh

# List S3 buckets
aws --endpoint-url=http://localhost:4566 s3 ls

# Upload a file to S3
aws --endpoint-url=http://localhost:4566 s3 cp file.txt s3://sa-academy-files/

# List files in a bucket
aws --endpoint-url=http://localhost:4566 s3 ls s3://sa-academy-files/
```

## Troubleshooting

### Common Issues

1. **Port conflicts**: If ports are already in use, modify the port mappings in the docker-compose files.

2. **LocalStack not ready**: Wait for LocalStack to fully start before running the setup script.

3. **Database connection issues**: Ensure PostgreSQL is healthy before starting the app.

4. **Permission issues**: Make sure the setup script is executable:
   ```bash
   chmod +x scripts/setup-localstack.sh
   ```

### Health Checks

All services include health checks. You can monitor them with:

```bash
# Check service health
docker-compose -f docker-compose.dev.yml ps

# View health check logs
docker-compose -f docker-compose.dev.yml logs postgres
docker-compose -f docker-compose.dev.yml logs localstack
```

### Cleanup

```bash
# Remove all containers and volumes
docker-compose -f docker-compose.dev.yml down -v

# Remove all images
docker-compose -f docker-compose.dev.yml down --rmi all

# Clean up Docker system
docker system prune -a
```

## Development Workflow

1. Start the development environment
2. Setup LocalStack resources
3. Run database migrations
4. Make code changes (hot reload enabled)
5. Test your changes
6. Stop the environment when done

## Production Deployment

For production deployment:

1. Update environment variables with real values
2. Use the production Docker Compose file
3. Configure proper secrets management
4. Set up monitoring and logging
5. Configure SSL/TLS certificates
6. Set up proper backup strategies

## Additional Resources

- [LocalStack Documentation](https://docs.localstack.cloud/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/) 