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
  const [totalProyectos, setTotalProyectos] = useState(0)
  const [totalCiudades, setTotalCiudades] = useState(0)

  // Al abrir Inicio, pide los proyectos destacados una sola vez.
  useEffect(() => {
    Promise.all([pedir('/proyectos/destacados'), pedir('/proyectos'), pedir('/proyectos/ciudades')])
      .then(([destacados, todos, ciudades]) => {
        setProyectos(destacados)
        setTotalProyectos(todos.length)
        setTotalCiudades(ciudades.length)
      })
      .catch((e) => setError(e.message))
      .finally(() => setCargando(false))
  }, [])

  return (
    <>
      {/* Franja grande de bienvenida, con un botón hacia la lista. */}
      <section className="hero">
        <div className="contenido">
          <span className="eyebrow">TU HISTORIA COMIENZA AQUÍ</span>
          <h1>Un lugar propio.<br /><em>Una vida a tu manera.</em></h1>
          <p>Diseñamos espacios que se sienten como hogar, en las ciudades que te hacen crecer.</p>
          <div className="hero-actions"><Link className="boton" to="/proyectos">Descubrir proyectos <span>↗</span></Link><Link className="hero-link" to="/contacto">Hablemos de tu próximo hogar</Link></div>
        </div>
        <div className="hero-stamp"><span>HABITA</span><b>VIVIR BIEN<br />EMPIEZA AQUÍ</b></div>
      </section>

      <main className="pagina">
        <section className="stats-strip">
          <div><strong>{cargando ? '—' : totalProyectos}</strong><span>Proyectos en desarrollo</span></div>
          <div><strong>{cargando ? '—' : totalCiudades}</strong><span>Ciudades con presencia</span></div>
          <div><strong>100%</strong><span>Compromiso contigo</span></div>
        </section>
        <div className="section-title"><div><span className="eyebrow">UNA SELECCIÓN PARA TI</span><h2>Proyectos destacados</h2></div><Link to="/proyectos">Ver todos <span>↗</span></Link></div>
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
        <div className="section-title"><div><span className="eyebrow">LO QUE NOS MUEVE</span><h2>Por qué Habita</h2></div></div>
        <div className="beneficios">
          <article className="benefit-card"><span className="benefit-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s7-6.1 7-12a7 7 0 1 0-14 0c0 5.9 7 12 7 12Z" /><circle cx="12" cy="9" r="2.2" /></svg></span><h3>Ubicaciones para crecer</h3><p>Espacios bien conectados, cerca de lo que hace tu vida más fácil.</p></article>
          <article className="benefit-card"><span className="benefit-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19.5V9l8-5 8 5v10.5h-6v-6h-4v6H4Z" /><path d="M2.5 10 12 4l9.5 6" /></svg></span><h3>Diseño con intención</h3><p>Viviendas pensadas para disfrutar cada rincón y cada momento.</p></article>
          <article className="benefit-card"><span className="benefit-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4" /><path d="M4.5 21a7.5 7.5 0 0 1 15 0M17 4.5a3.5 3.5 0 0 1 0 7m2 3a6.5 6.5 0 0 1 2.5 5" /></svg></span><h3>Acompañamiento cercano</h3><p>Estamos contigo desde la primera pregunta hasta que recibes tus llaves.</p></article>
        </div>

        {/* Formulario general: la persona elige el proyecto. */}
        <FormularioInteres />
      </main>
    </>
  )
}
