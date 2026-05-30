# README.md

# TaskFlow - Team Task Manager

A full-stack project management application with role-based access control, task tracking, and team collaboration features.

## Features

- 🔐 **Authentication** - Signup/Login with JWT tokens
- 👥 **Role-Based Access** - Admin and Member roles with different permissions
- 📁 **Project Management** - Create projects and manage team members
- ✅ **Task Tracking** - Create, assign, and track tasks with status updates
- 📊 **Dashboard** - Overview of tasks, statistics, and overdue alerts
- 🎯 **Priority System** - Low, Medium, High, and Urgent task priorities
- 👨‍👩‍👧‍👦 **Team Collaboration** - Add members to projects and assign tasks

## Tech Stack

### Backend
- Node.js & Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing

### Frontend
- React.js
- Tailwind CSS
- Axios for API calls
- React Router for navigation
- React Hot Toast for notifications

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud like MongoDB Atlas)

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Update .env with your MongoDB URI and JWT secret
npm run dev