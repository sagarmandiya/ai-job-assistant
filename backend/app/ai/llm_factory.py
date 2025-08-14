from langchain_community.llms import OpenAI
from langchain_perplexity import ChatPerplexity
from app.core.config import settings

def get_llm(temperature: float = 0.7):
    """
    Factory function to get the appropriate LLM based on configuration.
    """
    if settings.LLM_PROVIDER.lower() == "openai" and settings.OPENAI_API_KEY:
        return OpenAI(
            api_key=settings.OPENAI_API_KEY, 
            temperature=temperature, 
            model_name=settings.OPENAI_MODEL
        )
    else:
        # Default to Perplexity (requires PPLX_API_KEY)
        if not settings.PPLX_API_KEY:
            raise ValueError("PPLX_API_KEY is required when not using OpenAI")
        
        return ChatPerplexity(
            pplx_api_key=settings.PPLX_API_KEY,
            model=settings.PERPLEXITY_MODEL,
            temperature=temperature
        )
