from fastapi import APIRouter

router = APIRouter(tags=["Device & Capabilities"])


@router.get("/device/capabilities")
def get_device_capabilities():
    """
    Returns platform capability matrix and technical architecture specifications
    for Web NFC and NCMC contactless cards.
    """
    return {
        "web_nfc": {
            "supported_browsers": [
                {
                    "platform": "Android",
                    "browser": "Chrome / Chromium / Edge",
                    "support": "Full Web NFC (NDEFReader API) supported under HTTPS",
                    "card_interaction": "NDEF tag read/write; Serial Number / UID detection",
                    "can_write_ncmc_transit_balance": False,
                    "reason": "NCMC cards use ISO/IEC 14443 Type A/B APDU commands with cryptographic Secure Element keys (qSPARC SAM). Web NFC exposes only NDEF messages, not raw secure APDUs."
                },
                {
                    "platform": "iOS (iPhone/iPad)",
                    "browser": "Safari / Chrome on iOS",
                    "support": "Standard Web NFC NDEFReader is not exposed by WebKit",
                    "card_interaction": "Native apps use CoreNFC; Web browsers cannot scan or write NFC tags directly",
                    "can_write_ncmc_transit_balance": False,
                    "reason": "Apple WebKit does not provide the Web NFC API. Full simulation fallback is active."
                },
                {
                    "platform": "Desktop (Windows, macOS, Linux)",
                    "browser": "Chrome / Edge / Firefox",
                    "support": "Web NFC disabled by default on desktop hardware without standard NFC polling controller",
                    "card_interaction": "Simulated hardware interface available",
                    "can_write_ncmc_transit_balance": False,
                    "reason": "Requires specialized USB smart card reader (PC/SC) with dedicated APDU middleware."
                }
            ],
            "security_requirements": {
                "requires_https": True,
                "requires_user_gesture": True,
                "requires_secure_context": True,
                "feature_policy": "nfc *"
            }
        },
        "ncmc_architecture": {
            "specification": "National Common Mobility Card (NCMC) / RuPay qSPARC v2",
            "frequency": "13.56 MHz (HF RFID)",
            "standards": ["ISO/IEC 14443 Type A", "ISO/IEC 14443 Type B", "ISO/IEC 7816-4"],
            "security_model": "Dual-interface chip with cryptographic authentication (3DES / AES-128 / RSA-2048)",
            "wallet_type": "On-chip offline transit balance (Stored Value Area)",
            "authorized_topup_requirements": [
                "Authorized Banking Partner / Issuer Payment Gateway Integration",
                "NPCI / RuPay certified Key Management System (KMS / HSM)",
                "Cryptographic Script Generation for Balance Credit (MAC-1 / MAC-2 authentication)",
                "Contactless Reader Writer with SAM (Secure Access Module) certified by transit authority"
            ]
        },
        "simulation_mode": {
            "enabled": True,
            "disclaimer": "DEMO TRANSACTION – NO REAL MONEY TRANSFERRED – PHYSICAL CARD NOT UPDATED."
        }
    }

