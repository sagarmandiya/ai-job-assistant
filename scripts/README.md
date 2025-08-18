# Scripts Directory

This directory contains utility scripts for the AI Job Assistant project.

## Available Scripts

### `test-system.sh`
Comprehensive system testing script that checks:
- Python environment setup (conda/venv)
- Backend server functionality
- Frontend dependencies and build
- Node.js environment
- Development and production server tests

**Usage:**
```bash
./scripts/test-system.sh
```

### `test-system-legacy.sh`
Legacy testing script for older system configurations.
Uses hardcoded Anaconda paths.

**Usage:**
```bash
./scripts/test-system-legacy.sh
```

### `setup-auth.sh`
Sets up authentication system with PostgreSQL and Redis.
Initializes the database with default admin credentials.

**Usage:**
```bash
./scripts/setup-auth.sh
```

### `dev.sh`
Development environment setup script.

**Usage:**
```bash
./scripts/dev.sh
```

## Making Scripts Executable

If scripts are not executable, run:
```bash
chmod +x scripts/*.sh
```

## Notes

- All scripts should be run from the project root directory
- Some scripts require Docker to be running
- The test scripts will start and stop services automatically for testing
