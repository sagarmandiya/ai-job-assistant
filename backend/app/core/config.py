from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "Job Assistant Backend"
    ENVIRONMENT: str = "development"

    # LLM Provider Configuration
    LLM_PROVIDER: str = "perplexity"  # Default to Perplexity
    
    # API Keys (OpenAI now optional)
    OPENAI_API_KEY: str = ""  # Optional - only needed if using OpenAI
    PPLX_API_KEY: str = ""    # Required for Perplexity
    PERPLEXITY_MODEL: str = "sonar"
    OPENAI_MODEL: str = "gpt-4"
    
    # Hugging Face Embedding Configuration
    EMBEDDING_MODEL: str = "sentence-transformers/all-MiniLM-L6-v2"  # Free HF model
    
    # Other settings
    PINECONE_API_KEY: str = ""
    PINECONE_ENVIRONMENT: str = ""
    REDIS_URL: str = "redis://localhost:6379/0"
    VECTORSTORE_PROVIDER: str = "faiss"

    class Config:
        env_file = ".env"

settings = Settings()
 