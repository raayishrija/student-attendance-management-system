package com.attendance.service;

import com.attendance.model.Attendance;
import com.attendance.model.Student;
import com.attendance.repository.AttendanceRepository;
import com.attendance.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class AttendanceService {

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private StudentRepository studentRepository;

    public Attendance markAttendance(Long studentId, Attendance.AttendanceStatus status, LocalDate date) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Optional<Attendance> existing = attendanceRepository.findByStudentAndDate(student, date);

        Attendance attendance;
        if (existing.isPresent()) {
            attendance = existing.get();
        } else {
            attendance = new Attendance();
            attendance.setStudent(student);
            attendance.setDate(date);
        }
        attendance.setStatus(status);
        return attendanceRepository.save(attendance);
    }

    public List<Attendance> getAttendanceByDate(LocalDate date) {
        return attendanceRepository.findByDate(date);
    }

    public List<Attendance> getAttendanceByStudent(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        return attendanceRepository.findByStudent(student);
    }

    public double getAttendancePercentage(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        long total = attendanceRepository.countByStudent(student);
        if (total == 0) return 0.0;
        long present = attendanceRepository.countByStudentAndStatus(student, Attendance.AttendanceStatus.PRESENT);
        long late = attendanceRepository.countByStudentAndStatus(student, Attendance.AttendanceStatus.LATE);
        return ((double)(present + late) / total) * 100;
    }
}