package com.constructora.mapper;

import com.constructora.dto.AuthTokenResponseDTO;
import org.springframework.stereotype.Component;

@Component
public class AuthMapper {
    public AuthTokenResponseDTO toTokenResponse(String token, long expiresIn) {
        return new AuthTokenResponseDTO(token, expiresIn);
    }
}
