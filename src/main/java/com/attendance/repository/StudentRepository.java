package com.attendance.repository;

import com.attendance.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    List<Student> findByPassedOut(boolean passedOut);
    List<Student> findByDepartment(String department);
    List<Student> findByYear(int year);
}