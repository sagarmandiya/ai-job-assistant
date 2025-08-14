import redis
from app.core.config import settings
from langchain.vectorstores import Redis as RedisVectorStore
from app.ai.embeddings import get_embeddings

def get_redis_connection():
    return redis.Redis.from_url(settings.REDIS_URL)

def get_redis_vectorstore(index_name="default"):
    embeddings = get_embeddings()
    return RedisVectorStore(
        redis_url=settings.REDIS_URL,
        index_name=index_name,
        embedding=embeddings
    )
