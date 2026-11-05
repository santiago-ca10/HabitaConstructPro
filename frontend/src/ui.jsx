// useState guarda un dato que puede cambiar, por ejemplo si la foto falló.
import { useState } from 'react'
// Link abre otra pantalla. NavLink hace lo mismo y marca el enlace actual.
import { Link, NavLink } from 'react-router-dom'
// Textos y formato de precio que están en api.js.
import { ESTADOS, TIPOS, dinero } from './api'

// Tres enlaces que se ven dentro de Administración.
export function MenuAdmin() {
  return (
    <nav className="subnav">
      <NavLink to="/admin/proyectos">Proyectos</NavLink>
      <NavLink to="/admin/viviendas">Viviendas</NavLink>
      <NavLink to="/admin/clientes">Clientes</NavLink>
    </nav>
  )
}

// Muestra una imagen. Si no hay dirección o la imagen no carga, muestra un aviso.
export function Foto({ src, alt, grande }) {
  // rota pasa a verdadero cuando el navegador no pudo cargar la imagen.
  const [rota, setRota] = useState(false)
  // grande cambia la altura. Se usa en el detalle del proyecto.
  const clase = grande ? 'foto grande' : 'foto'
  if (!src || rota) return <div className={`${clase} vacia`}>Sin imagen</div>
  return <img className={clase} src={src} alt={alt} onError={() => setRota(true)} />
}

// Tarjeta de un proyecto. Al hacer clic abre su detalle.
export function TarjetaProyecto({ proyecto }) {
  return (
    <Link className="tarjeta" to={`/proyectos/${proyecto.id}`}>
      <Foto src={proyecto.imagenUrl} alt={proyecto.nombre} />
      <div className="cuerpo">
        <h2>{proyecto.nombre}</h2>
        <p>{proyecto.ciudad} · {ESTADOS[proyecto.estado] || proyecto.estado}</p>
        <p className="precio">Desde {dinero(proyecto.precioDesde)}</p>
      </div>
    </Link>
  )
}

// Tarjeta de una vivienda: tipo, medidas, precio y si está disponible.
export function TarjetaVivienda({ vivienda }) {
  return (
    <article className="tarjeta">
      <Foto src={vivienda.imagenUrl} alt={vivienda.titulo} />
      <div className="cuerpo">
        <h2>{vivienda.titulo}</h2>
        <p>{TIPOS[vivienda.tipo] || vivienda.tipo} · {vivienda.proyectoNombre}</p>
        <p>{vivienda.habitaciones} hab. · {vivienda.banos} baños · {vivienda.area} m²</p>
        <p className="precio">{dinero(vivienda.precio)}</p>
        <p>{vivienda.disponible ? 'Disponible' : 'No disponible'}</p>
      </div>
    </article>
  )
}