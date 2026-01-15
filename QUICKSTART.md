# Quick Start Guide

This is a streamlined guide to get the Medium Clone running as fast as possible.

## Prerequisites
- Node.js (v16+) installed
- MongoDB installed locally OR MongoDB Atlas account

## 5-Minute Setup

### 1. Install Dependencies
```bash
# In the root directory
cd d:\Medium

# Install both backend and frontend dependencies
npm run install:all
```

Or install separately:
```bash
npm run install:backend
npm run install:frontend
```

### 2. Configure MongoDB

**Option A - Local MongoDB:**
- The `.env` file is already configured for local MongoDB
- Just make sure MongoDB is running on your machine

**Option B - MongoDB Atlas (Cloud):**
```bash
# Edit backend/.env file
# Replace MONGODB_URI with your Atlas connection string
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/medium-clone
```

### 3. Seed Sample Data (Optional)
```bash
cd backend
npm run seed
```

This creates:
- 3 sample users
- 6 sample articles
- Test login: `john@example.com` / `password123`

### 4. Start Development Servers

**Terminal 1 - Backend:**
```bash
npm run dev:backend
```
Wait for: `MongoDB Connected` and `Server running on port 5000`

**Terminal 2 - Frontend:**
```bash
npm run dev:frontend
```
Wait for: `Local: http://localhost:5173/`

### 5. Open Application
Visit: **http://localhost:5173**

## Quick Test

1. Click **"Get Started"**
2. Sign up with any email/username/password
3. Click **"Write"** to create an article
4. View your article in the feed

## Useful Commands

```bash
# Run backend only
npm run dev:backend

# Run frontend only
npm run dev:frontend

# Seed database with sample data
cd backend && npm run seed

# Build frontend for production
npm run build:frontend
```

## Test Credentials (if you ran seed script)

| Email | Password | Username |
|-------|----------|----------|
| john@example.com | password123 | johndoe |
| jane@example.com | password123 | janedoe |
| alex@example.com | password123 | alexsmith |

## Troubleshooting

**Can't connect to MongoDB?**
- Make sure MongoDB is running locally, OR
- Check your Atlas connection string in `backend/.env`

**Port already in use?**
- Change `PORT` in `backend/.env`
- Default ports: Backend 5000, Frontend 5173

**Dependencies not installing?**
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

## API Endpoints

**Authentication:**
- `POST /api/auth/signup` - Register
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

**Articles:**
- `GET /api/articles` - Get all articles
- `GET /api/articles/:id` - Get single article
- `POST /api/articles` - Create article (auth required)
- `PUT /api/articles/:id` - Update article (author only)
- `DELETE /api/articles/:id` - Delete article (author only)

**Users:**
- `GET /api/users/:username` - Get user profile

## Project Structure

```
Medium/
├── backend/        → Express API (port 5000)
├── frontend/       → React App (port 5173)
└── README.md       → Full documentation
```
