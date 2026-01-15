# Medium Clone - Full Stack MERN Application

A production-style Medium-like blogging platform built using the **MERN stack**.
This project demonstrates **clean backend architecture**, **JWT authentication**, **protected REST APIs**, and a **modern React frontend**.

The backend follows **MVC + Service layer separation**, structured validation, and centralized error handling.
The frontend uses **Context-based authentication state** and **protected routing**.

This project is designed to showcase **real-world full-stack engineering practices** rather than tutorial-style code.

---

## Project Overview

The application provides core Medium-like functionality:

- Secure user registration and login
- JWT-based authenticated sessions
- Public article feed
- Authenticated article creation
- Author-only article editing and deletion
- Public user profile pages listing authored articles

The goal is to demonstrate:

- Scalable REST API design
- Proper separation of concerns in backend
- Secure authentication workflows
- Clean frontend-backend integration

---

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose ODM
- JWT Authentication
- Bcrypt Password Hashing
- Zod Validation
- Centralized Error Handling Middleware

### Frontend
- React 18
- Vite
- React Router
- Axios
- Context API for Authentication State
- Tailwind CSS

### Tooling
- Nodemon
- Postman

---

## Architecture Overview

Request lifecycle:

```
Route → Middleware → Controller → Service → Model → Database
```

- Middleware handles authentication and validation
- Controllers manage HTTP logic
- Services contain business rules
- Models interact with MongoDB

No layer leaks responsibilities into another.

---

## Core Features

### Authentication
- User Signup & Login
- JWT-based session management
- Password hashing with bcrypt
- Protected API routes

### Articles
- Create, Read, Update, Delete operations
- Author-only modification access
- Automatic unique slug generation

### Users
- Public profile pages
- Author article listing

---

## Running Locally

### Start Backend

Backend runs at:

```
http://localhost:5000
```

### Start Frontend

Frontend runs at:

```
http://localhost:5173
```

---

## API Endpoints

### Authentication `/api/auth`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /signup | Register user |
| POST | /login | Login user |
| GET  | /me | Get current user |

### Articles `/api/articles`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | / | Get all articles |
| GET | /:id | Get single article |
| POST | / | Create article (auth required) |
| PUT | /:id | Update article (author only) |
| DELETE | /:id | Delete article (author only) |

### Users `/api/users`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /:username | Get user profile |

---

## API Testing

Base URL:

```
http://localhost:5000/api
```

### Signup

POST `/auth/signup`

Body:

```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}
```

### Login

POST `/auth/login`

``Authorization: Bearer YOUR_TOKEN
``
### Create Article

POST `/articles`

Body:

```json
{
  "title": "Test Article",
  "content": "This is a test article."
}
```
## Development Principles

- MVC + Service layer backend architecture
- Secure JWT authentication
- Proper separation of concerns
- Validation-driven request handling
- Clean frontend-backend integration
- Centralized error responses
- RESTful API design

## Production Build

### Backend

```bash
npm run build:backend
```

### Frontend

```bash
npm run build:frontend
```

