from pydantic import BaseModel, Field, field_validator
from typing import Optional


class TopUpPreviewRequest(BaseModel):
    amount: float = Field(..., description="Top-up recharge amount in INR")

    @field_validator("amount")
    @classmethod
    def validate_amount(cls, v: float) -> float:
        if v <= 0:
            raise ValueError("Recharge amount must be greater than ₹0.")
        if v > 10000:
            raise ValueError("Maximum simulated single top-up limit is ₹10,000 for NCMC demo.")
        return round(v, 2)


class TopUpPreviewResponse(BaseModel):
    amount: float
    current_balance: float
    projected_balance: float
    currency: str = "INR"
    convenience_fee: float = 0.0
    total_payable: float
    is_valid: bool = True
    message: str
    disclaimer: str = "DEMO TRANSACTION – NO REAL MONEY TRANSFERRED – PHYSICAL CARD NOT UPDATED."


class TopUpExecuteRequest(BaseModel):
    card_id: str = Field(..., description="Card ID to recharge")
    amount: float = Field(..., gt=0, le=10000, description="Amount to top-up")
    payment_method: str = Field(default="SIMULATED_TEST_WALLET", description="Simulated payment channel")
    note: Optional[str] = Field(default=None, description="Optional note for the transaction")

    @field_validator("amount")
    @classmethod
    def validate_amount(cls, v: float) -> float:
        if v <= 0:
            raise ValueError("Recharge amount must be greater than ₹0.")
        if v > 10000:
            raise ValueError("Maximum simulated top-up amount is ₹10,000.")
        return round(v, 2)

