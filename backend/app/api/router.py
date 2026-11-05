from fastapi import APIRouter
from app.api.routes import health, device, card, topup, transactions

api_router = APIRouter()

api_router.include_router(health.router)
api_router.include_router(device.router)
api_router.include_router(card.router)
api_router.include_router(topup.router)
api_router.include_router(transactions.router)

