package com.constructora.controller;

import com.constructora.repository.ProyectoRepository;
import com.constructora.service.impl.ClienteInteresadoService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.constructora.dto.ClienteInteresadoRequestDTO;
import com.constructora.dto.ClienteInteresadoResponseDTO;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api/clientes-interesados")
public class ClienteInteresadoController {
    
    private final ProyectoRepository proyectoRepository;
    private final ClienteInteresadoService clienteInteresadoService;

    public ClienteInteresadoController(ClienteInteresadoService clienteInteresadoService,
            ProyectoRepository proyectoRepository) {
        this.clienteInteresadoService = clienteInteresadoService;
        this.proyectoRepository = proyectoRepository;
    }
    
    @GetMapping
    public ResponseEntity<List<ClienteInteresadoResponseDTO>> obtenerTodos() {
        return ResponseEntity.ok(clienteInteresadoService.obtenerTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClienteInteresadoResponseDTO> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(clienteInteresadoService.obtenerPorId(id));
    }
    
    @PostMapping
    public ResponseEntity<ClienteInteresadoResponseDTO> crear(
            @Valid @RequestBody ClienteInteresadoRequestDTO dto) {
        ClienteInteresadoResponseDTO creado = clienteInteresadoService.crear(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(creado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        clienteInteresadoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

}
