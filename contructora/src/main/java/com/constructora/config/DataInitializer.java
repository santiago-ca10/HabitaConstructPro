package com.constructora.config;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.constructora.entity.ClienteInteresado;
import com.constructora.entity.Proyecto;
import com.constructora.entity.Vivienda;
import com.constructora.enums.EstadoProyecto;
import com.constructora.enums.TipoVivienda;
import com.constructora.repository.ClienteInteresadoRepository;
import com.constructora.repository.ProyectoRepository;
import com.constructora.repository.ViviendaRepository;

@Configuration 
public class DataInitializer {

    private final ProyectoRepository proyectoRepository;

    DataInitializer(ProyectoRepository proyectoRepository) {
        this.proyectoRepository = proyectoRepository;
    }

    @Bean 
    CommandLineRunner initData(ViviendaRepository viviendaRepository,
                               ClienteInteresadoRepository clienteInteresadoRepository) {

        return args -> {
            if (proyectoRepository.count() > 0) {
                return;
            }

            Proyecto p1 = crearProyecto(
                    "Altos de la Montaña",
                    "Proyecto residencial con zonas verdes y vista panorámica.",
                    "Medellín",
                    "Carrera 35 # 12-40",
                    "320000000",
                    EstadoProyecto.EN_CONSTRUCCION,
                    true);
            Proyecto p2 = crearProyecto(
                    "Reserva del Río",
                    "Conjunto de viviendas cerca de servicios y zonas comerciales.",
                    "Rionegro",
                    "Calle 42 # 18-20",
                    "285000000",
                    EstadoProyecto.EN_PLANOS,
                    true);
            Proyecto p3 = crearProyecto(
                    "Parques de Envigado",
                    "Proyecto familiar con acceso a parques y transporte público.",
                    "Envigado",
                    "Avenida El Poblado # 25 Sur-60",
                    "410000000",
                    EstadoProyecto.ENTREGA_INMEDIATA,
                    false);

            proyectoRepository.save(p1);
            proyectoRepository.save(p2);
            proyectoRepository.save(p3);

            viviendaRepository.save(crearVivienda(
                    "Casa Roble", TipoVivienda.CASA, 3, 2, 110, "420000000", p1));
            viviendaRepository.save(crearVivienda(
                    "Apartamento Cedro", TipoVivienda.APARTAMENTO, 2, 2, 78, "320000000", p1));
            viviendaRepository.save(crearVivienda(
                    "Casa Arrayán", TipoVivienda.CASA, 3, 3, 125, "380000000", p2));
            viviendaRepository.save(crearVivienda(
                    "Apartamento Guayacán", TipoVivienda.APARTAMENTO, 2, 2, 82, "285000000", p2));
            viviendaRepository.save(crearVivienda(
                    "Casa Nogal", TipoVivienda.CASA, 4, 3, 145, "560000000", p3));
            viviendaRepository.save(crearVivienda(
                    "Apartamento Olivo", TipoVivienda.APARTAMENTO, 3, 2, 96, "410000000", p3));

            clienteInteresadoRepository.save(crearCliente(
                    "Laura Gómez",
                    "3001234567",
                    "laura.gomez@example.com",
                    "Estoy interesada en conocer las opciones de financiación.",
                    p1));
            clienteInteresadoRepository.save(crearCliente(
                    "Andrés Martínez",
                    "3102345678",
                    "andres.martinez@example.com",
                    "Quisiera agendar una visita al proyecto.",
                    p2));
            clienteInteresadoRepository.save(crearCliente(
                    "Camila Restrepo",
                    "3203456789",
                    "camila.restrepo@example.com",
                    "Deseo recibir información sobre disponibilidad.",
                    p3));
        };
    }

    private Proyecto crearProyecto(
            String nombre,
            String descripcion,
            String ciudad,
            String direccion,
            String precioDesde,
            EstadoProyecto estado,
            Boolean destacado) {
        Proyecto proyecto = new Proyecto();
        proyecto.setNombre(nombre);
        proyecto.setDescripcion(descripcion);
        proyecto.setCiudad(ciudad);
        proyecto.setDireccion(direccion);
        proyecto.setPrecioDesde(new BigDecimal(precioDesde));
        proyecto.setEstado(estado);
        proyecto.setDestacado(destacado);
        return proyecto;
    }

    private Vivienda crearVivienda(
            String titulo,
            TipoVivienda tipo,
            Integer habitaciones,
            Integer banos,
            Integer area,
            String precio,
            Proyecto proyecto) {
        Vivienda vivienda = new Vivienda();
        vivienda.setTitulo(titulo);
        vivienda.setTipo(tipo);
        vivienda.setHabitaciones(habitaciones);
        vivienda.setBanos(banos);
        vivienda.setArea(area);
        vivienda.setPrecio(new BigDecimal(precio));
        vivienda.setProyecto(proyecto);
        return vivienda;
    }

    private ClienteInteresado crearCliente(
            String nombre,
            String telefono,
            String correo,
            String mensaje,
            Proyecto proyecto) {
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