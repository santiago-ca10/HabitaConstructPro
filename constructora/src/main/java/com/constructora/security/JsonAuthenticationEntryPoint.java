package com.constructora.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.LocalDateTime;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;

public class JsonAuthenticationEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception)
            throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setCharacterEncoding("UTF-8");
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.getWriter().printf(
                "{\"timestamp\":\"%s\",\"status\":401,\"error\":\"No autorizado\","
                        + "\"message\":\"Se requiere una sesión válida\",\"path\":\"%s\"}",
                LocalDateTime.now(), escapar(request.getRequestURI()));
    }

    private String escapar(String value) {
        return value.replace("\\", "\\\\").replace("\"", "\\\"");
    }
}
