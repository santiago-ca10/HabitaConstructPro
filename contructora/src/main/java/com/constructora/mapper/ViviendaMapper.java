package com.constructora.mapper;

import com.constructora.dto.ViviendaRequestDTO;
import com.constructora.dto.ViviendaResponseDTO;
import com.constructora.entity.Proyecto;
import com.constructora.entity.Vivienda;
import org.springframework.stereotype.Component;

@Component 
public class ViviendaMapper {
    
    public ViviendaResponseDTO toResponseDTO(Vivienda vivienda){
        ViviendaResponseDTO dto = new ViviendaResponseDTO();
        dto.setId(vivienda.getId());
        dto.setTitulo(vivienda.getTitulo());
        dto.setTipo(vivienda.getTipo());
        dto.setHabitaciones(vivienda.getHabitaciones());
        dto.setBanos(vivienda.getBanos());
        dto.setArea(vivienda.getArea());
        dto.setPrecio(vivienda.getPrecio());
        dto.setImagenUrl(vivienda.getImagenUrl());
        dto.setDisponible(vivienda.getDisponible());
        if (vivienda.getProyecto() != null) {
            dto.setProyectoId(vivienda.getProyecto().getId());
            dto.setProyectoNombre(vivienda.getProyecto().getNombre());
        }
        return dto;
    }

    public Vivienda toEntity(ViviendaRequestDTO dto, Proyecto proyecto){
        Vivienda vivienda = new Vivienda();
        vivienda.setTitulo(dto.getTitulo());
        vivienda.setTipo(dto.getTipo());
        vivienda.setHabitaciones(dto.getHabitaciones());
        vivienda.setBanos(dto.getBanos());
        vivienda.setArea(dto.getArea());
        vivienda.setPrecio(dto.getPrecio());
        vivienda.setImagenUrl(dto.getImagenUrl());
        vivienda.setDisponible(dto.getDisponible() != null ? dto.getDisponible() : true);
        vivienda.setProyecto(proyecto);
        return vivienda;
    }

    public void updateEntity(Vivienda vivienda, ViviendaRequestDTO dto, Proyecto proyecto){
        vivienda.setTitulo(dto.getTitulo());
        vivienda.setTipo(dto.getTipo());
        vivienda.setHabitaciones(dto.getHabitaciones());
        vivienda.setBanos(dto.getBanos());
        vivienda.setArea(dto.getArea());
        vivienda.setPrecio(dto.getPrecio());
        vivienda.setImagenUrl(dto.getImagenUrl());
        if (dto.getDisponible() != null) {
            vivienda.setDisponible(dto.getDisponible());
        }
        vivienda.setProyecto(proyecto);
    }
}
