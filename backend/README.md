# AI Job Assistant – Backend Service

🤖 FastAPI backend powering the AI Job Assistant platform.  
Implements RAG-based resume analysis, automated cover letter & recruiter email generation, intelligent job matching, and more.

***

## Overview

This is the **backend service** in the AI Job Assistant monorepo.  
Other services in the repo:
- `/frontend` – React frontend (coming soon)
- `/job-scraper` – Job scraping/ingestion service (coming soon)

The backend provides:
- REST API endpoints via FastAPI
- LangChain + HuggingFace RAG pipelines
- Long-term memory vectorstore
- File uploads and resume parsing
- Cover letter and recruiter email generation

***

## Requirements

- Python 3.11+
- [Conda](https://docs.conda.io/en/latest/) or `pip`
- (Optional) Docker & Docker Compose
- `.env` file in this folder with your secrets/config (copy from `.env.example`)

Example:
```
cp .env.example .env
# Edit .env and set API keys like:
# PPLX_API_KEY=your-key-here
```

***

## Quick Start – Local Development

**Using Conda:**
```
cd backend
conda env create -f environment.yml
conda activate job_assistant
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Using pip:**
```
cd backend
python -m venv venv
source venv/bin/activate      # On Windows use: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Browse API docs:  
➡ http://localhost:8000/docs

***

## Quick Start – Docker

**Build and run manually:**
```
cd backend
docker build -t job-assistant-backend .
docker run -d \
  --name job-assistant-backend \
  -p 8000:8000 \
  -v $(pwd)/.env:/app/.env \
  job-assistant-backend
```

**Or use Makefile convenience commands:**
```
make build
make run
```

***

## Development Commands

View all Makefile commands:
```
make help
```

Run full integration test suite:
```
./test_all.sh
```

Open a shell inside the running backend container:
```
make shell
```

Follow logs:
```
make logs
```

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
   ```
   git checkout -b feature/my-feature
   ```
3. Make your changes in `backend/`
4. Commit:
   ```
   git commit -m "Add my feature"
   ```
5. Push:
   ```
   git push origin feature/my-feature
   ```
6. Open a Pull Request

