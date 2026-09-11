package com.constructora.dto;

import java.math.BigDecimal;

import com.constructora.enums.TipoVivienda;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ViviendaRequestDTO {

	@NotBlank(message = "El título es obligatorio")
	private String titulo;

	@NotNull(message = "El tipo de vivienda es obligatorio")
	private TipoVivienda tipo;

	@NotNull(message = "La cantidad de habitaciones es obligatoria")
	@Min(value = 0, message = "La cantidad de habitaciones no puede ser negativa")
	private Integer habitaciones;

	@NotNull(message = "La cantidad de baños es obligatoria")
	@Min(value = 1, message = "La cantidad de baños debe ser uno o mayor")
	private Integer banos;

	@NotNull(message = "El área es obligatoria")
	@DecimalMin(value = "0.01", message = "El área debe ser mayor que cero")
	private Integer area;

	@NotNull(message = "El precio es obligatorio")
	@DecimalMin(value = "0.01", message = "El precio debe ser mayor que cero")
	private BigDecimal precio;

	private String imagenUrl;

	private Boolean disponible = true;

	@NotBlank(message = "El proyecto es obligatorio")
	private Long proyectoId;

}
