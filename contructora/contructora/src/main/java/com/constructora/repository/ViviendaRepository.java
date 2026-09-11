package com.constructora.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.constructora.entity.Vivienda;

@Repository
public interface ViviendaRepository extends JpaRepository<Vivienda, Long> {
    
    List<Vivienda> findByProyectoId(Long proyectoId);
    List<Vivienda> findByDisponibleTrue();
    
}
