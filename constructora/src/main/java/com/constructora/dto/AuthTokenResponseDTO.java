package com.constructora.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AuthTokenResponseDTO {
    private String token;
    private long expiresIn;
}
