# Eventora — Event Management Platform

A full-stack event management web application built with React, Node.js, and MySQL.

---

## Tech Stack

- **Frontend:** React 18, Vite, React Router
- **Backend:** Node.js, Express.js, MySQL2, JWT
- **Database:** MySQL 8

---

## Setup

### 1. Clone the repo

```bash
git clone https://github.com/Sridhar84533/eventora.git
cd eventora
```

### 2. Database

```bash
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed.sql
```

### 3. Backend

```bash
cd backend
npm install
cp .env.example .env   # fill in your DB credentials
npm start              # runs on http://localhost:5000
```

### 4. Frontend

```bash
cd frontend
npm install
npm run dev            # runs on http://localhost:5173
```

---

## Default Login Credentials

| Role      | Email                   | Password |
|-----------|-------------------------|----------|
| Admin     | admin@eventora.com      | admin123 |
| Organizer | organizer@eventora.com  | org123   |
| User      | user@eventora.com       | user123  |
