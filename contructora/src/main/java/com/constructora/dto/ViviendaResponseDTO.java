package com.constructora.dto;

import java.math.BigDecimal;

import com.constructora.enums.TipoVivienda;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ViviendaResponseDTO {

	private Long id;
	private String titulo;
	private TipoVivienda tipo;
	private Integer habitaciones;
	private Integer banos;
	private Integer area;
	private BigDecimal precio;
	private String imagenUrl;
	private Boolean disponible;
	private Long proyectoId;
	private String proyectoNombre;

}
