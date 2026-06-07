package com.attendance.service;

import com.attendance.model.Student;
import com.attendance.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    public List<Student> getAllStudents() {
        return studentRepository.findByPassedOut(false);
    }

    public List<Student> getPassedOutStudents() {
        return studentRepository.findByPassedOut(true);
    }

    public Student getStudentById(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + id));
    }

    public Student createStudent(Student student) {
        return studentRepository.save(student);
    }

    public Student updateStudent(Long id, Student studentDetails) {
        Student student = getStudentById(id);
        student.setRollNo(studentDetails.getRollNo());
        student.setName(studentDetails.getName());
        student.setFatherName(studentDetails.getFatherName());
        student.setMotherName(studentDetails.getMotherName());
        student.setDob(studentDetails.getDob());
        student.setDepartment(studentDetails.getDepartment());
        student.setYear(studentDetails.getYear());
        student.setPassedOut(studentDetails.isPassedOut());
        return studentRepository.save(student);
    }

    public void deleteStudent(Long id) {
        studentRepository.deleteById(id);
    }

    public List<Student> getStudentsByDepartment(String department) {
        return studentRepository.findByDepartment(department);
    }

    public List<Student> getStudentsByYear(int year) {
        return studentRepository.findByYear(year);
    }
}