
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ESTADOS, dinero, pedir } from '../api'
import FormularioInteres from '../FormularioInteres'
import { Foto, TarjetaVivienda } from '../ui'

export default function DetalleProyecto() {
  // id sale de la dirección. En /proyectos/1, id vale "1".
  const { id } = useParams()
  const [proyecto, setProyecto] = useState(null)
  const [viviendas, setViviendas] = useState([])
  const [error, setError] = useState('')

  // Cada vez que cambia el id, vuelve a pedir ese proyecto y sus viviendas.
  useEffect(() => {
    setProyecto(null)
    setError('')
    // Las dos peticiones salen juntas y se espera a que terminen las dos.
    Promise.all([
      pedir('/proyectos/' + id),
      pedir('/proyectos/' + id + '/viviendas'),
    ])
      .then(([datos, lista]) => {
        setProyecto(datos)
        setViviendas(lista)
      })
      .catch((e) => setError(e.message))
  }, [id])

  // Si el backend no encontró el proyecto, se muestra el error y un regreso.
  if (error) {
    return (
      <main className="pagina">
        <p className="error">{error}</p>
        <Link to="/proyectos">Volver a proyectos</Link>
      </main>
    )
  }

  // Mientras los datos no llegan, no se intenta leer el nombre.
  if (!proyecto) return <main className="pagina"><p>Cargando...</p></main>

  return (
    <main className="pagina">
      <Link to="/proyectos">← Proyectos</Link>
      <h1>{proyecto.nombre}</h1>
      {/* Foto grande, textos del proyecto y el precio. */}
      <Foto src={proyecto.imagenUrl} alt={proyecto.nombre} grande />
      <p>{proyecto.descripcion}</p>
      <p>{proyecto.ciudad}{proyecto.direccion ? ` · ${proyecto.direccion}` : ''}</p>
      <p>{ESTADOS[proyecto.estado] || proyecto.estado}</p>
      <p className="precio">Desde {dinero(proyecto.precioDesde)}</p>

      <h2>Viviendas de este proyecto</h2>
      {viviendas.length === 0 && <p>Este proyecto aún no tiene viviendas.</p>}
      <div className="grid">
        {viviendas.map((vivienda) => (
          <TarjetaVivienda key={vivienda.id} vivienda={vivienda} />
        ))}
      </div>

      {/* El formulario ya sabe de qué proyecto se trata. */}
      <FormularioInteres proyectoId={proyecto.id} proyectoNombre={proyecto.nombre} />
    </main>
  )
}
