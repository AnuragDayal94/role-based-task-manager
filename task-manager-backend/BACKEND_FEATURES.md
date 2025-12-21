# Backend Features – Role-Based Task Management System

## Overview
This backend is built using **Node.js, Express.js, and MongoDB (Atlas)**.  
It provides a secure, role-based task management system where users can authenticate, access protected APIs, and manage tasks based on their assigned roles.

The system enforces **authentication, authorization, and ownership checks entirely at the backend level**, without relying on frontend logic.

---

## What the Backend Does

- Handles user authentication using **JWT-based authentication**
- Stores user data securely with **hashed passwords (bcrypt)**
- Implements **role-based authorization** (admin vs user)
- Allows admins to create, view, and delete tasks
- Allows users to view and update only their assigned tasks
- Enforces **data-level access control** to prevent unauthorized actions
- Uses MongoDB Atlas for persistent data storage
- Protects all sensitive routes using middleware

---

## API Endpoints

### Authentication APIs

#### Register User
**POST** `/api/users/register`

- Registers a new user
- Hashes password before saving
- Prevents duplicate email registration

---

#### Login User
**POST** `/api/users/login`

- Authenticates user using email and password
- Compares hashed passwords
- Returns a JWT token on successful login

---

#### Get User Profile (Protected)
**GET** `/api/users/profile`

- Requires valid JWT token
- Returns authenticated user details
- Used to verify protected route access

---

### Task Management APIs

#### Create Task (Admin Only)
**POST** `/api/tasks`

- Admin creates a task
- Assigns task to a specific user
- Stores task creator and assigned user

---

#### Get Tasks (Role-Based)
**GET** `/api/tasks`

- Admin: Fetches all tasks
- User: Fetches only tasks assigned to them
- Uses population to return user details instead of raw IDs

---

#### Update Task Status (Assigned User / Admin)
**PATCH** `/api/tasks/:id/status`

- Allows status update (`pending`, `in-progress`, `completed`)
- Enforces ownership checks
- Prevents unauthorized task updates

---

#### Delete Task (Admin Only)
**DELETE** `/api/tasks/:id`

- Allows admin to delete any task
- Prevents normal users from deleting tasks

---

## Roles & Permissions

### Admin
- Create tasks
- Assign tasks to users
- View all tasks
- Update any task status
- Delete tasks

### User
- View only assigned tasks
- Update status of assigned tasks
- Cannot create or delete tasks
- Cannot access admin-only APIs

---

## Security & Access Control

- Passwords are stored using **bcrypt hashing**
- Authentication handled using **JWT tokens**
- Protected routes use middleware to verify tokens
- Authorization is enforced using role-based middleware
- Ownership checks prevent users from modifying others’ tasks
- Sensitive fields (like passwords) are never exposed in responses

---

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas
- **Authentication:** JWT
- **Security:** bcrypt
- **ODM:** Mongoose

---

## Key Learning Outcomes

- Implemented secure authentication and authorization
- Designed scalable backend architecture
- Enforced role-based and ownership-based access control
- Gained hands-on experience with MongoDB relationships
- Built a production-style REST API from scratch
