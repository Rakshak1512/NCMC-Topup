from fastapi import APIRouter
from app.core.config import settings
import datetime

router = APIRouter(tags=["Health"])


@router.get("/health")
def get_health():
    return {
        "status": "healthy",
        "service": settings.APP_NAME,
        "environment": settings.APP_ENV,
        "demo_mode": settings.DEMO_MODE,
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "disclaimer": "DEMO SYSTEM ONLY – Physical cards are not written or modified.",
        "version": "1.0.0"
    }

