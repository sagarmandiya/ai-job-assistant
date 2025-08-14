import os
from pathlib import Path
from typing import List
import faiss
from langchain_community.vectorstores import FAISS
from langchain.schema import Document
from app.ai.embeddings import get_embeddings
import logging

logger = logging.getLogger(__name__)

FAISS_DIR = Path("./vectorstore")
FAISS_DIR.mkdir(exist_ok=True)

def get_faiss_vectorstore(index_name="default"):
    """Get or create FAISS vectorstore with proper error handling"""
    embeddings = get_embeddings()
    faiss_path = FAISS_DIR / f"{index_name}.faiss"
    pkl_path = FAISS_DIR / f"{index_name}.pkl"
    
    if faiss_path.exists() and pkl_path.exists():
        try:
            logger.info(f"Loading existing FAISS index: {index_name}")
            return FAISS.load_local(
                str(FAISS_DIR), 
                embeddings, 
                index_name=index_name,
                allow_dangerous_deserialization=True 
            )
        except Exception as e:
            logger.warning(f"Failed to load existing index, creating new one: {e}")
    
    # Create new index with a single dummy document to avoid empty index issues
    logger.info(f"Creating new FAISS index: {index_name}")
    dummy_docs = [Document(page_content="Initial document", metadata={"source": "system"})]
    vectorstore = FAISS.from_documents(dummy_docs, embeddings)
    save_faiss_vectorstore(vectorstore, index_name=index_name)
    return vectorstore

def save_faiss_vectorstore(vectorstore: FAISS, index_name="default"):
    """Save FAISS vectorstore to disk"""
    try:
        vectorstore.save_local(str(FAISS_DIR), index_name=index_name)
        logger.info(f"Saved FAISS index: {index_name}")
    except Exception as e:
        logger.error(f"Failed to save FAISS index {index_name}: {e}")
        raise
