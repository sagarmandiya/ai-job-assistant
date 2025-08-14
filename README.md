# AI Job Assistant Platform

AI-powered job application platform with long-term memory.  
Features RAG-based resume analysis, automated cover letter & recruiter email generation, intelligent job matching, and job post web scraping.

***

## Architecture

This repository is a **monorepo** containing multiple services:

- `/backend` – FastAPI backend with RAG-powered NLP
- `/frontend` – React-based frontend (coming soon)
- `/job-scraper` – Web scraping service (coming soon)

***

## Quick Start

### 1. Backend Only (Local Development)

```
cd backend
cp .env.example .env    # edit .env with your API keys
conda env create -f environment.yml
conda activate job_assistant
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Visit the API docs:  
➡ http://localhost:8000/docs

***

### 2. Full Platform (Docker)

Requires Docker & Docker Compose:

```
docker-compose up -d
```

- Backend API → http://localhost:8000  
- (Frontend soon) → http://localhost:3000  

Stop services:
```
docker-compose down
```

***

## Development

See individual service READMEs:

- [Backend Documentation](./backend/README.md)
- [Frontend Documentation](./frontend/README.md) _(coming soon)_
- [Job Scraper Documentation](./job-scraper/README.md) _(coming soon)_

***

## Contributing

1. Fork the repository
2. Create your feature branch  
   ```
   git checkout -b feature/amazing-feature
   ```
3. Make changes in the appropriate service directory
4. Commit your changes  
   ```
   git commit -m "Add some amazing feature"
   ```
5. Push to your branch  
   ```
   git push origin feature/amazing-feature
   ```
6. Open a Pull Request

***

**Tip:** Before opening a PR, run tests for the affected service (see its README).
