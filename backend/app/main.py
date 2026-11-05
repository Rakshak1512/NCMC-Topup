from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.core.config import settings
from app.api.router import api_router

app = FastAPI(
    title="YatraTap - Universal NCMC Card Top-Up API",
    description=(
        "Backend simulation service for YatraTap NCMC card reading and simulated top-up workflows.\n\n"
        "**NOTE:** This service is for demonstration and experimentation only. "
        "Physical NCMC cards are not modified without authorized banking keys and SAM modules."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows frontend from any port or deployment preview during testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Router
app.include_router(api_router, prefix=settings.API_PREFIX)


@app.get("/", tags=["Root"])
def root():
    return {
        "service": settings.APP_NAME,
        "status": "online",
        "demo_mode": settings.DEMO_MODE,
        "docs": "/docs",
        "api_prefix": settings.API_PREFIX,
        "disclaimer": "DEMO TRANSACTION – NO REAL MONEY TRANSFERRED – PHYSICAL CARD NOT UPDATED."
    }

