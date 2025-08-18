# AI Job Assistant Platform

AI-powered job application platform with long-term memory.  
Features RAG-based resume analysis, automated cover letter & recruiter email generation, intelligent job matching, and job post web scraping.

## Frontend Features

The React frontend provides a professional, user-friendly interface with:

- **Professional Navigation**: Responsive navbar and footer with breadcrumb navigation
- **Account Management**: Comprehensive settings with profile, security, and preferences
- **Resume Management**: Upload, analyze, and manage resumes with AI-powered insights
- **Job Tracking**: Save and organize job descriptions for targeted applications
- **Content Generation**: AI-powered cover letters and outreach emails
- **AI Assistant**: Interactive chat for career advice and job search guidance
- **Content Library**: Organize and manage generated content
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

***

## Architecture

This repository is a **monorepo** containing multiple services:

- `/backend` – FastAPI backend with RAG-powered NLP
- `/frontend` – React-based frontend with professional UI/UX
- `/job-scraper` – Web scraping service (coming soon)
- `/scripts` – Utility scripts for testing and setup
- `/docs` – Project documentation

***

## Quick Start

### 1. Backend Only (Local Development)

```bash
cd backend
cp .env.example .env    # edit .env with your API keys
./setup_env.sh          # setup Python environment
./run.sh                # start the backend
```

Visit the API docs:  
➡ http://localhost:8080/docs

***

### 2. Frontend Only (Local Development)

```bash
cd frontend
npm install          # install dependencies
npm run dev          # start development server
```

Visit the frontend:  
➡ http://localhost:3000

***

### 3. Full Platform (Docker)

Requires Docker & Docker Compose:

```bash
docker-compose up -d
```

- Backend API → http://localhost:8080  
- Frontend → http://localhost:3000  

Stop services:
```bash
docker-compose down
```

***

## Development

See individual service READMEs:

- [Backend Documentation](./backend/README.md)
- [Frontend Documentation](./frontend/README.md)
- [Job Scraper Documentation](./job-scraper/README.md) _(coming soon)_

### Testing

Run comprehensive system tests:

```bash
./scripts/test-system.sh
```

For legacy system testing:

```bash
./scripts/test-system-legacy.sh
```

### Authentication Setup

Set up the authentication system:

```bash
./scripts/setup-auth.sh
```

***

## Environment Management

This project uses environment-agnostic setup:

- **Development**: Supports conda environments for easy development
- **Production**: Uses standard Python virtual environments
- **Automatic Detection**: Scripts automatically detect and use the best available environment
- **No Hardcoded Paths**: Works on any machine with Python

For detailed information, see [Environment Setup Guide](./backend/UNIFIED_SETUP.md).

***

## Contributing

1. Fork the repository
2. Create your feature branch  
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. Make changes in the appropriate service directory
4. Test your changes:
   ```bash
   cd backend
   make test
   ```
5. Commit your changes  
   ```bash
   git commit -m "Add some amazing feature"
   ```
6. Push to your branch  
   ```bash
   git push origin feature/amazing-feature
   ```
7. Open a Pull Request

***

**Tip:** Before opening a PR, run tests for the affected service (see its README).
