package com.constructora.service.impl;

import java.util.List;

import com.constructora.dto.ViviendaRequestDTO;
import com.constructora.dto.ViviendaResponseDTO;

public interface ViviendaService {

    List<ViviendaResponseDTO> obtenerTodas();

    List<ViviendaResponseDTO> obtenerDisponibles();

    List<ViviendaResponseDTO> obtenerPorProyecto(Long proyectoId);

    ViviendaResponseDTO obtenerPorId(Long id);

    ViviendaResponseDTO crear(ViviendaRequestDTO dto);

    ViviendaResponseDTO actualizar(Long id, ViviendaRequestDTO dto);

    void eliminar(Long id);

}
