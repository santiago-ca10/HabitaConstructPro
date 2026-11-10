package com.constructora.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.constructora.entity.Proyecto;

@Repository
public interface ProyectoRepository extends JpaRepository<Proyecto, Long> {

    List<Proyecto> findByDestacadoTrue();

    List<Proyecto> findByCiudadIgnoreCase(String ciudad);

    @org.springframework.data.jpa.repository.Query("select distinct p.ciudad from Proyecto p order by p.ciudad")
    List<String> findDistinctCiudades();
    
}