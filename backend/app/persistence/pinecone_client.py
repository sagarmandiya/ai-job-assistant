import pinecone
from app.core.config import settings
from langchain.vectorstores import Pinecone
from app.ai.embeddings import get_embeddings

def get_pinecone_vectorstore(index_name="default"):
    pinecone.init(api_key=settings.PINECONE_API_KEY, environment=settings.PINECONE_ENVIRONMENT)
    embeddings = get_embeddings()
    if index_name not in pinecone.list_indexes():
        pinecone.create_index(name=index_name, dimension=1536, metric="cosine")
    return Pinecone.from_existing_index(index_name=index_name, embedding=embeddings)
