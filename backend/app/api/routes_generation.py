from fastapi import APIRouter, HTTPException
from app.models.request_models import GenerationRequest
from app.models.response_models import GenerationResponse
from app.services.cover_letter_service import CoverLetterService
from app.services.recruiter_email_service import RecruiterEmailService

router = APIRouter()

# Don't initialize here - do it in the endpoints
# cover_letter_service = CoverLetterService()  # Remove this
# recruiter_email_service = RecruiterEmailService()  # Remove this

@router.post("/cover-letter", response_model=GenerationResponse)
async def generate_cover_letter_api(request: GenerationRequest):
    cover_letter_service = CoverLetterService()  # Initialize here instead
    
    role = request.extra_context or "Software Engineer"
    company = request.job_id or "Unknown Company"
    
    if not cover_letter_service.validate_inputs(role, company):
        raise HTTPException(status_code=400, detail="Insufficient context to generate cover letter. Please upload resume and job description first.")
    
    try:
        content = cover_letter_service.generate(role, company)
        return GenerationResponse(content=content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating cover letter: {str(e)}")

@router.post("/recruiter-email", response_model=GenerationResponse)
async def generate_recruiter_email_api(request: GenerationRequest):
    recruiter_email_service = RecruiterEmailService()  # Initialize here instead
    
    role = request.extra_context or "Software Engineer"
    company = request.job_id or "Unknown Company"
    
    if not recruiter_email_service.validate_context(role, company):
        raise HTTPException(status_code=400, detail="Insufficient context to generate recruiter email. Please upload resume and job description first.")
    
    try:
        result = recruiter_email_service.generate(role, company)
        formatted_content = f"Subject Line Options:\n"
        for i, subject in enumerate(result['subject_lines'], 1):
            formatted_content += f"{i}. {subject}\n"
        formatted_content += f"\nEmail:\n{result['email_body']}"
        
        return GenerationResponse(content=formatted_content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating recruiter email: {str(e)}")
