package com.constructora.dto;

import java.math.BigDecimal;

import com.constructora.enums.EstadoProyecto;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProyectoRequestDTO {

	@NotBlank(message = "El nombre es obligatorio")
	private String nombre;

	@NotBlank(message = "La descripción es obligatoria")
	private String descripcion;

	@NotBlank(message = "La ciudad es obligatoria")
	private String ciudad;

	@NotBlank(message = "La dirección es obligatoria")
	private String direccion;

	@NotNull(message = "El precio desde es obligatorio")
	@DecimalMin(value = "0.01", message = "El precio desde debe ser mayor que cero")
	private BigDecimal precioDesde;

	private String imagenUrl;

	@NotNull(message = "El estado es obligatorio")
	private EstadoProyecto estado;

	private Boolean destacado = false;

}