package com.constructora.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.constructora.dto.ClienteInteresadoResponseDTO;
import com.constructora.dto.ProyectoRequestDTO;
import com.constructora.dto.ProyectoResponseDTO;
import com.constructora.dto.ViviendaResponseDTO;
import com.constructora.service.impl.ClienteInteresadoService;
import com.constructora.service.impl.ViviendaService;
import com.constructora.service.impl.ProyectoService;

import jakarta.validation.Valid;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;



@RestController
@RequestMapping("/api/proyectos")
public class ProyectoController {
    
    private final ProyectoService proyectoService;
    private final ViviendaService viviendaService;
    private final ClienteInteresadoService clienteInteresadoService;


    public ProyectoController(ProyectoService proyectoService, 
                                ViviendaService viviendaService,
                                ClienteInteresadoService clienteInteresadoService,
                                ClienteInteresadoController clienteInteresadoController) {
        this.proyectoService = proyectoService;
        this.viviendaService = viviendaService;
        this.clienteInteresadoService = clienteInteresadoService;
    }

    @GetMapping
    public ResponseEntity<List<ProyectoResponseDTO>> obtenerTodos() {
        return ResponseEntity.ok(proyectoService.obtenerTodos());
    }

    @GetMapping("/destacados")
    public ResponseEntity<List<ProyectoResponseDTO>> obtenerDestacados() {
        return ResponseEntity.ok(proyectoService.obtenerDestacados());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProyectoResponseDTO> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(proyectoService.obtenerPorId(id));
    }

    @GetMapping ("/{proyectoId}/viviendas")
    public ResponseEntity<List<ViviendaResponseDTO>> obtenerViviendas(@PathVariable Long proyectoId) {
        return ResponseEntity.ok(viviendaService.obtenerPorProyecto(proyectoId));
    }

    @GetMapping("/{proyectoId}/clientes-interesados")
    public ResponseEntity<List<ClienteInteresadoResponseDTO>> obtenerClientes(@PathVariable Long proyectoId) {
        return ResponseEntity.ok(clienteInteresadoService.obtenerPorProyecto(proyectoId));
    }

    @PostMapping 
    public ResponseEntity<ProyectoResponseDTO> crear(@Valid @RequestBody ProyectoRequestDTO dto) {
        ProyectoResponseDTO creado = proyectoService.crear(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(creado);

    }

    @PutMapping("/{id}")
    public ResponseEntity<ProyectoResponseDTO> actualizar(@PathVariable Long id, @Valid @RequestBody ProyectoRequestDTO dto) {
        ProyectoResponseDTO actualizado = proyectoService.actualizar(id, dto);
        return ResponseEntity.ok(actualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        proyectoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

}
