import datetime
import hashlib
import uuid
from typing import Dict, List, Optional
from app.schemas.card import CardInfo, AddCardRequest
from app.schemas.topup import TopUpPreviewResponse
from app.schemas.transaction import Transaction

DEFAULT_CARD_ID = "NCMC-BY-8021-9943"
DEFAULT_INITIAL_BALANCE = 450.00


def get_current_iso_time() -> str:
    return datetime.datetime.now(datetime.timezone.utc).isoformat()


class CardService:
    def __init__(self):
        self._reset_state()

    def _reset_state(self):
        now = get_current_iso_time()
        self.active_card_id = DEFAULT_CARD_ID
        self.cards: Dict[str, Dict] = {
            DEFAULT_CARD_ID: {
                "card_id": DEFAULT_CARD_ID,
                "card_type": "Bharat Yatra NCMC Card",
                "issuer": "State Bank of India / NPCI RuPay",
                "standard": "NCMC / RuPay Contactless (qSPARC v2)",
                "card_number_masked": "6071 •••• •••• 8021",
                "expiry": "08/29",
                "balance": DEFAULT_INITIAL_BALANCE,
                "currency": "INR",
                "status": "ACTIVE",
                "is_demo": True,
                "last_updated": now,
                "notice": "SIMULATION ONLY – Balance is maintained in-memory for testing and will reset on server restart.",
            }
        }

        # Seed initial simulated transactions
        t1_time = (datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(days=2)).isoformat()
        t2_time = (datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(hours=14)).isoformat()

        self.transactions: List[Transaction] = [
            Transaction(
                transaction_id="TXN-DEMO-INIT-101",
                card_id=DEFAULT_CARD_ID,
                amount=500.00,
                currency="INR",
                previous_balance=0.00,
                updated_balance=500.00,
                status="SUCCESS",
                timestamp=t1_time,
                payment_method="Simulated Sandbox Load",
                type="INITIAL_LOAD",
                label="DEMO INITIAL ACTIVATION",
                disclaimer="DEMO TRANSACTION – NO REAL MONEY TRANSFERRED – PHYSICAL CARD NOT UPDATED.",
                receipt_hash="9f83ab29c488b14e30ef48e0",
            ),
            Transaction(
                transaction_id="TXN-DEMO-TRIP-102",
                card_id=DEFAULT_CARD_ID,
                amount=50.00,
                currency="INR",
                previous_balance=500.00,
                updated_balance=450.00,
                status="SUCCESS",
                timestamp=t2_time,
                payment_method="Simulated AFC Gate Tap",
                type="TRANSIT_DEBIT",
                label="DEMO METRO TAP-OUT (SIMULATED)",
                disclaimer="DEMO TRANSACTION – NO REAL MONEY TRANSFERRED – PHYSICAL CARD NOT UPDATED.",
                receipt_hash="e3b0c44298fc1c149afbf4c8",
            ),
        ]

    def get_card(self, card_id: Optional[str] = None) -> CardInfo:
        target_id = card_id or self.active_card_id
        if target_id not in self.cards:
            target_id = self.active_card_id
        return CardInfo(**self.cards[target_id])

    def get_all_cards(self) -> List[CardInfo]:
        return [CardInfo(**data) for data in self.cards.values()]

    def add_card(self, req: AddCardRequest) -> CardInfo:
        now = get_current_iso_time()
        rand_code = uuid.uuid4().hex[:4].upper()
        card_id = req.card_id or f"NCMC-BY-{rand_code}-{uuid.uuid4().hex[:4].upper()}"

        clean_num = req.card_number or rand_code
        last4 = clean_num.replace(" ", "")[-4:] if len(clean_num) >= 4 else f"{rand_code}"
        masked_number = f"6071 •••• •••• {last4}"

        card_entry = {
            "card_id": card_id,
            "card_type": req.card_type or "Bharat Yatra NCMC Card",
            "issuer": req.issuer or "State Bank of India / NPCI RuPay",
            "standard": "NCMC / RuPay Contactless (qSPARC v2)",
            "card_number_masked": masked_number,
            "expiry": "12/30",
            "balance": round(req.balance, 2),
            "currency": "INR",
            "status": "ACTIVE",
            "is_demo": True,
            "last_updated": now,
            "notice": "SIMULATION ONLY – Balance is maintained in-memory for testing and will reset on server restart.",
        }

        self.cards[card_id] = card_entry
        self.active_card_id = card_id

        # Also add an initial activation transaction
        init_txn = Transaction(
            transaction_id=f"TXN-DEMO-INIT-{uuid.uuid4().hex[:6].upper()}",
            card_id=card_id,
            amount=round(req.balance, 2),
            currency="INR",
            previous_balance=0.00,
            updated_balance=round(req.balance, 2),
            status="SUCCESS",
            timestamp=now,
            payment_method="Simulated Card Registration",
            type="INITIAL_LOAD",
            label="NEW CARD REGISTERED",
            disclaimer="DEMO TRANSACTION – NO REAL MONEY TRANSFERRED – PHYSICAL CARD NOT UPDATED.",
            receipt_hash=hashlib.sha256(f"{card_id}:{now}".encode()).hexdigest()[:24],
        )
        self.transactions.insert(0, init_txn)

        return CardInfo(**card_entry)

    def set_active_card(self, card_id: str) -> Optional[CardInfo]:
        if card_id in self.cards:
            self.active_card_id = card_id
            return CardInfo(**self.cards[card_id])
        return None

    def reset_card(self) -> CardInfo:
        self._reset_state()
        return self.get_card()

    def preview_topup(self, amount: float, card_id: Optional[str] = None) -> TopUpPreviewResponse:
        target_id = card_id or self.active_card_id
        card_data = self.cards.get(target_id, self.cards[self.active_card_id])
        current_balance = float(card_data["balance"])
        projected = round(current_balance + amount, 2)
        total_payable = round(amount, 2)

        return TopUpPreviewResponse(
            amount=amount,
            current_balance=current_balance,
            projected_balance=projected,
            currency="INR",
            convenience_fee=0.0,
            total_payable=total_payable,
            is_valid=True,
            message=f"Preview successful. New projected balance will be ₹{projected:.2f}.",
            disclaimer="DEMO TRANSACTION – NO REAL MONEY TRANSFERRED – PHYSICAL CARD NOT UPDATED.",
        )

    def execute_topup(
        self, card_id: str, amount: float, payment_method: str = "Simulated Sandbox"
    ) -> Transaction:
        if card_id not in self.cards:
            # Auto-create if not present
            self.cards[card_id] = {
                "card_id": card_id,
                "card_type": "Bharat Yatra NCMC Card",
                "issuer": "State Bank of India / NPCI RuPay",
                "standard": "NCMC / RuPay Contactless (qSPARC v2)",
                "card_number_masked": f"6071 •••• •••• {card_id[-4:] if len(card_id) >= 4 else '8021'}",
                "expiry": "08/29",
                "balance": 0.0,
                "currency": "INR",
                "status": "ACTIVE",
                "is_demo": True,
                "last_updated": get_current_iso_time(),
                "notice": "SIMULATION ONLY – Balance is maintained in-memory for testing and will reset on server restart.",
            }

        target_card = self.cards[card_id]
        previous_balance = float(target_card["balance"])
        updated_balance = round(previous_balance + amount, 2)
        target_card["balance"] = updated_balance
        now = get_current_iso_time()
        target_card["last_updated"] = now
        self.active_card_id = card_id

        # Generate unique transaction ID & mock verification receipt hash
        random_suffix = uuid.uuid4().hex[:6].upper()
        date_str = datetime.datetime.now(datetime.timezone.utc).strftime("%Y%m%d")
        txn_id = f"TXN-DEMO-{date_str}-{random_suffix}"

        raw_hash_input = f"{txn_id}:{card_id}:{amount}:{updated_balance}:{now}"
        receipt_hash = hashlib.sha256(raw_hash_input.encode()).hexdigest()[:24]

        new_txn = Transaction(
            transaction_id=txn_id,
            card_id=card_id,
            amount=round(amount, 2),
            currency="INR",
            previous_balance=previous_balance,
            updated_balance=updated_balance,
            status="SUCCESS",
            timestamp=now,
            payment_method=payment_method,
            type="TOP_UP",
            label="DEMO TOP-UP RECHARGE",
            disclaimer="DEMO TRANSACTION – NO REAL MONEY TRANSFERRED – PHYSICAL CARD NOT UPDATED.",
            receipt_hash=receipt_hash,
        )

        self.transactions.insert(0, new_txn)
        return new_txn

    def get_transactions(self) -> List[Transaction]:
        return self.transactions

    def get_transaction(self, transaction_id: str) -> Optional[Transaction]:
        for txn in self.transactions:
            if txn.transaction_id == transaction_id:
                return txn
        return None


# Global singleton in-memory service instance
card_service = CardService()
