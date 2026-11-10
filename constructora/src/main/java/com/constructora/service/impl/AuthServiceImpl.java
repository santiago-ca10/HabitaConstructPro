package com.constructora.service.impl;

import com.constructora.dto.AuthTokenResponseDTO;
import com.constructora.dto.LoginRequestDTO;
import com.constructora.entity.Usuario;
import com.constructora.exeption.InvalidCredentialsException;
import com.constructora.mapper.AuthMapper;
import com.constructora.repository.UsuarioRepository;
import com.constructora.service.AuthService;
import com.constructora.security.TokenStore;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenStore tokenStore;
    private final AuthMapper authMapper;

    public AuthServiceImpl(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder,
            TokenStore tokenStore, AuthMapper authMapper) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenStore = tokenStore;
        this.authMapper = authMapper;
    }

    @Override
    public AuthTokenResponseDTO iniciarSesion(LoginRequestDTO solicitud) {
        Usuario usuario = usuarioRepository.findByUsername(solicitud.getUsername())
                .filter(candidato -> passwordEncoder.matches(solicitud.getPassword(), candidato.getPassword()))
                .orElseThrow(InvalidCredentialsException::new);
        String token = tokenStore.crear(usuario.getUsername(), usuario.getRol());
        return authMapper.toTokenResponse(token, tokenStore.getDuracionSegundos());
    }
}
