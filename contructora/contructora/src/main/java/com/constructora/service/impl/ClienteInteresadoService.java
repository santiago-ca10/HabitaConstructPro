package com.constructora.service.impl;

import java.util.List;

import com.constructora.dto.ClienteInteresadoRequestDTO;
import com.constructora.dto.ClienteInteresadoResponseDTO;

public interface ClienteInteresadoService {
    
    List<ClienteInteresadoResponseDTO> obtenerTodos();

    List<ClienteInteresadoResponseDTO> obtenerPorProyecto(Long proyectoId);

    ClienteInteresadoResponseDTO obtenerPorId(Long id);
    
    ClienteInteresadoResponseDTO crear(ClienteInteresadoRequestDTO dto);
    
    void eliminar(Long id);
    
}
