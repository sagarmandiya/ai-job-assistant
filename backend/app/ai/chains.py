from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
from app.core.config import settings
from app.ai.retriever import get_retriever
from app.ai.llm_factory import get_llm
from app.ai.prompts import COVER_LETTER_PROMPT, RECRUITER_EMAIL_PROMPT  # Import prompts
import logging

logger = logging.getLogger(__name__)

def get_rag_context(resume_k=4, job_k=4):
    resume_docs = get_retriever(index_name="resume", k=resume_k).get_relevant_documents("summarize my fit")
    job_docs = get_retriever(index_name="job", k=job_k).get_relevant_documents("summarize requirements")
    
    resume_context = "\n".join([d.page_content for d in resume_docs])
    job_context = "\n".join([d.page_content for d in job_docs])
    
    # Log the retrieved contexts for debugging
    logger.info(f"Retrieved {len(resume_docs)} resume chunks and {len(job_docs)} job chunks")
    if job_docs:
        logger.info(f"Job context preview: {job_context[:200]}...")
    else:
        logger.warning("No job description chunks retrieved!")
    
    return resume_context, job_context

def generate_cover_letter(role: str, company: str):
    resume_context, job_context = get_rag_context()
    
    prompt = PromptTemplate.from_template(COVER_LETTER_PROMPT)  # Use imported prompt
    llm = get_llm(temperature=0.7)
    chain = LLMChain(prompt=prompt, llm=llm)
    return chain.run(role=role, company=company, resume_context=resume_context, job_context=job_context)

def generate_recruiter_email(role: str, company: str):
    resume_context, job_context = get_rag_context()
    
    prompt = PromptTemplate.from_template(RECRUITER_EMAIL_PROMPT)  # Use imported prompt
    llm = get_llm(temperature=0.7)
    chain = LLMChain(prompt=prompt, llm=llm)
    return chain.run(role=role, company=company, resume_context=resume_context, job_context=job_context)
