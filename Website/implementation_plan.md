# Implementation Plan - DairyGuard Full-Stack IoT Milk Monitoring Platform

DairyGuard is an IoT-based platform designed for dairy owners, cooperatives, and cold-chain logistics managers to monitor milk quality and predict spoilage risk during transportation in real time.

This plan details the complete folder structure, frontend UI components, backend services, API contracts, prediction algorithms, and database-ready architecture for DairyGuard without connecting Firebase yet.

---

## Complete Project Folder Structure

```
DairyGuard/
├── frontend/
│   ├── public/
│   │   ├── favicon.ico
│   │   └── dairyguard-logo.svg
│   ├── src/
│   │   ├── assets/
│   │   │   └── icons/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   ├── Header.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── AlertBanner.jsx
│   │   │   │   └── EmptyState.jsx
│   │   │   ├── dashboard/
│   │   │   │   ├── MetricCard.jsx
│   │   │   │   ├── SensorStatusBadge.jsx
│   │   │   │   └── RecentAlertsList.jsx
│   │   │   ├── qr/
│   │   │   │   ├── QRScannerModal.jsx
│   │   │   │   └── QRBatchViewer.jsx
│   │   │   └── charts/
│   │   │       ├── RealtimeLineChart.jsx
│   │   │       └── SpoilageRiskGauge.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Subscription.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── dashboard/
│   │   │   │   ├── Overview.jsx
│   │   │   │   ├── Vehicles.jsx
│   │   │   │   ├── Batches.jsx
│   │   │   │   ├── Prediction.jsx
│   │   │   │   ├── Analytics.jsx
│   │   │   │   ├── Reports.jsx
│   │   │   │   └── Settings.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── config/
│   │   │   └── subscriptionPlans.js
│   │   ├── styles/
│   │   │   ├── design-tokens.css
│   │   │   ├── main.css
│   │   │   ├── components.css
│   │   │   └── dashboard.css
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.html
│   ├── .env.example
│   ├── .env
│   ├── package.json
│   └── vite.config.js
│
└── backend/
    ├── config/
    │   ├── default.js
    │   ├── pricing.config.js
    │   └── sensorThresholds.js
    ├── controllers/
    │   ├── authController.js
    │   ├── userController.js
    │   ├── subscriptionController.js
    │   ├── vehicleController.js
    │   ├── batchController.js
    │   ├── sensorController.js
    │   ├── predictionController.js
    │   ├── analyticsController.js
    │   └── reportController.js
    ├── routes/
    │   ├── authRoutes.js
    │   ├── userRoutes.js
    │   ├── subscriptionRoutes.js
    │   ├── vehicleRoutes.js
    │   ├── batchRoutes.js
    │   ├── sensorRoutes.js
    │   ├── predictionRoutes.js
    │   ├── analyticsRoutes.js
    │   ├── reportRoutes.js
    │   └── index.js
    ├── middleware/
    │   ├── authMiddleware.js
    │   ├── validationMiddleware.js
    │   └── errorMiddleware.js
    ├── services/
    │   ├── authService.js
    │   ├── userService.js
    │   ├── subscriptionService.js
    │   ├── vehicleService.js
    │   ├── batchService.js
    │   ├── sensorService.js
    │   ├── predictionService.js
    │   ├── analyticsService.js
    │   └── reportService.js
    ├── models/
    │   ├── User.js
    │   ├── DairyProfile.js
    │   ├── Vehicle.js
    │   ├── Batch.js
    │   ├── SensorReading.js
    │   └── Subscription.js
    ├── repositories/
    │   ├── inMemoryStore.js
    │   └── repositoryInterface.js
    ├── utils/
    │   ├── jwtUtils.js
    │   ├── passwordUtils.js
    │   ├── responseHandler.js
    │   └── pdfGenerator.js
    ├── app.js
    ├── server.js
    ├── .env.example
    ├── .env
    └── package.json
```

---

## User Review Required

> [!IMPORTANT]
> **No External Database / Firebase Yet**: Per your instructions, Firebase is NOT connected and no Firebase credentials/instructions are provided in this phase.
> The backend uses an in-memory repository architecture with a defined interface (`repositoryInterface.js`). When you later ask to connect Firebase/Firestore, we will simply drop in the Firebase repository adapter without having to rewrite any controllers or routes!

> [!NOTE]
> **Sensor Empty State Rule**: As required, when there are no sensor readings received yet from an ESP32, the dashboard will display `"No sensor data available."` instead of fake or randomized numbers.

---

## Proposed Technical Implementation

### 1. Frontend Details

- **Tech Stack**: React 18 / 19 + Vite + Vanilla CSS (Design Tokens & Glassmorphism).
- **Theme & Aesthetics**:
  - Dark modern UI: `#0A0F1D` (deep base), `#111C33` (surface), `#172544` (elevated cards).
  - Accents: Neon Emerald (`#10B981` / `#34D399`) for fresh milk & safety, Cyan (`#06B6D4`) for cold-chain IoT telemetry, Amber (`#F59E0B`) for warning, Crimson (`#EF4444`) for spoilage alert.
  - Glassmorphic panels with subtle frosted borders (`rgba(255, 255, 255, 0.08)`), glow badges, sleek cards.
  - Typography: Google Fonts (`Outfit` + `Inter`).
- **Pages**:
  1. **Home Page**: Hero section ("Monitor Milk. Prevent Spoilage."), interactive live cold-chain demo simulator showcase, feature cards (Milk Spoilage Prediction, Milk Quality Monitoring, Real-Time Sensor Monitoring, Transport Monitoring, Reports and Analytics), CTA buttons.
  2. **Login Page**: Clean dark card, Email, Password, remember me, forgot password modal, connected to `POST /api/auth/login`.
  3. **Signup Page**: Full Name, Email, Password, Confirm Password, Dairy Name / Cooperative Name, Phone Number, Location, connected to `POST /api/auth/signup`.
  4. **Subscription Page**: Three plans (Spoilage Guard, Quality Guard, DairyGuard Complete) configured in `subscriptionPlans.js`, displaying device cost + monthly cost, feature comparisons, and plan selection.
  5. **Dashboard Layout**: Left responsive sidebar with active navigation, user badge, cooperative name, "Back to Home", and "Logout".
     - **Overview Page**: Real-time sensor metrics (Temperature, pH, TDS/EC, Spoilage Risk, Milk Status, Device Status, Last Updated). Proper `"No sensor data available."` empty state when no readings exist.
     - **Transport / Vehicles Page**: Add vehicle modal, vehicle listing, status badges, assign batch to vehicle, view live route status.
     - **Milk Batches Page**: Create batch modal, batch cards/table, status update, QR code camera scan & QR image file upload preview.
     - **Prediction Page**: Input parameters or pull latest batch telemetry (Temp, pH, TDS, Transport Duration); displays calculated Spoilage Risk (Low / Medium / High), Confidence %, and risk factors breakdown.
     - **Analytics Page**: Canvas/SVG time-series charts for Temperature, pH, TDS, and Spoilage Risk over time; filters for Today, 7 Days, 30 Days, Custom Range, Vehicle, and Batch; empty state when no data exists.
     - **Milk Reports Page**: Batch selector, date range picker, report preview table, Download PDF button calling backend PDF generator.
     - **Settings Page**: Profile details, Dairy cooperative information, Subscription details, notification toggles, and secure logout.

### 2. Backend Details

- **Tech Stack**: Node.js + Express.js + CORS + bcryptjs + jsonwebtoken + pdfkit.
- **Security**: Passwords hashed with `bcryptjs` (salt rounds: 10). JWT tokens with expiration. Bearer auth middleware.
- **REST Endpoints**:
  - `POST /api/auth/signup`, `POST /api/auth/login`, `POST /api/auth/logout`, `POST /api/auth/forgot-password`, `POST /api/auth/reset-password`
  - `GET /api/user/profile`, `PUT /api/user/profile`, `GET /api/user/dairy`, `PUT /api/user/dairy`
  - `GET /api/subscriptions/plans`, `POST /api/subscriptions/select`, `GET /api/subscriptions/current`
  - `GET /api/vehicles`, `POST /api/vehicles`, `GET /api/vehicles/:id`, `PUT /api/vehicles/:id`, `DELETE /api/vehicles/:id`
  - `GET /api/batches`, `POST /api/batches`, `GET /api/batches/:id`, `PUT /api/batches/:id`, `DELETE /api/batches/:id`
  - `POST /api/sensors/reading` (ready for ESP32 ingestion: `{ temperature, ph, tds, timestamp, batchId, vehicleId, deviceId }`), `GET /api/sensors/latest`, `GET /api/sensors/history`
  - `POST /api/prediction/evaluate` (accepts `{ temperature, ph, tds, storageDuration }`, calculates risk deterministically using food safety science criteria)
  - `GET /api/analytics/history`, `GET /api/analytics/summary`
  - `POST /api/reports/generate`, `GET /api/reports/:id/pdf` (streams generated PDF file)
- **Deterministic Spoilage Prediction Service**:
  - Milk fresh baseline: pH 6.5–6.7, Temp 1–4°C, TDS 1100–1300 ppm.
  - Temperature Abuse Penalty: $\Delta T = \max(0, T - 4.0)$, weighted with duration ($t_{hours}$).
  - pH Acidification Penalty: $|pH - 6.6| \times W_{pH}$ (drops as lactic acid bacteria multiply).
  - TDS Deviation Penalty: $|TDS - 1200| \times W_{tds}$ (adulteration or electrolyte change).
  - Risk Level classification:
    - Index < 30: **Low Risk**
    - Index 30–65: **Medium Risk**
    - Index > 65: **High Risk**
  - High confidence metric calculated based on proximity of sensor values to calibration ranges.
- **PDF Generation**:
  - Implemented with pure Node `pdfkit` generating official DairyGuard Quality & Spoilage Certificates with dairy cooperative header, batch details, sensor telemetry summary, and safety verification badge.

---

## Verification Plan

### Automated / Server Tests:
1. Start backend server: `npm run dev` in `DairyGuard/backend` (port 5000).
2. Verify endpoints via curl/health checks:
   - `GET /api/health` -> 200 OK
   - `POST /api/auth/signup` and `POST /api/auth/login`
   - `POST /api/prediction/evaluate` with low, medium, and high temperature/pH inputs
   - `GET /api/reports/sample/pdf` -> Content-Type `application/pdf`
   - `POST /api/sensors/reading` -> verify ingestion and retrieval in `GET /api/sensors/latest`
3. Start frontend dev server: `npm run dev` in `DairyGuard/frontend` (port 5173).
4. Verify Vite build: `npm run build` in `DairyGuard/frontend`.

### Manual / Browser Verification:
1. Open DairyGuard in browser via browser tool.
2. Verify Home page aesthetics, navigation, animations, and typography.
3. Test signup form -> creates user, logs in, stores token, redirects to dashboard.
4. Test Dashboard Overview with no data -> confirms `"No sensor data available."` message.
5. Add a vehicle and a milk batch -> verify real-time status update.
6. Test Spoilage Prediction tool -> input test values (e.g. 12°C, pH 6.1, 8 hours) -> verify High Risk prediction response.
7. Test Report generation and PDF download.
8. Test QR scanner interface and file upload reader.
