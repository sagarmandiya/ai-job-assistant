from app.core.config import settings

def get_vectorstore(index_name="default"):  # Add index_name parameter
    if settings.VECTORSTORE_PROVIDER == "redis":
        from app.persistence.redis_client import get_redis_vectorstore
        return get_redis_vectorstore(index_name=index_name)  # Pass it through
    elif settings.VECTORSTORE_PROVIDER == "pinecone":
        from app.persistence.pinecone_client import get_pinecone_vectorstore
        return get_pinecone_vectorstore(index_name=index_name)  # Pass it through
    else:
        from app.persistence.faiss_client import get_faiss_vectorstore
        return get_faiss_vectorstore(index_name=index_name)  # Pass it through
