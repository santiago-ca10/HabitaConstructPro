package com.constructora.service;

import com.constructora.dto.AuthTokenResponseDTO;
import com.constructora.dto.LoginRequestDTO;

public interface AuthService {
    AuthTokenResponseDTO iniciarSesion(LoginRequestDTO solicitud);
}
