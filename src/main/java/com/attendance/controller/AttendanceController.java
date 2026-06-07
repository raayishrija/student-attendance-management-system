package com.attendance.controller;

import com.attendance.model.Attendance;
import com.attendance.service.AttendanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/attendance")
@CrossOrigin(origins = "http://localhost:5173")
public class AttendanceController {

    @Autowired
    private AttendanceService attendanceService;

    @PostMapping("/mark")
    public ResponseEntity<Attendance> markAttendance(@RequestBody Map<String, String> request) {
        Long studentId = Long.parseLong(request.get("studentId"));
        Attendance.AttendanceStatus status = Attendance.AttendanceStatus.valueOf(request.get("status"));
        LocalDate date = LocalDate.parse(request.get("date"));
        return ResponseEntity.ok(attendanceService.markAttendance(studentId, status, date));
    }

    @GetMapping("/date/{date}")
    public ResponseEntity<List<Attendance>> getAttendanceByDate(@PathVariable String date) {
        return ResponseEntity.ok(attendanceService.getAttendanceByDate(LocalDate.parse(date)));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Attendance>> getAttendanceByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(attendanceService.getAttendanceByStudent(studentId));
    }

    @GetMapping("/percentage/{studentId}")
    public ResponseEntity<Double> getAttendancePercentage(@PathVariable Long studentId) {
        return ResponseEntity.ok(attendanceService.getAttendancePercentage(studentId));
    }
}