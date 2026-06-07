package com.attendance.controller;

import com.attendance.security.JwtUtil;
import com.attendance.service.TeacherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private TeacherService teacherService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    request.get("username"),
                    request.get("password")
                )
            );
            UserDetails userDetails = teacherService.loadUserByUsername(request.get("username"));
            String token = jwtUtil.generateToken(userDetails.getUsername());
            Map<String, String> response = new HashMap<>();
            response.put("token", token);
            response.put("username", userDetails.getUsername());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Invalid username or password!");
        }
    }
}