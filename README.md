# Medium Clone

A full-stack blogging platform built with the MERN stack, allowing users to create, edit, and publish articles with authentication.

## Overview

This project demonstrates a complete full-stack application with proper authentication, database integration, and a clean separation between frontend and backend. Users can register accounts, log in, and manage their own articles while browsing content from other authors.

## Features

- User authentication with JWT tokens
- Create, edit, and delete articles
- Public article feed accessible to all visitors
- Author-based article management
- Protected routes for authenticated actions
- Clean MVC architecture with service layer

## Tech Stack

**Frontend:** React (Vite), React Router, Context API, Axios  
**Backend:** Node.js, Express, MongoDB, Mongoose, JWT, bcrypt

## Getting Started

### Backend Setup

1. Navigate to backend directory and install dependencies:
```bash
cd backend
npm install
```

2. Create a `.env` file:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

3. Start the server:
```bash
npm start
```

Backend runs at `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory and install dependencies:
```bash
cd frontend
npm install
```

2. Start the development server:
```bash
npm run dev
```

Frontend runs at `http://localhost:5173`

## API Documentation

### Base URL
```
http://localhost:5000
```

### Authentication Endpoints

#### Sign Up
**POST** `/api/auth/signup`

**Request Body:**
```json
{
  "username": "abdul",
  "email": "abdul@example.com",
  "password": "Password123"
}
```

---

#### Login
**POST** `/api/auth/login`

**Request Body:**
```json
{
  "email": "abdul@example.com",
  "password": "Password123"
}
```

**Response:**
```json
{
  "accessToken": "jwt_access_token"
}
```

---

### Article Endpoints

#### Create Article (Protected)
**POST** `/api/articles`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "title": "My First Article",
  "content": "This is my article content"
}
```

---

#### Get All Articles
**GET** `/api/articles`

Public endpoint - no authentication required.

---

#### Get Single Article
**GET** `/api/articles/:id`

**Example:**
```
/api/articles/64f1c2a9e3b21c00123abcd9
```

---

#### Update Article (Protected)
**PUT** `/api/articles/:id`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "title": "Updated Title",
  "content": "Updated content"
}
```

---

#### Delete Article (Protected)
**DELETE** `/api/articles/:id`

**Headers:**
```
Authorization: Bearer <access_token>
```

---

### User Endpoints

#### Get User Profile
**GET** `/api/users/:username`

**Example:**
```
/api/users/abdul
```

---

## Key Implementation Details

- **Authentication:** JWT-based session management with secure token handling
- **Authorization:** Only article authors can edit or delete their own content
- **Security:** Passwords hashed with bcrypt before storage
- **Architecture:** Request flow follows Routes → Controllers → Services → Models pattern
- **Public Access:** Articles can be read by anyone, authentication required only for write operations

## What I Learned

- Full-stack MERN application development and integration
- Implementing secure JWT authentication flow
- Designing and building RESTful APIs
- Clean backend architecture with separation of concerns
- Managing application state with React Context API

## Future Enhancements

- [ ] Comment system for articles
- [ ] Like/clap functionality
- [ ] Pagination for article feeds
- [ ] Tag-based filtering and search
- [ ] Image upload support (Cloudinary/S3)
- [ ] User follow system
- [ ] Rich text editor integration
- [ ] Production deployment
