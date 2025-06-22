.PHONY: help dev prod up down logs clean setup-localstack migrate test

# Default target
help:
	@echo "Available commands:"
	@echo "  dev              - Start development environment"
	@echo "  prod             - Start production environment"
	@echo "  up               - Start development environment (alias for dev)"
	@echo "  down             - Stop all containers"
	@echo "  logs             - Show application logs"
	@echo "  clean            - Remove all containers and volumes"
	@echo "  setup-localstack - Setup LocalStack AWS resources"
	@echo "  migrate          - Run database migrations"
	@echo "  test             - Run tests"
	@echo "  studio           - Open Prisma Studio"

# Development environment
dev:
	docker-compose -f docker-compose.dev.yml up -d

# Production environment
prod:
	docker-compose up -d

# Alias for development
up: dev

# Stop all containers
down:
	docker-compose -f docker-compose.dev.yml down
	docker-compose down

# Show logs
logs:
	docker-compose -f docker-compose.dev.yml logs -f app

# Clean up everything
clean:
	docker-compose -f docker-compose.dev.yml down -v --rmi all
	docker-compose down -v --rmi all
	docker system prune -f

# Setup LocalStack
setup-localstack:
	./scripts/setup-localstack.sh

# Run migrations
migrate:
	docker-compose -f docker-compose.dev.yml exec app npx prisma migrate dev

# Run tests
test:
	docker-compose -f docker-compose.dev.yml exec app yarn test

# Open Prisma Studio
studio:
	docker-compose -f docker-compose.dev.yml exec app npx prisma studio

# Generate Prisma client
prisma-generate:
	docker-compose -f docker-compose.dev.yml exec app npx prisma generate

# Reset database
db-reset:
	docker-compose -f docker-compose.dev.yml exec app npx prisma migrate reset

# Shell into app container
shell:
	docker-compose -f docker-compose.dev.yml exec app sh

# Build images
build:
	docker-compose -f docker-compose.dev.yml build
	docker-compose build

# Show status
status:
	docker-compose -f docker-compose.dev.yml ps 