package com.constructora.security;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Component;

@Component
public class TokenStore {

    private static final long DURACION_SEGUNDOS = 8 * 60 * 60;
    private final SecureRandom secureRandom = new SecureRandom();
    private final Map<String, Sesion> sesiones = new ConcurrentHashMap<>();

    public String crear(String username, String rol) {
        byte[] bytes = new byte[32];
        secureRandom.nextBytes(bytes);
        String token = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
        sesiones.put(token, new Sesion(username, rol, Instant.now().plusSeconds(DURACION_SEGUNDOS)));
        return token;
    }

    public Sesion buscar(String token) {
        Sesion sesion = sesiones.get(token);
        if (sesion != null && sesion.expiraEn().isAfter(Instant.now())) {
            return sesion;
        }
        sesiones.remove(token);
        return null;
    }

    public long getDuracionSegundos() {
        return DURACION_SEGUNDOS;
    }

    public record Sesion(String username, String rol, Instant expiraEn) {
    }
}
