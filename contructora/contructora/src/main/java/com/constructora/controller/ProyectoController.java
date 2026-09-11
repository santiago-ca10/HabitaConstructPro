package com.constructora.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.constructora.service.impl.ClienteInteresadoService;
import com.constructora.service.impl.ViviendaService;
import com.constructora.service.impl.ProyectoService;

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


}
