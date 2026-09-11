package com.constructora.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.constructora.entity.ClienteInteresado;

@Repository
public interface ClienteInteresadoRepository extends JpaRepository<ClienteInteresado, Long> {
    
    List<ClienteInteresado> findByProyectoId(Long proyectoId);
    
}

