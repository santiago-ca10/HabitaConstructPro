
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ESTADOS, dinero, pedir } from '../api'
import FormularioInteres from '../FormularioInteres'
import { Foto, TarjetaVivienda } from '../ui'

export default function DetalleProyecto() {
  // id sale de la dirección. En /proyectos/1, id vale "1".
  const { id } = useParams()
  const [resultado, setResultado] = useState(null)

  // Cada vez que cambia el id, vuelve a pedir ese proyecto y sus viviendas.
  useEffect(() => {
    let activo = true
    // Las dos peticiones salen juntas y se espera a que terminen las dos.
    Promise.all([
      pedir('/proyectos/' + id),
      pedir('/proyectos/' + id + '/viviendas'),
    ])
      .then(([datos, lista]) => {
        if (activo) setResultado({ id, proyecto: datos, viviendas: lista })
      })
      .catch((e) => {
        if (activo) setResultado({ id, error: e.message })
      })
    return () => { activo = false }
  }, [id])

  if (!resultado || resultado.id !== id) return <main className="pagina"><p>Cargando...</p></main>

  // Si el backend no encontró el proyecto, se muestra el error y un regreso.
  if (resultado.error) {
    return (
      <main className="pagina">
        <p className="error">{resultado.error}</p>
        <Link to="/proyectos">Volver a proyectos</Link>
      </main>
    )
  }

  // Mientras los datos no llegan, no se intenta leer el nombre.
  const { proyecto, viviendas } = resultado

  return (
    <main className="pagina">
      <Link className="back-link" to="/proyectos">← Volver a proyectos</Link>
      <div className="detail-layout">
        <section className="detail-content">
          <span className="eyebrow">{proyecto.ciudad} · {ESTADOS[proyecto.estado] || proyecto.estado}</span>
          <h1>{proyecto.nombre}</h1>
          <Foto src={proyecto.imagenUrl} alt={proyecto.nombre} grande />
          <div className="detail-facts"><span>Desde <strong>{dinero(proyecto.precioDesde)}</strong></span><span>{proyecto.direccion}</span></div>
          <p className="detail-description">{proyecto.descripcion}</p>
          <div className="section-title"><div><span className="eyebrow">OPCIONES PARA TI</span><h2>Viviendas del proyecto</h2></div></div>
          {viviendas.length === 0 && <p>Este proyecto aún no tiene viviendas.</p>}
          <div className="grid">
            {viviendas.map((vivienda) => <TarjetaVivienda key={vivienda.id} vivienda={vivienda} />)}
          </div>
        </section>
        <aside className="detail-form"><FormularioInteres proyectoId={proyecto.id} proyectoNombre={proyecto.nombre} /></aside>
      </div>
    </main>
  )
}
