# Attendance-app
CS4296 Group Project

Group No.: 98 <br>
Student(SID): Li Ka Chun(57892543), YU Kam Ming(57882760)

A full-stack attendance management application built with Node.js for the backend and a modern JavaScript framework for the frontend. This project allows users to register and track attendance through a system that integrates NFC and QR codes.

## Project Structure
ATTENDANCE-APP-MAIN
- attendance-backend
   - controllers           # Contains the logic for handling different routes
   - db                    # Contains the backup.sql
   - models                # Contains the models defining database structure
   - node_modules          # Backend dependencies
   - routes                # Defines all backend API routes
   - Dockerfile            # Docker configuration for the backend
   - package-lock.json     # Backend package lock
   - package.json          # Backend dependencies and scripts
   - server.js             # Main entry point for the backend server

- attendance-frontend   
   - node_modules          # Frontend dependencies
   - public                # Static files served to the client
   - src                   # Source code for frontend components and pages
   - .env                  # Environment variables for the frontend
   - eslint.config.js      # ESLint configuration for frontend
   - index.html            # Main HTML file for the frontend
   - package-lock.json     # Frontend package lock
   - package.json          # Frontend dependencies and scripts
   - vite.config.js        # Vite configuration for bundling the frontend

- tests  
   - stress_test_10.js     # Simulates 10 concurrent users
   - stress_test_30.js     # Simulates 30 concurrent users
   - stress_test_50.js     # Simulates 50 concurrent users with t3.micro
   - stress_test_c5l.js    # Simulates 50 concurrent users with c5.large
   - stress_test_t3m.js    # Simulates 50 concurrent users with t3.medium
   - throughput_test_1.js  # Measures throughput with 1 user
   - throughput_test_5.js  # Measures throughput with 5 users
- README.md                # This file

## Installation (Local)
1. Clone the Repository
   - git clone https://github.com/JayV0128/attendance-app.git
   - cd ATTENDANCE-APP-MAIN
2. Set up the Database
   - mysql --version
   - mysql -u root -p
   - CREATE DATABASE IF NOT EXISTS `attendance-sys`;
   - EXIT
   - mysql -u root -p attendance-sys < /path/to/db/backup.sql
3. Set up the Backend
   - cd attendance-backend
   - npm install
   - npm start
4. Set up the Frontend
   - cd attendance-frontend
   - npm i --legacy-peer-deps
   - npm run dev
5. Docker (Optional)
   - Build and run the backend Docker container:
      - docker build -t attendance-backend .
      - docker run -p 5000:5000 attendance-backend
6. Open the Application
   - http://localhost:5173  # For the frontend
   - http://localhost:8080  # For the backend API

## Deployment (Production)
We also deployed our backend server to AWS Elastic Beanstalk, which ensures that the application runs smoothly with scalability and high availability in a cloud environment(http://attendance-system-env-1.eba-sem4anku.us-east-1.elasticbeanstalk.com).

(Updated on 25 Apr) Due to insufficient AWS Learner Lab credits ($48.9/$50.0), we recommend installing the application locally using our backup.sql file to simulate the situation.

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
- NFC Scanning (via keyboard simulation)
- QR Code Scanning (via webcam)
