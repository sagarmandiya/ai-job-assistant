from fastapi import APIRouter, UploadFile, File, Form
import shutil
from pathlib import Path
from app.services.resume_ingestion import process_and_store_resume
from app.services.job_ingestion import store_job_description

router = APIRouter()

UPLOAD_DIR = Path("./uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

@router.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...)):
    filepath = UPLOAD_DIR / file.filename
    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    result = process_and_store_resume(str(filepath))
    return {"status": "uploaded", **result}

@router.post("/set-job-description")
async def set_job_description(job_text: str = Form(...)):
    result = store_job_description(job_text)
    return {"status": "job stored", **result}
