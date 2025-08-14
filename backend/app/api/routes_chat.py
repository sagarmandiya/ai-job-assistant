from fastapi import APIRouter
from app.models.request_models import ChatRequest
from app.models.response_models import ChatResponse
from app.ai.retriever import get_retriever
from app.ai.llm_factory import get_llm  # Use factory instead
from app.core.config import settings

router = APIRouter()

@router.post("/", response_model=ChatResponse)
async def chat(request: ChatRequest):
    retriever = get_retriever(index_name="resume")
    docs = retriever.get_relevant_documents(request.message)
    context_snippets = [doc.page_content for doc in docs]

    llm = get_llm(temperature=0)  # Use factory function
    answer = llm.predict(f"Context: {context_snippets}\nQuestion: {request.message}")

    return ChatResponse(reply=answer, context_used=context_snippets)
