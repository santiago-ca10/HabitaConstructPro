package com.constructora.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.constructora.entity.Vivienda;

@Repository
public interface ViviendaRepository extends JpaRepository<Vivienda, Long> {
    
    List<Vivienda> findByProyectoId(Long proyectoId);
    List<Vivienda> findByDisponibleTrue();

    @org.springframework.data.jpa.repository.Query("select v from Vivienda v where lower(v.proyecto.ciudad) = lower(:ciudad)")
    List<Vivienda> findByProyectoCiudadIgnoreCase(@org.springframework.data.repository.query.Param("ciudad") String ciudad);
    
}
