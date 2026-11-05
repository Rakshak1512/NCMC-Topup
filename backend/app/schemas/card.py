from pydantic import BaseModel, Field
from typing import Optional, List


class CardInfo(BaseModel):
    card_id: str = Field(..., description="Unique simulated card identifier")
    card_type: str = Field(..., description="Name of the card profile")
    issuer: str = Field(..., description="Card issuing partner")
    standard: str = Field(..., description="Payment transit specification")
    card_number_masked: str = Field(..., description="Masked card number for display")
    expiry: str = Field(..., description="Card expiry month/year")
    balance: float = Field(..., ge=0, description="Current simulated balance in INR")
    currency: str = Field(default="INR", description="Currency symbol/code")
    status: str = Field(default="ACTIVE", description="Card operational status")
    is_demo: bool = Field(default=True, description="Flag indicating simulated card")
    last_updated: str = Field(..., description="ISO timestamp of last activity")
    notice: str = Field(..., description="Simulated card disclaimer notice")


class AddCardRequest(BaseModel):
    card_type: str = Field(default="Bharat Yatra NCMC Card", description="Card brand or name")
    issuer: str = Field(default="State Bank of India / NPCI RuPay", description="Issuing bank or transit agency")
    card_number: Optional[str] = Field(default=None, description="Full or last 4 digits of card")
    holder_name: Optional[str] = Field(default="BHARAT COMMUTER", description="Cardholder name")
    balance: float = Field(default=200.0, ge=0, le=10000, description="Initial simulated balance")
    card_id: Optional[str] = Field(default=None, description="Optional custom card ID (e.g. from scanned NFC tag)")


class CardResetResponse(BaseModel):
    success: bool
    message: str
    card: CardInfo


class CardListResponse(BaseModel):
    cards: List[CardInfo]
    count: int
