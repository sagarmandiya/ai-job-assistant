from fastapi import FastAPI
from app.core.config import settings
from app.api import routes_chat, routes_generation, routes_job

def create_app() -> FastAPI:
    app = FastAPI(
        title="Job Assistant Backend",
        version="1.0.0",
        description="AI powered job application assistant with long-term memory"
    )

    # Include Routers
    app.include_router(routes_chat.router, prefix="/chat", tags=["Chat"])
    app.include_router(routes_generation.router, prefix="/generate", tags=["Generation"])
    app.include_router(routes_job.router, prefix="/job", tags=["Job Posting"])

    @app.get("/health")
    def health_check():
        return {"status": "ok", "app_name": settings.APP_NAME}

    return app

app = create_app()
