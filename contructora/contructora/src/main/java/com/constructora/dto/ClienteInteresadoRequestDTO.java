package com.constructora.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ClienteInteresadoRequestDTO {
    
    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    @NotBlank(message = "El teléfono es obligatorio")
    private String telefono;

    @NotBlank(message = "El correo electrónico es obligatorio")
    @Email(message = "El correo debe ser válido")
    private String correo;

    @NotBlank(message = "El mensaje es obligatorio")
    private String mensaje;

    @NotBlank(message = "El proyecto es obligatorio")
    private String proyectoId;
    
}
