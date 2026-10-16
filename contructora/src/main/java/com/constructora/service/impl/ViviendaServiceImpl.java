package com.constructora.service.impl;

import com.constructora.dto.ViviendaRequestDTO;
import com.constructora.dto.ViviendaResponseDTO;
import com.constructora.entity.Proyecto;
import com.constructora.entity.Vivienda;
import com.constructora.exeption.ResourceNotFoundException;
import com.constructora.mapper.ViviendaMapper;
import com.constructora.repository.ProyectoRepository;
import com.constructora.repository.ViviendaRepository;
import com.constructora.service.ViviendaService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ViviendaServiceImpl implements ViviendaService {

    private final ViviendaRepository viviendaRepository;
    private final ProyectoRepository proyectoRepository;
    private final ViviendaMapper viviendaMapper;
    

    public ViviendaServiceImpl(ViviendaRepository viviendaRepository, 
            ProyectoRepository proyectoRepository, ViviendaMapper viviendaMapper) {
        this.viviendaRepository = viviendaRepository;
        this.proyectoRepository = proyectoRepository;
        this.viviendaMapper = viviendaMapper;
    }

    @Override
    public List<ViviendaResponseDTO> obtenerTodas() {
        return viviendaRepository.findAll().stream()
                .map(viviendaMapper::toResponseDTO)
                .toList();
    }

    @Override
    public List<ViviendaResponseDTO> obtenerDisponibles() {
        return viviendaRepository.findByDisponibleTrue().stream()
                .map(viviendaMapper::toResponseDTO)
                .toList();
    }

    @Override
    public List<ViviendaResponseDTO> obtenerPorProyecto(Long proyectoId) {
        verificarProyecto(proyectoId);
        return viviendaRepository.findByProyectoId(proyectoId).stream()
                .map(viviendaMapper::toResponseDTO)
                .toList();
    }
    
    @Override
    public ViviendaResponseDTO obtenerPorId(Long id) {
        Vivienda vivienda = viviendaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontró la vivienda con el id: " + id));
        return viviendaMapper.toResponseDTO(vivienda);
    }

    @Override
    public ViviendaResponseDTO crear(ViviendaRequestDTO dto) {
        Proyecto proyecto = verificarProyecto(dto.getProyectoId());
        Vivienda vivienda = viviendaMapper.toEntity(dto, proyecto);
        Vivienda guardada = viviendaRepository.save(vivienda);
        return viviendaMapper.toResponseDTO(guardada);
    }

    @Override
    public ViviendaResponseDTO actualizar(Long id, ViviendaRequestDTO dto) {
        Vivienda vivienda = viviendaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontró la vivienda con el id: " + id));
        Proyecto proyecto = verificarProyecto(dto.getProyectoId());
        viviendaMapper.updateEntity(vivienda, dto, proyecto);
        Vivienda actualizada = viviendaRepository.save(vivienda);
        return viviendaMapper.toResponseDTO(actualizada);
    }

    @Override
    public void eliminar(Long id) {
        if (!viviendaRepository.existsById(id)) {
            throw new ResourceNotFoundException("No se encontró la vivienda con el id: " + id);
        }
        viviendaRepository.deleteById(id);
    }

    private Proyecto verificarProyecto(Long proyectoId) {
        return proyectoRepository.findById(proyectoId)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontró el proyecto con el id: " + proyectoId));
    }

}
