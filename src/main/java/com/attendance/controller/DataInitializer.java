package com.attendance.controller;

import com.attendance.service.TeacherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import com.attendance.repository.TeacherRepository;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private TeacherService teacherService;

    @Autowired
    private TeacherRepository teacherRepository;

    @Override
    public void run(String... args) throws Exception {
        if (teacherRepository.findByUsername("teacher").isEmpty()) {
            teacherService.createTeacher("teacher", "teacher123", "Admin Teacher");
            System.out.println("✅ Default teacher created!");
            System.out.println("Username: teacher");
            System.out.println("Password: teacher123");
        }
    }
}