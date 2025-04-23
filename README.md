# attendance-app
CS4296 Group Project

A full-stack attendance management application built with Node.js for the backend and a modern JavaScript framework for the frontend. This project allows users to register and track attendance through a system that integrates NFC and QR codes.

## Project Structure
ATTENDANCE-APP-MAIN
- attendance-backend
   - controllers        # Contains the logic for handling different routes
   - models             # Contains the models defining database structure
   - node_modules       # Backend dependencies
   - routes             # Defines all backend API routes
   - Dockerfile         # Docker configuration for the backend
   - package-lock.json  # Backend package lock
   - package.json       # Backend dependencies and scripts
   - server.js          # Main entry point for the backend server

- attendance-frontend
   - node_modules       # Frontend dependencies
   - public             # Static files served to the client
   - src                # Source code for frontend components and pages
   - .env               # Environment variables for the frontend
   - eslint.config.js   # ESLint configuration for frontend
   - index.html         # Main HTML file for the frontend
   - package-lock.json  # Frontend package lock
   - package.json       # Frontend dependencies and scripts
   - vite.config.js     # Vite configuration for bundling the frontend

- README.md             # This file

## Installation (Local)
1. Clone the Repository
   - git clone https://github.com/JayV0128/attendance-app.git
   - cd ATTENDANCE-APP-MAIN
2. Set up the Backend
   - cd attendance-backend
   - npm install
   - npm start
3. Set up the Frontend
   - npm i --legacy-peer-deps
   - npm run dev
4. Docker (Optional)
   - Build and run the backend Docker container:
      - docker build -t attendance-backend .
      - docker run -p 5000:5000 attendance-backend
5. Open the Application
   - http://localhost:5173  # For the frontend
   - http://localhost:8080  # For the backend API


## Features
- User Registration: Users can sign up with their name and other required information.
- NFC Integration: The app supports NFC tag scanning for tracking attendance.
- QR Code Generation: Upon registration, a QR code is generated for each user.
- Real-Time Attendance Tracking: Attendance is logged using NFC and QR codes.

## Technologies Used
### Backend:
- Node.js
- Express.js
- MySQL for user and attendance data
- Docker (Optional)
### Frontend:
- React
- Vite
- Ant Design (for UI components)
