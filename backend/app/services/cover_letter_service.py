from typing import Optional
from app.ai.chains import generate_cover_letter
from app.ai.retriever import get_retriever
import logging

logger = logging.getLogger(__name__)

class CoverLetterService:
    def __init__(self):
        self.resume_retriever = get_retriever(index_name="resume")
        self.job_retriever = get_retriever(index_name="job")

    def generate(self, role: str, company: str, additional_context: Optional[str] = None) -> str:
        """
        Generate a cover letter using RAG from resume and job description.
        
        Args:
            role: Job title/position
            company: Company name
            additional_context: Any extra context to include
            
        Returns:
            Generated cover letter content
        """
        try:
            logger.info(f"Generating cover letter for {role} at {company}")
            content = generate_cover_letter(role, company)
            logger.info("Cover letter generated successfully")
            return content
        except Exception as e:
            logger.error(f"Error generating cover letter: {str(e)}")
            raise

    def get_resume_context(self, query: str = "summarize skills and experience", k: int = 4) -> str:
        """Get relevant resume context for cover letter generation."""
        try:
            docs = self.resume_retriever.get_relevant_documents(query)
            return "\n".join([doc.page_content for doc in docs[:k]])
        except Exception as e:
            logger.error(f"Error retrieving resume context: {str(e)}")
            return ""

    def get_job_context(self, query: str = "summarize job requirements", k: int = 4) -> str:
        """Get relevant job description context for cover letter generation."""
        try:
            docs = self.job_retriever.get_relevant_documents(query)
            return "\n".join([doc.page_content for doc in docs[:k]])
        except Exception as e:
            logger.error(f"Error retrieving job context: {str(e)}")
            return ""

    def validate_inputs(self, role: str, company: str) -> bool:
        """Validate that we have sufficient context to generate a quality cover letter."""
        resume_context = self.get_resume_context()
        job_context = self.get_job_context()
        
        if not resume_context:
            logger.warning("No resume context found")
            return False
        if not job_context:
            logger.warning("No job context found")
            return False
        if not role or not company:
            logger.warning("Missing role or company information")
            return False
            
        return True
