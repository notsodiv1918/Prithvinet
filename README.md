# PrithviNet 🌿
### Smart Environmental Monitoring & Compliance Platform
**Maharashtra State Pollution Control Board**

---

## Overview

PrithviNet is a real-time environmental monitoring and compliance platform built for the Maharashtra State Pollution Control Board. It monitors Air Quality (AQI), Water Quality, and Noise Pollution across 10 monitoring stations in Maharashtra, enabling automated compliance tracking, alerts, and predictive analytics.

Built for the **E-Cell Hackathon — Web 2 Problem Statement 1**.

---

## Features

| Feature | Description |
|---|---|
| Real-time Dashboard | Live AQI, SO₂, NO₂, PM2.5 readings updating every 5 seconds |
| Geo Pollution Heatmap | Interactive Leaflet map with color-coded station markers |
| Alerts & Compliance | Automated breach detection, escalation workflow, missing report tracker |
| Reports Portal | Industry monitoring reports with compliance rate analytics |
| 72-hr Forecast | AQI prediction with confidence interval visualization |
| Industry Submit Portal | Industry users submit daily emissions readings |
| Citizen Portal | Public-facing AQI dashboard with health advisories |
| Role-based Auth | Super Admin, Regional Officer, Industry User, Citizen |

---

## Demo Accounts

| Role | Email | Password |
|---|---|---|
| Super Admin | admin@prithvinet.gov.in | admin123 |
| Regional Officer | ro@prithvinet.gov.in | ro123 |
| Industry User | industry@bharatsteel.in | industry123 |
| Citizen | citizen@gmail.com | citizen123 |

---

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Custom CSS
- **Charts:** Recharts
- **Maps:** React-Leaflet + Leaflet.js
- **Notifications:** React Hot Toast
- **Data:** Hardcoded mock data (no database required)

---

## Getting Started

### Prerequisites
- Node.js v18 or above
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/prithvinet.git
cd prithvinet

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

---

## Project Structure

```
prithvinet/
├── app/
│   ├── page.tsx              # Login page
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # Global styles & design system
│   ├── dashboard/page.tsx    # Main monitoring dashboard
│   ├── map/page.tsx          # Geo pollution heatmap
│   ├── alerts/page.tsx       # Alerts & compliance
│   ├── reports/page.tsx      # Reports management
│   ├── forecast/page.tsx     # 72-hr AQI forecast
│   ├── submit/page.tsx       # Industry data submission
│   └── public/page.tsx       # Citizen portal
├── components/
│   ├── Sidebar.tsx           # Navigation sidebar
│   └── TopBar.tsx            # Page header with live clock
├── data/
│   └── mockData.ts           # All mock data (stations, industries, reports)
├── lib/
│   └── auth.ts               # Auth helper functions
└── public/                   # Static assets
```

---

## Monitoring Stations

10 CAAQMS stations across Maharashtra:
Mumbai (Andheri, Bandra), Pune, Nagpur, Nashik, Aurangabad, Thane, Kolhapur, Solapur, Navi Mumbai

## Industries Monitored

- **Bharat Steel Works** (Nagpur) — Chronic SO₂ violator
- **Maharashtra Textiles Ltd** (Pune) — Minor NO₂ exceedance
- **Pune Chemicals Co.** (Pune) — Compliant

## Prescribed Limits

| Parameter | Limit | Unit |
|---|---|---|
| SO₂ | 80 | ppm |
| NO₂ | 60 | ppm |
| PM2.5 | 60 | µg/m³ |
| Noise (Day) | 55 | dB(A) |
| Noise (Night) | 45 | dB(A) |

---

## Innovation Features (PS Requirement)

1. **Geo-spatial pollution heatmap** — React-Leaflet with live color-coded markers
2. **AI-ready forecast** — 72-hr AQI prediction with confidence intervals
3. **Compliance copilot** — Automated breach detection and escalation workflow
4. **Citizen transparency portal** — Public AQI dashboard at `/public`
5. **Role-based access** — 4 distinct user roles with different views

---

## Sample Demo Flow (Hackathon)

1. Login as **Regional Officer** → See 3 active breaches on dashboard
2. Go to **Pollution Map** → Nagpur station glows red
3. Go to **Alerts** → Bharat Steel breaching SO₂ at 142 ppm → Click Escalate
4. Go to **Forecast** → 72-hr AQI prediction with confidence band
5. Go to **Reports** → 67% compliance rate across industries

---

## License

Built for educational/hackathon purposes.
Maharashtra State Pollution Control Board · PrithviNet © 2024
