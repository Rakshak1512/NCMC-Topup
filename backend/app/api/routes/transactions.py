from fastapi import APIRouter, HTTPException, status
from app.services.card_service import card_service
from app.schemas.transaction import Transaction, TransactionListResponse

router = APIRouter(prefix="/transactions", tags=["Transactions"])


@router.get("", response_model=TransactionListResponse)
def get_transactions():
    """
    Retrieve all simulated transactions in chronological order (newest first).
    """
    txns = card_service.get_transactions()
    return TransactionListResponse(
        transactions=txns,
        count=len(txns),
        demo_mode=True,
        notice="In-memory simulated transactions. Data resets on backend service restart."
    )


@router.get("/{transaction_id}", response_model=Transaction)
def get_transaction_by_id(transaction_id: str):
    """
    Retrieve specific simulated transaction details by ID.
    """
    txn = card_service.get_transaction(transaction_id)
    if not txn:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Transaction with ID '{transaction_id}' not found."
        )
    return txn

