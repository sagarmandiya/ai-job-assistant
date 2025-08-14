from app.ai.vectorstore import get_vectorstore

def get_retriever(index_name="default", k=4):
    vectorstore = get_vectorstore(index_name=index_name)  
    return vectorstore.as_retriever(search_kwargs={"k": k})
