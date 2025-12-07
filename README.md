# KostPay - Boarding House Management System

Sistem manajemen kos yang dibangun dengan React.js dan Node.js/Express.js.

## Prerequisites

- Node.js (v16 atau lebih tinggi)
- MySQL Database
- npm atau yarn

## Setup Instructions

### 1. Clone Repository

```bash
git clone <repository-url>
cd kostPay
```

### 2. Backend Setup

```bash
cd backend
npm install
```

**Configure Environment Variables:**

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and update with your credentials:
   ```env
   DATABASE_URL="mysql://user:password@localhost:3306/kostpakle_db"
   JWT_SECRET="your-secret-key-here"
   PORT=5001
   ```

**Initialize Database:**

1. Import database schema:
   ```bash
   # Lihat file backend/SETUP_DATABASE.md untuk instruksi lengkap
   mysql -h 127.0.0.1 -P 3308 -u root -p kostpakle_db < backend/kostpakle_db.sql
   ```

2. Generate Prisma Client:
   ```bash
   npx prisma generate
   ```

**Start Backend Server:**

```bash
npm start
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

**Configure Environment Variables:**

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` if needed (default should work for local development):
   ```env
   VITE_API_URL=http://localhost:5001/api
   ```

**Start Frontend Development Server:**

```bash
npm run dev
```

## Security Notes

⚠️ **IMPORTANT**: Never commit the following files:
- `.env` files (contain sensitive credentials)
- `node_modules/` directory

These files are protected by `.gitignore`. Always use `.env.example` as a template when setting up a new environment.

## Tech Stack

### Frontend
- React.js 18+
- Vite
- Tailwind CSS

### Backend
- Node.js
- Express.js
- Prisma ORM
- MySQL Database
- JWT Authentication

## Project Structure

```
kostPay/
├── backend/
│   ├── controllers/      # API route handlers
│   ├── middleware/       # Express middleware
│   ├── prisma/          # Database schema & migrations
│   ├── kostpakle_db.sql  # Database SQL file
│   ├── SETUP_DATABASE.md # Database setup instructions
│   ├── .env.example     # Environment template
│   └── server.js        # Express server entry point
│
└── frontend/
    ├── src/             # React components & pages
    ├── .env.example     # Environment template
    └── ...
```

## License

[Your License Here]
