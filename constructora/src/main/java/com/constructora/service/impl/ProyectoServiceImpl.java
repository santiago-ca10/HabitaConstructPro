package com.constructora.service.impl;

import com.constructora.dto.ProyectoRequestDTO;
import com.constructora.dto.ProyectoResponseDTO;
import com.constructora.entity.Proyecto;
import com.constructora.exeption.ResourceNotFoundException;
import com.constructora.mapper.ProyectoMapper;
import com.constructora.repository.ProyectoRepository;
import com.constructora.service.ProyectoService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProyectoServiceImpl implements ProyectoService {

    private final ProyectoRepository proyectoRepository;
    private final ProyectoMapper proyectoMapper;

    public ProyectoServiceImpl(ProyectoRepository proyectoRepository, ProyectoMapper proyectoMapper) {
        this.proyectoRepository = proyectoRepository;
        this.proyectoMapper = proyectoMapper;
    }

    @Override
    public List<ProyectoResponseDTO> obtenerTodos() {
        return proyectoRepository.findAll().stream()
                .map(proyectoMapper::toResponseDTO)
                .toList();
    }

    @Override
    public List<ProyectoResponseDTO> obtenerDestacados() {
        return proyectoRepository.findByDestacadoTrue().stream()
                .map(proyectoMapper::toResponseDTO)
                .toList();
    }

    @Override
    public ProyectoResponseDTO obtenerPorId(Long id) {
        Proyecto proyecto = proyectoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontró el proyecto con el id: " + id));
        return proyectoMapper.toResponseDTO(proyecto);
    }

    @Override
    public ProyectoResponseDTO crear(ProyectoRequestDTO dto) {
        Proyecto proyecto = proyectoMapper.toEntity(dto);
        Proyecto guardado = proyectoRepository.save(proyecto);
        return proyectoMapper.toResponseDTO(guardado);
    }

    @Override
    public ProyectoResponseDTO actualizar(Long id, ProyectoRequestDTO dto) {
        Proyecto proyecto = proyectoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontró el proyecto con el id: " + id));
        proyectoMapper.updateEntity(proyecto, dto);
        Proyecto actualizado = proyectoRepository.save(proyecto);
        return proyectoMapper.toResponseDTO(actualizado);
    }

    @Override
    public void eliminar(Long id) {
        if (!proyectoRepository.existsById(id)) {
            throw new ResourceNotFoundException("No se encontró el proyecto con el id: " + id);
        }
        proyectoRepository.deleteById(id);
    }
}
