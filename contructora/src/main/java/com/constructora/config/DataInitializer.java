package com.constructora.config;

import com.constructora.entity.ClienteInteresado;
import com.constructora.entity.Proyecto;
import com.constructora.entity.Vivienda;
import com.constructora.enums.EstadoProyecto;
import com.constructora.enums.TipoVivienda;
import com.constructora.repository.ClienteInteresadoRepository;
import com.constructora.repository.ProyectoRepository;
import com.constructora.repository.ViviendaRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initData(ProyectoRepository proyectoRepository,
                               ViviendaRepository viviendaRepository,
                               ClienteInteresadoRepository clienteInteresadoRepository) {
        return args -> {
            if (proyectoRepository.count() > 0) {
                return;
            }

            Proyecto p1 = crearProyecto("Villas del Sol", "Conjunto residencial con amplias zonas verdes y club house.",
                    "Bogotá", "Calle 100 #15-20", new BigDecimal("280000000"), EstadoProyecto.EN_CONSTRUCCION, true,
                    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800");
            Proyecto p2 = crearProyecto("Torres del Parque", "Apartamentos con vista al parque y excelente ubicación.",
                    "Medellín", "Carrera 43A #1-50", new BigDecimal("350000000"), EstadoProyecto.ENTREGA_INMEDIATA, true,
                    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800");
            Proyecto p3 = crearProyecto("Campestre La Pradera", "Lotes campestres para construir la casa de tus sueños.",
                    "Cali", "Km 5 Vía Cali-Jamundí", new BigDecimal("150000000"), EstadoProyecto.EN_PLANOS, false,
                    "https://images.unsplash.com/photo-1600047509807-ba8f99d2cd2e?w=800");

            p1 = proyectoRepository.save(p1);
            p2 = proyectoRepository.save(p2);
            p3 = proyectoRepository.save(p3);

            viviendaRepository.save(crearVivienda("Casa Tipo A", TipoVivienda.CASA, 3, 2, 120,
                    new BigDecimal("320000000"), true, p1,
                    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800"));
            viviendaRepository.save(crearVivienda("Casa Tipo B", TipoVivienda.CASA, 4, 3, 150,
                    new BigDecimal("380000000"), true, p1,
                    "https://images.unsplash.com/photo-1605276374101-de4c0a9ecd6a?w=800"));
            viviendaRepository.save(crearVivienda("Apartamento 801", TipoVivienda.APARTAMENTO, 2, 2, 75,
                    new BigDecimal("350000000"), true, p2,
                    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"));
            viviendaRepository.save(crearVivienda("Apartamento 1202", TipoVivienda.APARTAMENTO, 3, 2, 95,
                    new BigDecimal("420000000"), false, p2,
                    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"));
            viviendaRepository.save(crearVivienda("Lote Premium", TipoVivienda.LOTE, 0, 0, 300,
                    new BigDecimal("180000000"), true, p3,
                    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800"));
            viviendaRepository.save(crearVivienda("Lote Estándar", TipoVivienda.LOTE, 0, 0, 250,
                    new BigDecimal("150000000"), true, p3,
                    "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800"));

            clienteInteresadoRepository.save(crearCliente("María González", "3001234567",
                    "maria@email.com", "Me interesa conocer más sobre las casas del proyecto.", p1));
            clienteInteresadoRepository.save(crearCliente("Carlos Ruiz", "3109876543",
                    "carlos@email.com", "Quisiera agendar una visita al apartamento 801.", p2));
            clienteInteresadoRepository.save(crearCliente("Ana López", "3205551234",
                    "ana@email.com", "Busco un lote para construir mi casa campestre.", p3));
        };
    }

    private Proyecto crearProyecto(String nombre, String descripcion, String ciudad, String direccion,
                                   BigDecimal precioDesde, EstadoProyecto estado, boolean destacado, String imagenUrl) {
        Proyecto proyecto = new Proyecto();
        proyecto.setNombre(nombre);
        proyecto.setDescripcion(descripcion);
        proyecto.setCiudad(ciudad);
        proyecto.setDireccion(direccion);
        proyecto.setPrecioDesde(precioDesde);
        proyecto.setEstado(estado);
        proyecto.setDestacado(destacado);
        proyecto.setImagenUrl(imagenUrl);
        return proyecto;
    }

    private Vivienda crearVivienda(String titulo, TipoVivienda tipo, int habitaciones, int banos,
                                   int area, BigDecimal precio, boolean disponible, Proyecto proyecto, String imagenUrl) {
        Vivienda vivienda = new Vivienda();
        vivienda.setTitulo(titulo);
        vivienda.setTipo(tipo);
        vivienda.setHabitaciones(habitaciones);
        vivienda.setBanos(banos);
        vivienda.setArea(area);
        vivienda.setPrecio(precio);
        vivienda.setDisponible(disponible);
        vivienda.setProyecto(proyecto);
        vivienda.setImagenUrl(imagenUrl);
        return vivienda;
    }

    private ClienteInteresado crearCliente(String nombre, String telefono, String correo,
                                           String mensaje, Proyecto proyecto) {
        ClienteInteresado cliente = new ClienteInteresado();
        cliente.setNombre(nombre);
        cliente.setTelefono(telefono);
        cliente.setCorreo(correo);
        cliente.setMensaje(mensaje);
        cliente.setFechaRegistro(LocalDateTime.now());
        cliente.setProyecto(proyecto);
        return cliente;
    }
}