# YatraTap – Universal NCMC Card Top-Up Web Application

> **IMPORTANT DISCLAIMER**  
> **DEMO TRANSACTION – NO REAL MONEY TRANSFERRED – PHYSICAL CARD NOT UPDATED.**  
> YatraTap is an engineering simulation and research tool designed to demonstrate contactless smart card interactions and simulated transit balance top-ups (initially modeling the **Bharat Yatra NCMC** card).  
> Physical National Common Mobility Cards (NCMC) use secure contactless cryptographic chips (RuPay qSPARC dual-interface with EMV applets). Recharging real cards requires authorized banking gateways, transit authority Secure Access Modules (SAM / HSM), and cryptographic MAC-1 / MAC-2 authentication. This application **never** claims or attempts to modify physical payment cards.

---

## 1. Project Overview

**YatraTap** is a modern, responsive full-stack web application architected into **two completely separate services**:
1. **Frontend Service**: High-performance React 19 application built with Vite, TypeScript, Tailwind CSS, Framer Motion, and Lucide Icons, featuring obsidian-emerald glassmorphism, mobile-first responsiveness, and capability-aware NFC hardware detection.
2. **Backend Service**: Independent Python FastAPI REST microservice with Pydantic validation, in-memory state management, OpenAPI/Swagger documentation, and CORS controls.

---

## 2. Architecture & Technology Stack

```
+-------------------------------------------------------------------------+
|                              YatraTap UI                                |
|  React 19 + TypeScript + Vite + Tailwind CSS + Framer Motion + Lucide   |
+------------------------------------+------------------------------------+
                                     |
                                     | HTTP / JSON REST
                                     v
+------------------------------------+------------------------------------+
|                         FastAPI Backend                                 |
|       Python 3.11 + Pydantic v2 + Uvicorn + In-Memory Ledger            |
+-------------------------------------------------------------------------+
                                     |
               +---------------------+---------------------+
               |                                           |
               v                                           v
     [ Browser Web NFC ]                         [ Virtual Simulator ]
  Android Chrome (NDEFReader)                 iOS Safari / Desktop Fallback
  UID & Tag Coupler (13.56 MHz)               High-fidelity Software Tap
```

### Stack Details
- **Frontend**:
  - React 19 + Vite 8
  - TypeScript (Strict mode, ES2023)
  - Tailwind CSS 4 with custom glassmorphism styles
  - Framer Motion (smooth card tilt, radar scanning sweep, modals)
  - Lucide React icons
  - Axios HTTP Client
- **Backend**:
  - Python 3.11+
  - FastAPI 0.115+
  - Uvicorn server
  - Pydantic v2 & Pydantic-Settings
  - In-Memory Python storage (Zero SQL/NoSQL databases)

---

## 3. Directory Structure

```
YatraTap/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CardPreview.tsx          # 3D interactive Bharat Yatra NCMC card
│   │   │   ├── DeviceBadge.tsx          # Real-time hardware/OS capability pill
│   │   │   ├── Footer.tsx               # Specifications, disclaimers & docs links
│   │   │   ├── Navbar.tsx               # Navigation, theme toggle & status
│   │   │   ├── NfcRadarAnimation.tsx    # Concentric radar rings & scanning sweep
│   │   │   ├── NoticeBanner.tsx         # Mandatory simulation disclaimer banner
│   │   │   ├── ReceiptModal.tsx         # Digital verification receipt & print
│   │   │   └── TopUpModal.tsx           # Quick preset & custom recharge dialog
│   │   ├── context/
│   │   │   ├── AppContext.tsx           # Global state, ledger sync, active page
│   │   │   └── ThemeContext.tsx         # Dark / Light theme persistence
│   │   ├── pages/
│   │   │   ├── LandingPage.tsx          # Hero, tech overview, device matrix
│   │   │   ├── DashboardPage.tsx        # Card overview, balance stats, quick topup
│   │   │   ├── ScannerPage.tsx          # Capability-aware NFC scanner & virtual tap
│   │   │   ├── CardManagementPage.tsx   # Card profile metadata & reset
│   │   │   ├── TopUpPage.tsx            # Full recharge engine & balance preview
│   │   │   ├── HistoryPage.tsx          # Simulated ledger, search & filters
│   │   │   └── SettingsPage.tsx         # Diagnostics, theme, data clearing
│   │   ├── services/
│   │   │   ├── api.ts                   # Axios client for FastAPI endpoints
│   │   │   └── nfcAdapter.ts            # Modular Web NFC adapter & simulator
│   │   ├── utils/
│   │   │   ├── formatters.ts            # INR currency, date, and mask formatting
│   │   │   └── nfcDetector.ts           # Browser capability matrix detector
│   │   ├── App.tsx                      # Root application layout & toast alerts
│   │   ├── index.css                    # Tailwind CSS 4 & glassmorphism theme
│   │   └── main.tsx                     # Entry point
│   ├── .env.example                     # Environment template
│   ├── package.json                     # Frontend dependencies & build scripts
│   ├── tsconfig.json                    # TypeScript configuration
│   ├── vercel.json                      # Vercel deployment routing configuration
│   └── vite.config.ts                   # Vite configuration
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── routes/
│   │   │   │   ├── card.py              # GET /api/card/demo, POST /api/card/demo/reset
│   │   │   │   ├── device.py            # GET /api/device/capabilities
│   │   │   │   ├── health.py            # GET /api/health
│   │   │   │   ├── topup.py             # POST /api/topup/preview, POST /api/topup/demo
│   │   │   │   └── transactions.py      # GET /api/transactions, GET /api/transactions/{id}
│   │   │   └── router.py                # Aggregated FastAPI router
│   │   ├── core/
│   │   │   └── config.py                # Pydantic BaseSettings & CORS configuration
│   │   ├── schemas/
│   │   │   ├── card.py                  # Card schemas
│   │   │   ├── topup.py                 # Top-up preview & execution schemas
│   │   │   └── transaction.py           # Ledger transaction schemas
│   │   ├── services/
│   │   │   └── card_service.py          # In-memory card ledger & balance service
│   │   └── main.py                      # FastAPI application entrypoint
│   ├── .env.example                     # Backend environment template
│   ├── Procfile                         # Render deployment process definition
│   ├── render.yaml                      # Render Blueprint deployment config
│   ├── requirements.txt                 # Python dependencies
│   ├── run.py                           # Local server launcher
│   └── test_api.py                      # Automated test suite
│
├── README.md                            # Complete master documentation
└── .gitignore                           # Git ignore rules
```

---

## 4. Prerequisites

- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm**: v9.0.0 or higher
- **Python**: 3.10 or 3.11+
- **Modern Web Browser**:
  - Chrome / Chromium (Android or Desktop)
  - Apple Safari (iOS or macOS)
  - Microsoft Edge
  - Firefox

---

## 5. Installation & Setup

### A. Clone the Repository
```bash
git clone <repository-url>
cd YatraTap
```

### B. Backend Service Setup
```bash
cd backend

# Create virtual environment (optional but recommended)
python -m venv venv
# Windows:
.\venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env from template
cp .env.example .env
```

### C. Frontend Service Setup
```bash
cd ../frontend

# Install dependencies
npm install

# Create .env from template
cp .env.example .env
```

---

## 6. Running the Application

### Start Backend Service (Port 8000)
```bash
cd backend
python run.py
```
*Backend runs at `http://localhost:8000`.*  
*Swagger API documentation is available at `http://localhost:8000/docs`.*

### Start Frontend Service (Port 5173)
```bash
cd frontend
npm run dev
```
*Frontend runs at `http://localhost:5173`.*

---

## 7. Environment Configuration

### Frontend (`frontend/.env`)
| Variable | Default Value | Description |
|---|---|---|
| `VITE_APP_NAME` | `YatraTap` | Branding title |
| `VITE_API_URL` | `http://localhost:8000` | Target FastAPI backend URL |

### Backend (`backend/.env`)
| Variable | Default Value | Description |
|---|---|---|
| `APP_NAME` | `YatraTap` | Service identifier |
| `APP_ENV` | `development` | Deployment environment |
| `FRONTEND_URL` | `http://localhost:5173` | Allowed frontend origin for CORS |
| `DEMO_MODE` | `true` | Simulation guard flag |
| `API_PREFIX` | `/api` | Root API route prefix |
| `PORT` | `8000` | Port for Uvicorn server |
| `HOST` | `0.0.0.0` | Bind host address |

---

## 8. Backend REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Backend status, service name & demo mode indicator |
| `GET` | `/api/device/capabilities` | Technical platform & Web NFC capability matrix |
| `GET` | `/api/card/demo` | Current Bharat Yatra card profile & simulated balance |
| `POST` | `/api/card/demo/reset` | Resets card balance to ₹450.00 and clears mock sessions |
| `POST` | `/api/topup/preview` | Validates recharge amount and calculates projected balance |
| `POST` | `/api/topup/demo` | Executes simulated top-up and returns receipt |
| `GET` | `/api/transactions` | Retrieves in-memory transaction history |
| `GET` | `/api/transactions/{id}` | Retrieves details for an individual transaction |

Interactive Swagger documentation is available at **`http://localhost:8000/docs`**.

---

## 9. Testing Instructions

### Run Backend API Test Suite
```bash
cd backend
python test_api.py
```
This tests all endpoints, balance math, validation bounds, and reset endpoints with `TestClient`.

### Run Frontend Production Build & TypeScript Check
```bash
cd frontend
npm run build
```
Compiles with 0 TypeScript errors and produces an optimized production bundle in `frontend/dist/`.

---

## 10. Device Compatibility & NFC Matrix

| Platform | Browser | Web NFC Support | Behavior in YatraTap |
|---|---|---|---|
| **Android** | Google Chrome | Supported (HTTPS / Localhost) | Uses W3C `NDEFReader` to poll 13.56 MHz RFID tags and detect card UID |
| **Android** | Samsung Internet / Edge | Partial / Full | Capability detector dynamically verifies `NDEFReader` |
| **Apple iOS** | Safari / Chrome | Restricted by WebKit | Activates **Virtual NFC Tap Engine**. Full card management, simulated recharges and receipts remain functional |
| **Desktop** | Chrome / Edge / Firefox | No native consumer polling | Activates **Virtual NFC Mode** and Software Card Tap emulation |

---

## 11. Security Guardrails & Real NCMC Requirements

1. **Tag Reading is Not Payment Authorization**:  
   Detecting an NFC tag UID via Web NFC does **not** grant access to EMV payment applets or the RuPay qSPARC Stored Value Area (SVA).
2. **Never Storing Payment Secrets**:  
   The application never reads, stores, or extracts PAN, CVV, or cryptographic session keys.
3. **No External Payment Gateways**:  
   No real money, UPI, Razorpay, or payment gateways are linked.
4. **Authorized Banking Architecture**:  
   To update balance on a real physical NCMC card, a solution must incorporate:
   - Certified Banking Gateway & NPCI RuPay Host
   - Hardware Security Module (HSM) generating MAC-1 balance top-up cryptograms
   - Certified transit reader with Secure Access Module (SAM chip)
   - Two-phase mutual cryptographic authentication over APDU commands.

---

## 12. Deployment Instructions

### Frontend Deployment on Vercel
1. Set the Root Directory to `frontend`.
2. Framework Preset: **Vite**.
3. Build Command: `npm run build`.
4. Output Directory: `dist`.
5. Environment Variable:
   - `VITE_API_URL`: Your deployed Render backend URL (e.g. `https://yatratap-backend.onrender.com`).
6. The included `frontend/vercel.json` ensures all client-side routes rewrite properly to `index.html`.

### Backend Deployment on Render
1. Create a new **Web Service** on Render.
2. Root Directory: `backend`.
3. Runtime: **Python 3**.
4. Build Command: `pip install -r requirements.txt`.
5. Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.
6. Environment Variables:
   - `APP_NAME`: `YatraTap`
   - `APP_ENV`: `production`
   - `DEMO_MODE`: `true`
   - `FRONTEND_URL`: Your deployed Vercel frontend URL.
7. Alternatively, deploy using the included `backend/render.yaml` Blueprint.

---

## 13. Acceptance Checklist

- [x] Frontend service starts independently on port 5173.
- [x] Backend service starts independently on port 8000.
- [x] Frontend successfully communicates with backend REST APIs.
- [x] Demo Bharat Yatra card can be reset to default ₹450.00.
- [x] Demo top-up works with presets (₹100, ₹200, ₹500, ₹1000) and custom amounts.
- [x] Transaction history is recorded and receipts can be inspected and printed.
- [x] NFC capability detection identifies iOS, Android, and Desktop environments.
- [x] Unsupported devices display elegant virtual fallback without blocking functionality.
- [x] No external database is required (clean in-memory ledger and localStorage cache).
- [x] Clear simulation disclaimer prominently displayed across all views.
- [x] Vercel and Render deployment files and instructions configured.

