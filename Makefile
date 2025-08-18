# Variables
BACKEND_PORT = 8080
FRONTEND_PORT = 3000

# Default target
.PHONY: help
help:
	@echo "AI Job Assistant - Available commands:"
	@echo ""
	@echo "Backend commands:"
	@echo "  make backend-run       - Run backend locally"
	@echo "  make backend-stop      - Stop backend"
	@echo ""
	@echo "Frontend commands:"
	@echo "  make frontend-run      - Run frontend locally"
	@echo "  make frontend-stop     - Stop frontend"
	@echo "  make frontend-build    - Build frontend for production"
	@echo ""
	@echo "Database commands:"
	@echo "  make db-start         - Start PostgreSQL and Redis"
	@echo "  make db-stop          - Stop PostgreSQL and Redis"
	@echo "  make db-reset         - Reset database (stop, remove volumes, start)"
	@echo "  make db-shell         - Connect to PostgreSQL shell"
	@echo ""
	@echo "Full stack commands:"
	@echo "  make run              - Run both backend and frontend"
	@echo "  make stop             - Stop both services"
	@echo "  make dev              - Run both services"
	@echo "  make clean            - Clean up containers and images"
	@echo ""
	@echo "Docker commands:"
	@echo "  make docker-build     - Build all Docker images"
	@echo "  make docker-run       - Run with Docker Compose"
	@echo "  make docker-stop      - Stop Docker services"
	@echo ""
	@echo "Utility commands:"
	@echo "  make status           - Check service status"

# Backend commands
.PHONY: backend-run
backend-run:
	@echo "Starting backend on port $(BACKEND_PORT)..."
	cd backend && make run-local

.PHONY: backend-stop
backend-stop:
	@echo "Stopping backend..."
	cd backend && make stop

# Frontend commands
.PHONY: frontend-run
frontend-run:
	@echo "Starting frontend on port $(FRONTEND_PORT)..."
	cd frontend && make run-local

.PHONY: frontend-stop
frontend-stop:
	@echo "Stopping frontend..."
	cd frontend && make stop

.PHONY: frontend-build
frontend-build:
	@echo "Building frontend for production..."
	cd frontend && make build-prod

# Full stack commands
.PHONY: run
run:
	@echo "Starting database, backend, and frontend..."
	@echo "PostgreSQL will be available at: localhost:5432"
	@echo "Backend will be available at: http://localhost:$(BACKEND_PORT)"
	@echo "Frontend will be available at: http://localhost:$(FRONTEND_PORT)"
	@echo "Press Ctrl+C to stop all services"
	@echo ""
	@echo "Starting PostgreSQL and Redis..."
	@docker compose up -d postgres redis
	@echo "Waiting for database to be ready..."
	@sleep 5
	@echo "Starting backend and frontend..."
	@cd backend && make run-local & \
	cd frontend && make run-local & \
	wait

.PHONY: stop
stop: backend-stop frontend-stop db-stop

.PHONY: dev
dev: db-start run

.PHONY: clean
clean:
	@echo "Cleaning up containers and images..."
	cd backend && make clean
	cd frontend && make clean

# Docker commands
.PHONY: docker-build
docker-build:
	@echo "Building Docker images..."
	cd backend && make build
	cd frontend && make build

.PHONY: docker-run
docker-run:
	@echo "Starting services with Docker Compose..."
	docker compose up -d

.PHONY: docker-stop
docker-stop:
	@echo "Stopping Docker services..."
	docker compose down

# Database commands
.PHONY: db-start
db-start:
	@echo "Starting PostgreSQL and Redis..."
	docker compose up -d postgres redis

.PHONY: db-stop
db-stop:
	@echo "Stopping PostgreSQL and Redis..."
	docker compose stop postgres redis

.PHONY: db-reset
db-reset:
	@echo "Resetting database (this will delete all data)..."
	docker compose down -v
	docker compose up -d postgres redis
	@echo "Database reset complete. Waiting for PostgreSQL to be ready..."
	@sleep 10

.PHONY: db-shell
db-shell:
	@echo "Connecting to PostgreSQL shell..."
	docker exec -it ai-job-assistant-db psql -U postgres -d ai_job_assistant

# Convenience targets
.PHONY: status
status:
	@echo "Checking service status..."
	@echo "Backend:"
	@curl -s http://localhost:$(BACKEND_PORT)/health 2>/dev/null | grep -q "ok" && echo "  ✅ Running" || echo "  ❌ Not running"
	@echo "Frontend:"
	@curl -s http://localhost:$(FRONTEND_PORT) 2>/dev/null | grep -q "html" && echo "  ✅ Running" || echo "  ❌ Not running"
	@echo "PostgreSQL:"
	@docker ps | grep -q "ai-job-assistant-db" && echo "  ✅ Running" || echo "  ❌ Not running"
	@echo "Redis:"
	@docker ps | grep -q "ai-job-assistant-redis" && echo "  ✅ Running" || echo "  ❌ Not running"
