# services/ai — FastAPI application
# Sprint 0: minimal scaffold with /healthz endpoint only.
# No AI agents, no LangGraph, no model calls — those arrive in v0.5.
# Source: SYSTEM_ARCHITECTURE.md — "services/ai (Python, FastAPI, LangGraph)"
# Source: AI_ARCHITECTURE.md — "serves two capabilities" (v0.5+)

from fastapi import FastAPI
from fastapi.responses import JSONResponse

app = FastAPI(
    title="Chorus AI",
    description=(
        "AI copilot service for cohort criteria extraction and compliance flagging. "
        "Source: AI_ARCHITECTURE.md. "
        "Sprint 0: health-check endpoint only."
    ),
    version="0.0.1",
    # Disable /docs in production — not a public-facing API
    docs_url="/docs" if __name__ == "__main__" else None,
    redoc_url=None,
)


@app.get(
    "/healthz",
    summary="Health check",
    description="Returns 200 OK if the service is running. Used by Docker Compose and CI.",
    tags=["Internal"],
)
async def health() -> JSONResponse:
    """Liveness probe — no dependency checks in Sprint 0."""
    return JSONResponse(content={"status": "ok"})
