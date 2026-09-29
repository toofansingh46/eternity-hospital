# Eternity — Your IT Healthcare Partner

A MERN-stack hospital management system demo. Developed by Toofan Singh.

This is a scoped, fully-working core rather than every module from a full hospital suite:
**Landing page → Login → Dashboard → Patients (register / list / profile) → Doctors → Appointments → Billing**,
all wired to a real Express + MongoDB backend with realistic seed data.

## Stack

- **Client:** React 18, Vite, React Router, Tailwind CSS, Framer Motion, Recharts, Axios, Lucide icons
- **Server:** Node.js, Express, MongoDB, Mongoose, JWT auth

## Project structure

```
eternity-hospital/
├── client/     # React frontend (Vite)
└── server/     # Express API + MongoDB models
```

## 1. Prerequisites

- Node.js 18+
- A MongoDB connection (local `mongod`, or a free MongoDB Atlas cluster)

## 2. Backend setup

```bash
cd server
cp .env.example .env
# edit .env: set MONGO_URI to your MongoDB connection string, and set a real JWT_SECRET
npm install
npm run seed     # populates demo doctors, patients, appointments, invoices, and 2 staff logins
npm run dev      # starts the API on http://localhost:5000
```

Demo logins created by the seed script:
- **Administrator:** admin@eternity.com / admin123
- **Receptionist:** reception@eternity.com / reception123

## 3. Frontend setup

In a second terminal:

```bash
cd client
npm install
npm run dev      # starts the app on http://localhost:5173
```

Open `http://localhost:5173` in your browser. The landing page links to the login screen; sign in with
either demo account above to reach the dashboard.

## 4. What's wired end-to-end

- **Auth:** JWT login, protected routes, session-expiry redirect.
- **Registration → Patients → Profile:** registering a patient generates a patient ID and immediately
  shows up in the patient list and searchable table; opening a profile shows real appointments and
  invoices for that patient.
- **Appointments:** booking from the Patients list or Patient profile pre-fills the patient; new
  appointments appear immediately in the appointments table and on that patient's profile.
- **Billing:** invoices calculate subtotal/discount/tax/total live, save to the patient's record, and
  update the dashboard revenue and pending-bill stats.
- **Dashboard:** stats and charts are pulled from the live database (patient count, today's
  appointments, available doctors, revenue, pending bills, department distribution).

## 5. Extending it

The architecture (Mongoose models → controllers → routes on the server; services → pages → reusable
components on the client) is set up so additional modules — Pharmacy, Laboratory, IPD/Bed Management,
Staff, Departments, Reports, etc. — can be added following the same pattern as Patients/Appointments/
Billing without restructuring anything already built.

 ## Live Demo **Website:** https://eternity-hospital.vercel.app **Demo login:** admin@eternity.com / admin123