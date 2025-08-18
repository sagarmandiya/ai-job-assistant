# AI Job Assistant – Backend Service

🤖 FastAPI backend powering the AI Job Assistant platform.  
Implements RAG-based resume analysis, automated cover letter & recruiter email generation, intelligent job matching, and more.

***

## Overview

This is the **backend service** in the AI Job Assistant monorepo.  
Other services in the repo:
- `/frontend` – React frontend with professional UI/UX
- `/job-scraper` – Job scraping/ingestion service (coming soon)

The backend provides:
- REST API endpoints via FastAPI
- LangChain + HuggingFace RAG pipelines
- Long-term memory vectorstore
- File uploads and resume parsing
- Cover letter and recruiter email generation
- AI-powered job matching and recommendations
- User authentication and session management
- Content generation and management APIs

***

## Requirements

- Python 3.11+
- (Optional) [Conda](https://docs.conda.io/en/latest/) (Anaconda or Miniconda) for development
- (Optional) Docker & Docker Compose
- `.env` file in this folder with your secrets/config (copy from `.env.example`)

**Note**: For full platform development, you'll also need:
- Node.js 16+ (for frontend development)
- npm or yarn (for frontend dependencies)

Example:
```
cp .env.example .env
# Edit .env and set API keys like:
# PPLX_API_KEY=your-key-here
```

***

## Quick Start – Local Development

**Setup Environment:**
```bash
cd backend
./setup_env.sh
```

**Run the Backend:**
```bash
cd backend
./run.sh
```

**Or use Makefile:**
```bash
cd backend
make setup    # First time only
make run-local
```

Browse API docs:  
➡ http://localhost:8080/docs

Test API endpoints:  
➡ http://localhost:8080/docs (Interactive Swagger UI)

***

## Frontend Integration

The backend is designed to work seamlessly with the React frontend:

### API Endpoints
- **Authentication**: `/auth/*` - User registration, login, session management
- **Resumes**: `/resumes/*` - Upload, analyze, and manage resumes
- **Jobs**: `/jobs/*` - Save and manage job descriptions
- **Content**: `/content/*` - Generate cover letters, emails, and other content
- **Chat**: `/chat/*` - AI assistant conversations
- **Library**: `/library/*` - Content library management
- **Settings**: `/settings/*` - User preferences and account settings

### CORS Configuration
The backend is configured to accept requests from the frontend running on `http://localhost:3000`.

### Environment Variables for Frontend
```env
# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# API Base URL (used by frontend)
API_BASE_URL=http://localhost:8080
```

***

## Full Platform Development

To run both backend and frontend together:

### Option 1: Separate Terminals
```bash
# Terminal 1 - Backend
cd backend
./run.sh

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

### Option 2: Docker Compose (Full Platform)
```bash
# From project root
docker-compose up -d
```

This starts:
- Backend API → http://localhost:8080
- Frontend → http://localhost:3000

***

## Quick Start – Docker

**Build and run manually:**
```bash
cd backend
docker build -t job-assistant-backend .
docker run -d \
  --name job-assistant-backend \
  -p 8080:8080 \
  -v $(pwd)/.env:/app/.env \
  job-assistant-backend
```

**Or use Makefile convenience commands:**
```bash
make build
make run
```

***

## Development Commands

View all Makefile commands:
```bash
make help
```

Run full test suite:
```bash
make test
```

Test API with frontend:
```bash
# Start backend
./run.sh

# In another terminal, start frontend
cd ../frontend
npm run dev

# Visit http://localhost:3000 to test the full application
```

Open a shell inside the running backend container:
```bash
make shell
```

Follow logs:
```bash
make logs
```

***

## Environment Management

This project supports multiple Python environment types:

### Development (Conda)
- **Automatic Detection**: Scripts automatically detect and use conda if available
- **Environment File**: `environment.yml` for conda environments
- **Benefits**: Isolated dependencies, easy package management

### Production (Virtual Environment)
- **Standard Python**: Uses `python -m venv` for virtual environments
- **Requirements File**: `requirements.txt` for pip installations
- **Benefits**: Lightweight, production-ready, no external dependencies

### Environment-Agnostic Scripts
All scripts automatically detect and use the appropriate environment:
- `setup_env.sh` - Creates conda or venv based on availability
- `run.sh` - Automatically activates detected environment
- `test_all.sh` - Works with any environment type

***

## File Uploads & Data Directories

Runtime-writable directories:  
- `/app/uploads` – File uploads (e.g., resumes)
- `/app/vectorstore` – Vector DB
- `/app/generated_content` – Generated text outputs

***

## Contributing

1. Fork this repository  
2. Create a feature branch:
   ```bash
   git checkout -b feature/my-feature
   ```
3. Make your changes in `backend/`
4. Test your changes:
   ```bash
   make test
   ```
5. Commit:
   ```bash
   git commit -m "Add my feature"
   ```
6. Push:
   ```bash
   git push origin feature/my-feature
   ```
7. Open a Pull Request

