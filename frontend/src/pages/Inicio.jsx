import { useEffect, useState } from 'react'
// Link es el botón "Ver proyectos".
import { Link } from 'react-router-dom'
import { pedir } from '../api'
import FormularioInteres from '../FormularioInteres'
import { TarjetaProyecto } from '../ui'

export default function Inicio() {
  // proyectos guarda solo los que el backend marca como destacados.
  const [proyectos, setProyectos] = useState([])
  const [error, setError] = useState('')
  // cargando es verdadero hasta que llegue la respuesta.
  const [cargando, setCargando] = useState(true)

  // Al abrir Inicio, pide los proyectos destacados una sola vez.
  useEffect(() => {
    pedir('/proyectos/destacados')
      .then(setProyectos)
      .catch((e) => setError(e.message))
      .finally(() => setCargando(false))
  }, [])

  return (
    <>
      {/* Franja grande de bienvenida, con un botón hacia la lista. */}
      <section className="hero">
        <div className="contenido">
          <h1>Encuentra tu próxima vivienda</h1>
          <p>Proyectos en Bogotá, Medellín y Cali. Consulta precios, viviendas disponibles y déjanos tus datos.</p>
          <Link className="boton" to="/proyectos">Ver proyectos</Link>
        </div>
      </section>

      <main className="pagina">
        <h2>Proyectos destacados</h2>
        {/* Primero el error, si lo hay. Luego "Cargando...". Si no hay datos, un aviso. */}
        {error && <p className="error">{error}</p>}
        {cargando && <p>Cargando...</p>}
        {!cargando && proyectos.length === 0 && !error && <p>No hay proyectos destacados.</p>}
        {/* Una tarjeta por cada proyecto destacado. */}
        <div className="grid">
          {proyectos.map((proyecto) => (
            <TarjetaProyecto key={proyecto.id} proyecto={proyecto} />
          ))}
        </div>

        {/* Textos fijos. No vienen de la base de datos. */}
        <h2>Por qué Habita</h2>
        <div className="beneficios">
          <article className="caja"><h3>Ubicaciones claras</h3><p>Ciudad y dirección de cada proyecto.</p></article>
          <article className="caja"><h3>Precios visibles</h3><p>Sabes desde cuánto empieza cada vivienda.</p></article>
          <article className="caja"><h3>Te contactamos</h3><p>Envía tu interés y queda registrado.</p></article>
        </div>

        {/* Formulario general: la persona elige el proyecto. */}
        <FormularioInteres />
      </main>
    </>
  )
}
