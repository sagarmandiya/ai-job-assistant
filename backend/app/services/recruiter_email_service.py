from typing import Optional, List
from app.ai.chains import generate_recruiter_email
from app.ai.retriever import get_retriever
import logging
import re

logger = logging.getLogger(__name__)

class RecruiterEmailService:
    def __init__(self):
        self.resume_retriever = get_retriever(index_name="resume")
        self.job_retriever = get_retriever(index_name="job")

    def generate(self, role: str, company: str, recruiter_name: Optional[str] = None) -> dict:
        """
        Generate a recruiter outreach email with subject lines.
        
        Args:
            role: Job title/position
            company: Company name  
            recruiter_name: Optional recruiter name for personalization
            
        Returns:
            Dict with 'subject_lines' (list) and 'email_body' (str)
        """
        try:
            logger.info(f"Generating recruiter email for {role} at {company}")
            raw_content = generate_recruiter_email(role, company)
            parsed = self._parse_email_content(raw_content)
            
            # Add personalization if recruiter name provided
            if recruiter_name:
                parsed['email_body'] = parsed['email_body'].replace(
                    "Hi there,", f"Hi {recruiter_name},"
                ).replace(
                    "Hello,", f"Hello {recruiter_name},"
                )
            
            logger.info("Recruiter email generated successfully")
            return parsed
            
        except Exception as e:
            logger.error(f"Error generating recruiter email: {str(e)}")
            raise

    def _parse_email_content(self, content: str) -> dict:
        """Parse the LLM output to extract subject lines and email body."""
        lines = content.strip().split('\n')
        subject_lines = []
        email_body_lines = []
        
        in_subjects = True
        for line in lines:
            line = line.strip()
            if not line:
                continue
                
            # Look for subject line patterns
            if in_subjects and (
                line.startswith("Subject:") or 
                line.startswith("1.") or 
                line.startswith("2.") or 
                line.startswith("3.") or
                "subject" in line.lower()
            ):
                # Extract subject line text
                subject = re.sub(r'^(Subject:|[123]\.|Subject\s*\d+:)', '', line).strip()
                if subject:
                    subject_lines.append(subject)
            else:
                in_subjects = False
                email_body_lines.append(line)
        
        # If no subjects found, generate defaults
        if not subject_lines:
            subject_lines = [
                f"Interested in {role} role at {company}",
                f"Quick chat about {role} opportunity?",
                f"Perfect fit for your {role} position"
            ]
        
        email_body = '\n'.join(email_body_lines)
        
        return {
            'subject_lines': subject_lines[:3],  # Max 3 subject lines
            'email_body': email_body
        }

    def get_achievements_context(self, k: int = 3) -> List[str]:
        """Extract key achievements from resume for email highlights."""
        try:
            docs = self.resume_retriever.get_relevant_documents("achievements accomplishments results impact")
            achievements = []
            
            for doc in docs[:k]:
                # Look for quantified achievements (numbers, percentages, etc.)
                content = doc.page_content
                sentences = content.split('.')
                for sentence in sentences:
                    if any(char.isdigit() for char in sentence) and len(sentence.strip()) > 20:
                        achievements.append(sentence.strip())
            
            return achievements[:2]  # Return top 2 achievements
            
        except Exception as e:
            logger.error(f"Error extracting achievements: {str(e)}")
            return []

    def validate_context(self, role: str, company: str) -> bool:
        """Validate that we have sufficient context for email generation."""
        try:
            resume_docs = self.resume_retriever.get_relevant_documents("experience skills")
            job_docs = self.job_retriever.get_relevant_documents("requirements")
            
            if not resume_docs:
                logger.warning("No resume context available")
                return False
            if not job_docs:
                logger.warning("No job context available") 
                return False
            if not role or not company:
                logger.warning("Missing role or company information")
                return False
                
            return True
            
        except Exception as e:
            logger.error(f"Error validating context: {str(e)}")
            return False

    def get_personalization_data(self, company: str) -> dict:
        """Extract company-specific information for personalization."""
        try:
            company_docs = self.job_retriever.get_relevant_documents(f"{company} culture values mission")
            company_context = ""
            if company_docs:
                company_context = company_docs[0].page_content[:200]
            
            return {
                'company_context': company_context,
                'company_name': company
            }
        except Exception as e:
            logger.error(f"Error getting personalization data: {str(e)}")
            return {'company_context': '', 'company_name': company}
