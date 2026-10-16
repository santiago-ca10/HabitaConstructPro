package com.constructora.mapper;

import com.constructora.dto.ProyectoRequestDTO;
import com.constructora.dto.ProyectoResponseDTO;
import com.constructora.entity.Proyecto;
import org.springframework.stereotype.Component;

@Component 
public class ProyectoMapper {
    
    public ProyectoResponseDTO toResponseDTO(Proyecto proyecto){
        ProyectoResponseDTO dto = new ProyectoResponseDTO();
        dto.setId(proyecto.getId());
        dto.setNombre(proyecto.getNombre());
        dto.setDescripcion(proyecto.getDescripcion());
        dto.setCiudad(proyecto.getCiudad());
        dto.setDireccion(proyecto.getDireccion());
        dto.setPrecioDesde(proyecto.getPrecioDesde());
        dto.setImagenUrl(proyecto.getImagenUrl());
        dto.setEstado(proyecto.getEstado());
        dto.setDestacado(proyecto.getDestacado());
        return dto;
    }

    public Proyecto toEntity(ProyectoRequestDTO dto){
        Proyecto proyecto = new Proyecto();
        proyecto.setNombre(dto.getNombre());
        proyecto.setDescripcion(dto.getDescripcion());
        proyecto.setCiudad(dto.getCiudad());
        proyecto.setDireccion(dto.getDireccion());
        proyecto.setPrecioDesde(dto.getPrecioDesde());
        proyecto.setImagenUrl(dto.getImagenUrl());
        proyecto.setEstado(dto.getEstado());
        proyecto.setDestacado(dto.getDestacado() != null ? dto.getDestacado() : false);
        return proyecto;
    }

    public void updateEntity(Proyecto proyecto, ProyectoRequestDTO dto){
        proyecto.setNombre(dto.getNombre());
        proyecto.setDescripcion(dto.getDescripcion());
        proyecto.setCiudad(dto.getCiudad());
        proyecto.setDireccion(dto.getDireccion());
        proyecto.setPrecioDesde(dto.getPrecioDesde());
        proyecto.setImagenUrl(dto.getImagenUrl());
        proyecto.setEstado(dto.getEstado());
        if (dto.getDestacado() != null) {
            proyecto.setDestacado(dto.getDestacado());
        }
    }

}
