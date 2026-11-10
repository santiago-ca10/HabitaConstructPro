package com.constructora.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.LocalDateTime;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;

public class JsonAccessDeniedHandler implements AccessDeniedHandler {

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException exception)
            throws IOException {
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.setCharacterEncoding("UTF-8");
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.getWriter().printf(
                "{\"timestamp\":\"%s\",\"status\":403,\"error\":\"Acceso denegado\","
                        + "\"message\":\"No tienes permiso para realizar esta operación\",\"path\":\"%s\"}",
                LocalDateTime.now(), request.getRequestURI().replace("\\", "\\\\").replace("\"", "\\\""));
    }
}
