from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

from .analyzer import analyze_text
from .schemas import AnalyzeRequest, AnalyzeResponse

limiter = Limiter(key_func=get_remote_address)

app = FastAPI(title="Corrector de Español", version="1.0.0")

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/analyze", response_model=AnalyzeResponse)
@limiter.limit("10/minute")
def analyze(request: Request, body: AnalyzeRequest) -> AnalyzeResponse:
    return analyze_text(body)


frontend = Path(__file__).resolve().parent.parent / "frontend"
if frontend.exists():
    app.mount("/", StaticFiles(directory=str(frontend), html=True), name="frontend")
