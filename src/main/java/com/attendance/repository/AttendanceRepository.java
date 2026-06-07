package com.attendance.repository;

import com.attendance.model.Attendance;
import com.attendance.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findByStudent(Student student);
    List<Attendance> findByDate(LocalDate date);
    Optional<Attendance> findByStudentAndDate(Student student, LocalDate date);
    long countByStudentAndStatus(Student student, Attendance.AttendanceStatus status);
    long countByStudent(Student student);
}