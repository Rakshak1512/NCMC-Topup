from fastapi import APIRouter, HTTPException, status
from app.services.card_service import card_service
from app.schemas.topup import (
    TopUpPreviewRequest,
    TopUpPreviewResponse,
    TopUpExecuteRequest,
)
from app.schemas.transaction import Transaction

router = APIRouter(prefix="/topup", tags=["Top-Up Simulation"])


@router.post("/preview", response_model=TopUpPreviewResponse)
def preview_topup(payload: TopUpPreviewRequest):
    """
    Validate the requested recharge amount and return projected balance calculation.
    """
    if payload.amount <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Top-up amount must be greater than zero."
        )
    if payload.amount > 10000:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Maximum allowed single top-up in simulation is ₹10,000."
        )

    return card_service.preview_topup(payload.amount)


@router.post("/demo", response_model=Transaction)
def execute_demo_topup(payload: TopUpExecuteRequest):
    """
    Perform a simulated top-up transaction.
    Returns the created demo transaction receipt with updated demo balance.
    """
    if payload.amount <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Recharge amount must be greater than zero."
        )
    if payload.amount > 10000:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Maximum simulated top-up limit is ₹10,000."
        )

    txn = card_service.execute_topup(
        card_id=payload.card_id,
        amount=payload.amount,
        payment_method=payload.payment_method
    )
    return txn

