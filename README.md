# 🎓 Student Attendance Management System

A full-stack web application for managing student attendance with a Java Spring Boot backend and React frontend.

## Features
- 🔐 Teacher login with JWT authentication
- 📊 Dashboard with attendance stats by year and department
- 👨‍🎓 Manage 1000+ student records
- ✅ Mark attendance - Present, Absent, Late
- 📅 Date-wise attendance tracking
- 📈 Real-time attendance percentage per student
- 🎓 Passed out students section
- 🔍 Filter by year and department

## Tech Stack
| Layer | Technology |
|---|---|
| Backend | Java 20, Spring Boot 3.2 |
| Security | Spring Security, JWT |
| ORM | Spring Data JPA + Hibernate |
| Database | MySQL |
| Frontend | React, Vite |
| HTTP Client | Axios |
| Routing | React Router DOM |
| Build Tool | Maven |

## How to Run

### Backend
1. Create MySQL database: CREATE DATABASE attendancedb;
2. Run: mvn spring-boot:run
3. API available at: http://localhost:8081
4. Default login: username=teacher, password=teacher123

### Frontend
1. cd attendance-frontend
2. npm install
3. npm run dev
4. Open: http://localhost:5173

## API Endpoints
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/login | Teacher login |
| GET | /api/students | Get all students |
| POST | /api/students | Add student |
| GET | /api/attendance/date/{date} | Get attendance by date |
| POST | /api/attendance/mark | Mark attendance |
| GET | /api/attendance/percentage/{id} | Get attendance % |