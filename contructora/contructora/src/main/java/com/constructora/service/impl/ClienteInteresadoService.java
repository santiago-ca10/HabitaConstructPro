package com.constructora.service.impl;

import java.util.List;

import com.constructora.dto.ClienteInteresadoResponseDTO;

public interface ClienteInteresadoService {
    
    
    List<ClienteInteresadoResponseDTO> obtenerTodos();
    
    void eliminar(Long id);
    
}
