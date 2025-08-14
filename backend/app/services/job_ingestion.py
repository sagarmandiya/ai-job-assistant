from app.utils.text_splitter import split_text
from app.ai.vectorstore import get_vectorstore

def store_job_description(job_text: str, index_name="job"):
    chunks = split_text(job_text)
    vectorstore = get_vectorstore(index_name=index_name)
    vectorstore.add_texts(chunks)
    try:
        from app.persistence.faiss_client import save_faiss_vectorstore
        save_faiss_vectorstore(vectorstore, index_name=index_name)
    except ImportError:
        pass
    return {"chunks_indexed": len(chunks)}
