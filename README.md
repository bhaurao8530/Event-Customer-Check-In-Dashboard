# Event-Customer-Check-In-Dashboard

A React + Vite dashboard for managing event customers, QR check-ins, booth assignments, and customer status updates.

## Live Demo

- Demo: https://event-customer-checkin-dashboard.netlify.app/login

## GitHub Repository
- Repository: https://github.com/bhaurao8530/Event-Customer-Check-In-Dashboard

## Features
- Login with protected routes
- Dashboard summary cards and chart
- Customer CRUD with search and filtering
- QR scan and manual entry for check-in
- Booth assignment workflow
- Customer status updates and history
- Toast notifications and responsive layout
- Mock API layer with local storage persistence

## Tech Stack
- React
- Vite
- React Router
- Redux Toolkit
- Axios
- Recharts
- html5-qrcode
- react-toastify
- react-hook-form

## Project Structure
- `src/api` : API services and mock backend helpers
- `src/components` : Reusable UI components
- `src/features` : Login, dashboard, customers, QR scanner, booth assignment, and status modules
- `src/routes` : Protected routing setup
- `src/store` : Redux store and slices
- `src/utils` : Validation helpers

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

## Demo Credentials

- Email: admin@example.com
- Password: 123456

## Environment Variables

```bash
VITE_API_BASE_URL=http://localhost:5000/api
VITE_USE_MOCK_API=true
```

## Build

```bash
npm run build
```