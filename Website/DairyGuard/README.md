# 🥛 DairyGuard - IoT Cold-Chain Milk Quality & Spoilage Monitoring

DairyGuard is an IoT and AI-driven cold-chain monitoring platform designed for dairy cooperatives and milk transport fleets to track milk health parameters (Temperature, pH, TDS) and predict spoilage risk in real-time.

---

## 🚀 Quick Start (Run in One Step)

From the `DairyGuard` root directory, execute:

```bash
npm run dev
```

> **What this does**: Concurrently boots both the **Express REST API Backend** (Port `5000`) and the **React + Vite Frontend** (Port `5173`) with live reload and unified console logs.

Once running, open your web browser at:
👉 **[http://localhost:5173](http://localhost:5173)**

---

## 🔑 Demo Account Credentials

For instant testing, pre-seeded demo credentials are ready to use:

- **Email**: `demo@dairyguard.com`
- **Password**: `password123`
- *(Alternatively, click the **"⚡ Auto-fill Demo Account"** button directly on the Login screen!)*

You can also register a brand new cooperative account anytime via the **"Register Dairy"** link on the login page.

---

## 🛠️ Running Services Separately (Two Terminals)

If you prefer running the backend and frontend in separate terminal windows:

### Terminal 1: Backend Server
```bash
cd backend
npm run dev
```
* Backend runs at: `http://localhost:5000`
* Health check: `http://localhost:5000/api/health`

### Terminal 2: Frontend Web Client
```bash
cd frontend
npm run dev
```
* Vite dev server runs at: `http://localhost:5173`

---

## 📡 Key Endpoints & Architecture

| Component | Port / Route | Description |
| :--- | :--- | :--- |
| **Frontend Web App** | `http://localhost:5173` | React 19 + Vite dashboard with real-time charts & QR scanner |
| **Backend REST API** | `http://localhost:5000/api` | Express.js API handling authentication, batches, and predictions |
| **Health Check** | `http://localhost:5000/api/health` | Server uptime and status check |
| **Telemetry Ingestion**| `POST /api/sensors/reading` | Ingestion endpoint for ESP32 / IoT device sensor streams |
| **Spoilage AI Predict**| `POST /api/predictions/evaluate` | Spoilage risk index based on temperature, pH, and TDS |

---

## 📦 Tech Stack

- **Frontend**: React 19, Vite, Lucide Icons, Vanilla CSS Design System with Glassmorphism
- **Backend**: Node.js, Express.js, JWT, bcryptjs, PDFKit (for cold-chain compliance reports)
- **Data Layer**: High-performance in-memory repository (Firestore/Firebase ready)
