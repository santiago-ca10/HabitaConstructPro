package com.constructora.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.constructora.dto.ViviendaRequestDTO;
import com.constructora.dto.ViviendaResponseDTO;
import com.constructora.service.impl.ViviendaService;

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
@RequestMapping("/api/viviendas")
public class ViviendaController {

    private final ViviendaService viviendaService;

    public ViviendaController(ViviendaService viviendaService) {
        this.viviendaService = viviendaService;
    }

    @GetMapping
    public ResponseEntity<List<ViviendaResponseDTO>> obtenerTodas() {
        return ResponseEntity.ok(viviendaService.obtenerTodas());
    }

    @GetMapping("/disponibles")
    public ResponseEntity<List<ViviendaResponseDTO>> obtenerDisponibles() {
        return ResponseEntity.ok(viviendaService.obtenerDisponibles());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ViviendaResponseDTO> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(viviendaService.obtenerPorId(id));
    }

    @PostMapping
    public ResponseEntity<ViviendaResponseDTO> crear(@Valid @RequestBody ViviendaRequestDTO dto) {
        ViviendaResponseDTO creada = viviendaService.crear(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(creada);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ViviendaResponseDTO> actualizar(@PathVariable Long id, @Valid @RequestBody ViviendaRequestDTO dto) {
        return ResponseEntity.ok(viviendaService.actualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        viviendaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
