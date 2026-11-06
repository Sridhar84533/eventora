# 🎪 Eventora — Event Management Platform

> A full-stack event management web application where users can browse, book, and manage events. Organizers can create and manage their own events, while admins oversee the entire platform.

---

## 🖼️ Preview

![Eventora Browse Events](https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1200&q=80)

---

## ✨ Features

### 👤 User
- Browse & search published events with filters (category, city, price range)
- Book tickets and receive booking confirmations
- View booking history and manage profile
- Save favourite events

### 🗂️ Organizer
- Create and manage events (with banner image upload)
- Track ticket sales and revenue
- Manage event staff

### 🔐 Admin
- Approve / reject organizer event submissions
- Manage users, organizers, venues, and categories
- Platform-wide analytics dashboard

---

## 🛠️ Tech Stack

| Layer       | Technology                                      |
|-------------|-------------------------------------------------|
| **Frontend** | React 18, Vite, React Router, Recharts         |
| **Backend**  | Node.js, Express.js, MySQL2, JWT, Multer       |
| **Database** | MySQL 8 — with Views, Stored Procedures & Triggers |
| **Auth**     | JWT (JSON Web Tokens) + bcryptjs               |

---

## 📁 Project Structure

```
eventora/
├── backend/                # Express.js API server
│   ├── config/             # DB connection
│   ├── controllers/        # Route handler logic
│   ├── middleware/         # Auth & file upload middleware
│   ├── routes/             # API route definitions
│   ├── scripts/            # DB setup & seed scripts
│   ├── uploads/            # Uploaded event banners
│   ├── server.js           # Entry point
│   ├── .env.example        # Environment variables template
│   └── package.json
│
├── frontend/               # React + Vite frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page-level components
│   │   ├── context/        # React context (Auth, etc.)
│   │   ├── services/       # Axios API service layer
│   │   └── theme/          # MUI theme config
│   ├── index.html
│   └── package.json
│
└── database/
    ├── schema.sql          # Full DB schema
    └── seed.sql            # Sample seed data
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+
- **MySQL** 8.0+
- **npm** or **yarn**

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/eventora.git
cd eventora
```

---

### 2️⃣ Database Setup

```bash
# Log into MySQL and run the schema
mysql -u root -p < database/schema.sql

# (Optional) Load sample seed data
mysql -u root -p < database/seed.sql
```

---

### 3️⃣ Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy the env template and fill in your values
cp .env.example .env
```

Edit `backend/.env`:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=event_management
DB_PORT=3306
JWT_SECRET=your_super_secret_jwt_key_here
```

```bash
# Start the backend server
npm start
```

The API will be running at `http://localhost:5000`

---

### 4️⃣ Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The frontend will be at `http://localhost:5173`

---

## 🔑 Default Credentials (Seed Data)

| Role      | Email                       | Password   |
|-----------|-----------------------------|------------|
| Admin     | admin@eventora.com          | admin123   |
| Organizer | organizer@eventora.com      | org123     |
| User      | user@eventora.com           | user123    |

---

## 📡 API Overview

| Method | Endpoint                         | Description               | Auth Required |
|--------|----------------------------------|---------------------------|---------------|
| POST   | `/api/auth/login`                | Login                     | No            |
| POST   | `/api/auth/register`             | Register                  | No            |
| GET    | `/api/events`                    | List all published events | No            |
| GET    | `/api/events/:id`                | Get event details         | No            |
| POST   | `/api/organizer/events`          | Create event              | Organizer     |
| GET    | `/api/admin/events`              | All events (admin view)   | Admin         |
| POST   | `/api/bookings`                  | Book tickets              | User          |
| GET    | `/api/users/bookings`            | My bookings               | User          |

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first.

---

## 📄 License

This project is for educational purposes.
