# Variables
IMAGE_NAME = job-assistant-frontend
CONTAINER_NAME = job-assistant-frontend
PORT = 3000

# Default target
.PHONY: help
help:
	@echo "Available commands for frontend:"
	@echo "  make build         - Build Docker image for frontend"
	@echo "  make run           - Run frontend container (detached)"
	@echo "  make run-local     - Run locally using npm dev (no Docker)"
	@echo "  make build-prod    - Build production version"
	@echo "  make logs          - Show logs for frontend container"
	@echo "  make stop          - Stop frontend container"
	@echo "  make remove        - Remove frontend container"
	@echo "  make restart       - Restart frontend container"
	@echo "  make shell         - Open bash shell inside running container"
	@echo "  make clean         - Remove all stopped containers and dangling images"
	@echo "  make rebuild       - Stop, remove, and rebuild frontend container"

# Build the Docker image
.PHONY: build
build:
	docker build -t $(IMAGE_NAME) .

# Run frontend in Docker
.PHONY: run
run:
	docker run -d \
		--name $(CONTAINER_NAME) \
		-p $(PORT):3000 \
		$(IMAGE_NAME)

# Run frontend locally (without Docker)
.PHONY: run-local
run-local:
	npm run dev

# Build production version
.PHONY: build-prod
build-prod:
	npm run build

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
