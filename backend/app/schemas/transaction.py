from pydantic import BaseModel, Field
from typing import List, Optional


class Transaction(BaseModel):
    transaction_id: str = Field(..., description="Unique simulated transaction identifier")
    card_id: str = Field(..., description="Associated card identifier")
    amount: float = Field(..., description="Top-up transaction amount")
    currency: str = Field(default="INR", description="Currency code")
    previous_balance: float = Field(..., description="Simulated balance prior to transaction")
    updated_balance: float = Field(..., description="Simulated balance after transaction")
    status: str = Field(default="SUCCESS", description="Transaction status")
    timestamp: str = Field(..., description="ISO 8601 transaction timestamp")
    payment_method: str = Field(default="Simulated Sandbox", description="Payment simulation mode")
    type: str = Field(default="TOP_UP", description="Transaction type")
    label: str = Field(default="DEMO RECHARGE", description="Human-readable transaction label")
    disclaimer: str = Field(
        default="DEMO TRANSACTION – NO REAL MONEY TRANSFERRED – PHYSICAL CARD NOT UPDATED.",
        description="Mandatory simulation disclaimer"
    )
    receipt_hash: Optional[str] = Field(default=None, description="Simulated cryptographic receipt hash")


class TransactionListResponse(BaseModel):
    transactions: List[Transaction]
    count: int
    demo_mode: bool = True
    notice: str = "In-memory transaction history for demonstration purposes only."

