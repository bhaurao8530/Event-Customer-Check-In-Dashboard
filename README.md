# Event Check-In Dashboard

A React + Vite dashboard for managing event customers, QR check-ins, booth assignments, and customer status updates.

## Features
- Login with protected routes
- Dashboard summary cards and chart
- Customer CRUD with search and filtering
- QR scan and manual entry for check-in
- Booth assignment workflow
- Customer status updates and history
- Toast notifications and responsive layout
- Mock API layer with local storage persistence for demo and assignment use

## Tech stack
- React
- React Router
- Redux Toolkit
- Axios
- Recharts
- html5-qrcode
- react-toastify
- react-hook-form

## Project structure
- src/api: API services and mock backend helpers
- src/components: reusable UI components
- src/features: login, dashboard, customers, QR scanner, booth assignment, and status modules
- src/routes: protected routing setup
- src/store: Redux store and slices
- src/utils: validation helpers

## Getting started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open the app in your browser.

## Demo credentials
- Email: admin@example.com
- Password: 123456

## Backend integration note
The app is wired to use a real API base URL through VITE_API_BASE_URL when available. If you want to use the built-in demo data instead, keep VITE_USE_MOCK_API enabled or leave it unset.

Example:
```bash
VITE_API_BASE_URL=http://localhost:5000/api
VITE_USE_MOCK_API=true
```

## Build
```bash
npm run build
```

