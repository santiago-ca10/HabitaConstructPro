package com.constructora.controller;

import com.constructora.dto.AuthTokenResponseDTO;
import com.constructora.dto.LoginRequestDTO;
import com.constructora.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthTokenResponseDTO> iniciarSesion(@Valid @RequestBody LoginRequestDTO solicitud) {
        return ResponseEntity.ok(authService.iniciarSesion(solicitud));
    }
}
