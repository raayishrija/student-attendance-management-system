package com.attendance.service;

import com.attendance.model.Teacher;
import com.attendance.repository.TeacherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class TeacherService implements UserDetailsService {

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Teacher teacher = teacherRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Teacher not found: " + username));
        return User.builder()
                .username(teacher.getUsername())
                .password(teacher.getPassword())
                .roles("TEACHER")
                .build();
    }

    public Teacher createTeacher(String username, String password, String name) {
        Teacher teacher = new Teacher();
        teacher.setUsername(username);
        teacher.setPassword(passwordEncoder.encode(password));
        teacher.setName(name);
        return teacherRepository.save(teacher);
    }
}