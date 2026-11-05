import sys
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_endpoints():
    print("Testing /api/health...")
    r = client.get("/api/health")
    assert r.status_code == 200, r.text
    print("Health response:", r.json())

    print("\nTesting /api/device/capabilities...")
    r = client.get("/api/device/capabilities")
    assert r.status_code == 200, r.text
    print("Capabilities OK.")

    print("\nTesting /api/card/demo...")
    r = client.get("/api/card/demo")
    assert r.status_code == 200, r.text
    initial_card = r.json()
    print("Demo Card:", initial_card["card_id"], "Balance:", initial_card["balance"])

    print("\nTesting /api/topup/preview for 200...")
    r = client.post("/api/topup/preview", json={"amount": 200})
    assert r.status_code == 200, r.text
    preview = r.json()
    print("Preview projected balance:", preview["projected_balance"])

    print("\nTesting /api/topup/demo for 200...")
    r = client.post("/api/topup/demo", json={"card_id": initial_card["card_id"], "amount": 200})
    assert r.status_code == 200, r.text
    txn = r.json()
    print("Transaction created:", txn["transaction_id"], "New Balance:", txn["updated_balance"])

    print("\nTesting /api/transactions...")
    r = client.get("/api/transactions")
    assert r.status_code == 200, r.text
    txns = r.json()
    print(f"Total transactions: {txns['count']}")

    print("\nTesting /api/transactions/{id}...")
    r = client.get(f"/api/transactions/{txn['transaction_id']}")
    assert r.status_code == 200, r.text
    print("Fetched individual txn OK.")

    print("\nTesting /api/card/demo/reset...")
    r = client.post("/api/card/demo/reset")
    assert r.status_code == 200, r.text
    reset_card = r.json()
    print("Reset card balance:", reset_card["card"]["balance"])

    print("\nALL BACKEND API TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    test_endpoints()

