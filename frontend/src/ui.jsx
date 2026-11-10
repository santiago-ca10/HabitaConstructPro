// useState guarda un dato que puede cambiar, por ejemplo si la foto falló.
import { useState } from 'react'
// Link abre otra pantalla. NavLink hace lo mismo y marca el enlace actual.
import { Link, NavLink } from 'react-router-dom'
// Textos y formato de precio que están en api.js.
import { ESTADOS, TIPOS, dinero } from './api'

// Tres enlaces que se ven dentro de Administración.
export function MenuAdmin() {
  return (
    <aside className="admin-sidebar">
      <span className="eyebrow">PANEL DE CONTROL</span>
      <NavLink to="/admin/proyectos">Proyectos</NavLink>
      <NavLink to="/admin/viviendas">Viviendas</NavLink>
      <NavLink to="/admin/clientes">Clientes interesados</NavLink>
    </aside>
  )
}

export function AdminShell({ titulo, children }) {
  return (
    <main className="pagina admin-page">
      <div className="page-heading"><span className="eyebrow">GESTIÓN HABITA</span><h1>{titulo}</h1></div>
      <div className="admin-layout">
        <MenuAdmin />
        <section className="admin-content">{children}</section>
      </div>
    </main>
  )
}

export function ConfirmModal({ titulo, mensaje, onConfirmar, onCancelar }) {
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onCancelar()
    }}>
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-titulo">
        <span className="modal-icon">!</span>
        <h2 id="modal-titulo">{titulo}</h2>
        <p>{mensaje}</p>
        <div className="acciones">
          <button type="button" className="boton secundario" onClick={onCancelar}>Cancelar</button>
          <button type="button" className="boton peligro" onClick={onConfirmar}>Sí, eliminar</button>
        </div>
      </section>
    </div>
  )
}

export function SkeletonRows({ columns = 5, rows = 4 }) {
  return Array.from({ length: rows }, (_, row) => (
    <tr key={row} className="skeleton-row">
      {Array.from({ length: columns }, (_, column) => <td key={column}><span /></td>)}
    </tr>
  ))
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
        <div className="card-meta"><span>{proyecto.ciudad}</span><span className={`badge estado-${proyecto.estado?.toLowerCase()}`}>{ESTADOS[proyecto.estado] || proyecto.estado}</span></div>
        <p className="precio">Desde {dinero(proyecto.precioDesde)}</p>
        <span className="card-link">Conocer proyecto <b>↗</b></span>
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
        <div className="card-meta"><span className="badge badge-gold">{TIPOS[vivienda.tipo] || vivienda.tipo}</span><span className={`badge ${vivienda.disponible ? 'badge-success' : 'badge-muted'}`}>{vivienda.disponible ? 'Disponible' : 'No disponible'}</span></div>
        <p className="muted">{vivienda.proyectoNombre}</p>
        <p>{vivienda.habitaciones} hab. <span aria-hidden="true">·</span> {vivienda.banos} baños <span aria-hidden="true">·</span> {vivienda.area} m²</p>
        <p className="precio">{dinero(vivienda.precio)}</p>
      </div>
    </article>
  )
}