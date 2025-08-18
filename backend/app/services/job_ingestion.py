from app.utils.text_splitter import split_text
from app.ai.vectorstore import get_vectorstore
import logging

logger = logging.getLogger(__name__)

def store_job_description(job_text: str, index_name="job"):
    chunks = split_text(job_text)
    vectorstore = get_vectorstore(index_name=index_name)
    
    # Clear existing job description chunks before adding new ones
    # This ensures we only use the most recent job description
    try:
        # Get all existing documents to clear them
        existing_docs = vectorstore.get()
        if existing_docs and hasattr(existing_docs, 'documents') and existing_docs.documents:
            # Delete all existing documents
            doc_ids = [doc.metadata.get('id', str(i)) for i, doc in enumerate(existing_docs.documents)]
            if doc_ids:
                vectorstore.delete(doc_ids)
                logger.info(f"Cleared {len(doc_ids)} existing job description chunks")
    except Exception as e:
        logger.warning(f"Could not clear existing job chunks: {e}")
        # If clearing fails, try to delete by content (fallback)
        try:
            vectorstore.delete(["Initial document", "dummy"])
        except:
            pass
    
    # Add new job description chunks
    vectorstore.add_texts(chunks)
    
    try:
        from app.persistence.faiss_client import save_faiss_vectorstore
        save_faiss_vectorstore(vectorstore, index_name=index_name)
    except ImportError:
        pass
    return {"chunks_indexed": len(chunks)}
