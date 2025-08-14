# Variables
IMAGE_NAME = job-assistant-backend
CONTAINER_NAME = job-assistant-backend
PORT = 8000
ENV_FILE_PATH ?= $(shell pwd)/.env

# Path to your main FastAPI app
APP_MODULE = app.main:app

# Default target
.PHONY: help
help:
	@echo "Available commands for backend:"
	@echo "  make build         - Build Docker image for backend"
	@echo "  make run           - Run backend container (detached)"
	@echo "  make run-local     - Run locally using uvicorn (no Docker)"
	@echo "  make logs          - Show logs for backend container"
	@echo "  make stop          - Stop backend container"
	@echo "  make remove        - Remove backend container"
	@echo "  make restart       - Restart backend container"
	@echo "  make shell         - Open bash shell inside running container"
	@echo "  make clean         - Remove all stopped containers and dangling images"
	@echo "  make rebuild       - Stop, remove, and rebuild backend container"

# Build the Docker image
.PHONY: build
build:
	docker build -t $(IMAGE_NAME) .

# Run backend in Docker
.PHONY: run
run:
	docker run -d \
		--name $(CONTAINER_NAME) \
		-p $(PORT):8000 \
		-v $(ENV_FILE_PATH):/app/.env \
		$(IMAGE_NAME)

# Run backend locally (without Docker)
.PHONY: run-local
run-local:
	uvicorn $(APP_MODULE) --reload --host 0.0.0.0 --port $(PORT)

# Show logs from running container
.PHONY: logs
logs:
	docker logs -f $(CONTAINER_NAME)

# Stop the container
.PHONY: stop
stop:
	docker stop $(CONTAINER_NAME) || true

# Remove the container
.PHONY: remove
remove:
	docker rm $(CONTAINER_NAME) || true

# Restart container
.PHONY: restart
restart: stop remove run

# Shell into the container
.PHONY: shell
shell:
	docker exec -it $(CONTAINER_NAME) /bin/bash

# Remove dangling images and stopped containers
.PHONY: clean
clean:
	docker system prune -f

# Full rebuild
.PHONY: rebuild
rebuild: stop remove build run
