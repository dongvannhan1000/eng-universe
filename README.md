# EngUniverse 📚

A modern vocabulary learning application built with a spaced repetition system (SRS) to help users master new words effectively.

## 🌟 Overview

**EngUniverse** is a full-stack web application designed to enhance vocabulary acquisition through scientifically-backed spaced repetition techniques. The app helps users:

- **Capture and organize vocabulary** with Vietnamese meanings, English explanations, and custom tags
- **Review words intelligently** using an SRS algorithm that schedules reviews at optimal intervals
- **Track learning progress** with detailed review history and statistics
- **Explore public decks** curated vocabulary collections for topics like IELTS, environment, education, and more
- **Manage learning** with features to suspend, edit, or delete vocabulary items

### Key Features

✨ **Smart Review System**: SRS algorithm adapts to your learning pace  
🎯 **Custom Tags & Organization**: Organize vocabulary by topics, difficulty, or custom categories  
📊 **Progress Tracking**: Monitor your learning journey with review statistics  
📚 **Public Decks**: Access pre-built vocabulary collections for various topics  
🔐 **User Authentication**: Secure JWT-based authentication with cookie support  
🎨 **Modern UI**: Built with React, Redux, and Tailwind CSS for a smooth user experience

Link to the live demo: https://enguniverse.onrender.com/

### Tech Stack

**Frontend:**

- React 19 + TypeScript
- Redux Toolkit (state management)
- TanStack Query (server state)
- React Router (routing)
- Tailwind CSS + Radix UI (styling)
- Vite (build tool)

**Backend:**

- NestJS (Node.js framework)
- Prisma ORM
- PostgreSQL (database)
- Passport.js + JWT (authentication)
- Swagger (API documentation)

**Monorepo:**

- Turborepo (task orchestration)
- npm workspaces

---

## 🚀 Getting Started (Local Development)

### Prerequisites

Ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (v10 or higher) - comes with Node.js
- **PostgreSQL** (v14 or higher) - [Download](https://www.postgresql.org/download/)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd eng-universe
```

### 2. Install Dependencies

Install all dependencies for the monorepo:

```bash
npm install
```

### 3. Set Up the Database

#### Create PostgreSQL Database

Create a new PostgreSQL database:

```bash
psql -U postgres
CREATE DATABASE eng_universe;
\q
```

#### Configure Environment Variables

Create a `.env` file in the `apps/backend` directory:

```bash
cd apps/backend
touch .env  # or 'type nul > .env' on Windows
```

Add the following configuration to `apps/backend/.env`:

```env
# Database
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/eng_universe"

# Server
PORT=3001

# CORS (frontend URL)
FRONTEND_URL="http://localhost:5173"
```

> **Note:** Replace `your_password` with your PostgreSQL password.

#### Run Database Migrations

Navigate to the backend directory and run Prisma migrations:

```bash
cd apps/backend
npm run prisma:generate
npm run migrate
```

#### Seed the Database (Optional)

Populate the database with sample data:

```bash
npm run seed
```

or

```bash
npx tsx prisma/seed.ts
```

This creates:

- Sample vocabulary items
- Public decks with curated vocabulary

### 4. Start the Development Servers

Return to the project root and start both frontend and backend:

```bash
cd ../..
npm run dev
```

Or start them individually:

```bash
# Start backend only (from project root)
npm run dev:backend

# Start frontend only (from project root)
npm run dev:frontend
```

### 5. Access the Application

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:3001](http://localhost:3001)
- **API Documentation (Swagger)**: [http://localhost:3001/api](http://localhost:3001/api)
- **Prisma Studio** (Database GUI): Run `npm run prisma:studio` in `apps/backend`

---

## 📦 Project Structure

```
learning-lab/
├── apps/
│   ├── backend/          # NestJS backend application
│   │   ├── prisma/       # Database schema & migrations
│   │   └── src/          # Backend source code
│   └── frontend/         # React frontend application
│       └── src/          # Frontend source code
├── packages/             # Shared packages
│   ├── eslint-config/    # Shared ESLint configuration
│   ├── types/            # Shared TypeScript types
│   └── utils/            # Shared utilities
├── turbo.json            # Turborepo configuration
└── package.json          # Root package.json
```

---

## 🛠️ Available Scripts

### Root Level (Monorepo)

```bash
npm run dev              # Start both frontend & backend in dev mode
npm run dev:frontend     # Start frontend only
npm run dev:backend      # Start backend only
npm run build            # Build all apps
npm run lint             # Lint all apps
npm run test             # Run tests for all apps
npm run format           # Format code with Prettier
```

### Backend (`apps/backend`)

```bash
npm run dev              # Start backend in watch mode
npm run build            # Build backend for production
npm run start:prod       # Run production build
npm run migrate          # Run database migrations
npm run seed             # Seed database with sample data
npm run prisma:studio    # Open Prisma Studio (DB GUI)
npm run test             # Run unit tests
npm run test:e2e         # Run end-to-end tests
```

### Frontend (`apps/frontend`)

```bash
npm run dev              # Start frontend dev server
npm run build            # Build frontend for production
npm run preview          # Preview production build
npm run lint             # Lint frontend code
```

---

## 📚 API Documentation

Once the backend is running, visit [http://localhost:3001/api](http://localhost:3001/api) to explore the interactive Swagger API documentation.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 🐛 Troubleshooting

### Database Connection Issues

- Verify PostgreSQL is running: `psql -U postgres -c "SELECT version();"`
- Check your `DATABASE_URL` in `apps/backend/.env`
- Ensure the database exists: `psql -U postgres -l`

### Port Already in Use

- Backend (3001): Change `PORT` in `apps/backend/.env`
- Frontend (5173): Vite will automatically try the next available port

### Migration Errors

- Reset the database: `cd apps/backend && npm run db:reset`
- Regenerate Prisma Client: `npm run prisma:generate`

---

Happy learning! 🎓✨
