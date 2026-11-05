from fastapi import APIRouter, HTTPException, status
from typing import Optional
from app.services.card_service import card_service
from app.schemas.card import CardInfo, AddCardRequest, CardResetResponse, CardListResponse

router = APIRouter(prefix="/card", tags=["Card Management"])


@router.get("/demo", response_model=CardInfo)
def get_demo_card(card_id: Optional[str] = None):
    """
    Retrieve current active simulated card state, metadata and demo balance.
    """
    return card_service.get_card(card_id)


@router.get("/list", response_model=CardListResponse)
def list_cards():
    """
    Retrieve list of all simulated cards registered in this session.
    """
    cards = card_service.get_all_cards()
    return CardListResponse(cards=cards, count=len(cards))


@router.post("/add", response_model=CardInfo, status_code=status.HTTP_201_CREATED)
def add_card(payload: AddCardRequest):
    """
    Register a new simulated NCMC card (with custom name, bank issuer, or scanned tag ID).
    """
    return card_service.add_card(payload)


@router.post("/select/{card_id}", response_model=CardInfo)
def select_card(card_id: str):
    """
    Switch active card in the current session.
    """
    card = card_service.set_active_card(card_id)
    if not card:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Card with ID '{card_id}' not found."
        )
    return card


@router.post("/demo/reset", response_model=CardResetResponse)
def reset_demo_card():
    """
    Reset simulated card balance and mock transactions back to factory defaults.
    """
    reset_card = card_service.reset_card()
    return CardResetResponse(
        success=True,
        message="Demo card balance and state successfully reset to initial baseline (₹450.00).",
        card=reset_card
    )
