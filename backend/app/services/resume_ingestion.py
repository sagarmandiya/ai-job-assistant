from app.ai.vectorstore import get_vectorstore
from app.utils.pdf_parser import extract_text_from_pdf
from app.utils.text_splitter import split_text

def process_and_store_resume(file_path: str, index_name="resume"):
    text = extract_text_from_pdf(file_path)
    chunks = split_text(text)
    
    if not chunks:  # Handle empty document
        chunks = ["No extractable text found"]
    
    vectorstore = get_vectorstore(index_name=index_name)
    
    # Remove dummy text if it exists (from initial creation)
    try:
        vectorstore.delete(["dummy"])
    except:
        pass  # Ignore if dummy doesn't exist
    
    vectorstore.add_texts(chunks)
    
    # Save if FAISS
    try:
        from app.persistence.faiss_client import save_faiss_vectorstore
        save_faiss_vectorstore(vectorstore, index_name=index_name)
    except ImportError:
        pass
    return {"chunks_indexed": len(chunks)}
