from app.ai.vectorstore import get_vectorstore
from app.utils.pdf_parser import extract_text_from_pdf
from app.utils.text_splitter import split_text
import logging

logger = logging.getLogger(__name__)

def process_and_store_resume(file_path: str, index_name="resume"):
    text = extract_text_from_pdf(file_path)
    chunks = split_text(text)
    
    if not chunks:  # Handle empty document
        chunks = ["No extractable text found"]
    
    vectorstore = get_vectorstore(index_name=index_name)
    
    # Clear existing resume chunks before adding new ones
    # This ensures we only use the most recent resume
    try:
        # Get all existing documents to clear them
        existing_docs = vectorstore.get()
        if existing_docs and hasattr(existing_docs, 'documents') and existing_docs.documents:
            # Delete all existing documents
            doc_ids = [doc.metadata.get('id', str(i)) for i, doc in enumerate(existing_docs.documents)]
            if doc_ids:
                vectorstore.delete(doc_ids)
                logger.info(f"Cleared {len(doc_ids)} existing resume chunks")
    except Exception as e:
        logger.warning(f"Could not clear existing resume chunks: {e}")
        # If clearing fails, try to delete by content (fallback)
        try:
            vectorstore.delete(["Initial document", "dummy", "No extractable text found"])
        except:
            pass
    
    # Add new resume chunks
    vectorstore.add_texts(chunks)
    
    # Save if FAISS
    try:
        from app.persistence.faiss_client import save_faiss_vectorstore
        save_faiss_vectorstore(vectorstore, index_name=index_name)
    except ImportError:
        pass
    return {"chunks_indexed": len(chunks)}
