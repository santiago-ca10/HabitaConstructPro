// useState guarda lo que la persona escribe. useEffect pide datos al aparecer.
import { useEffect, useState } from 'react'
// pedir envía el formulario al backend.
import { pedir } from './api'

// Valores vacíos. Sirven para limpiar el formulario después de enviarlo.
const vacio = { nombre: '', telefono: '', correo: '', mensaje: '' }

// proyectoId y proyectoNombre llegan solo cuando ya se está dentro de un proyecto.
export default function FormularioInteres({ proyectoId, proyectoNombre }) {
  // Lista de proyectos para el selector, cuando la persona todavía no eligió uno.
  const [proyectos, setProyectos] = useState([])
  // Lo que está escrito en cada campo.
  const [form, setForm] = useState({ ...vacio, proyectoId: proyectoId || '' })
  // Texto verde si salió bien, texto rojo si falló.
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')
  // Evita que el botón se pulse dos veces mientras se envía.
  const [enviando, setEnviando] = useState(false)

  // Al aparecer el formulario, prepara el proyecto.
  useEffect(() => {
    // Si ya estamos en un proyecto, solo guarda su número.
    if (proyectoId) return

    let activo = true
    // Si no, pide todos los proyectos para llenar la lista desplegable.
    pedir('/proyectos')
      .then((lista) => {
        if (activo) setProyectos(lista)
      })
      .catch((e) => {
        if (activo) setError(e.message)
      })
    return () => { activo = false }
  }, [proyectoId])

  // Cada vez que se escribe en un campo, actualiza solo ese campo.
  function cambiar(e) {
    setForm((actual) => ({ ...actual, [e.target.name]: e.target.value }))
  }

  // Se ejecuta al pulsar Enviar.
  async function enviar(e) {
    // Evita que el navegador recargue la página.
    e.preventDefault()
    setMensaje('')
    setError('')
    setEnviando(true)
    try {
      // POST crea un cliente interesado en la base de datos.
      await pedir('/clientes-interesados', {
        method: 'POST',
        body: JSON.stringify({ ...form, proyectoId: Number(proyectoId || form.proyectoId) }),
      })
      setForm({ ...vacio, proyectoId: proyectoId || '' })
      setMensaje('Recibimos tu interés. Te contactaremos pronto.')
    } catch (err) {
      setError(err.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form className="caja" onSubmit={enviar}>
      <h2>Quiero más información</h2>
      {/* Si el proyecto ya se conoce, se muestra su nombre. Si no, se elige de una lista. */}
      {proyectoId ? (
        <p>Proyecto: <strong>{proyectoNombre}</strong></p>
      ) : (
        <>
          <label htmlFor="proyectoId">Proyecto</label>
          <select id="proyectoId" name="proyectoId" value={form.proyectoId} onChange={cambiar} required>
            <option value="">Selecciona un proyecto</option>
            {proyectos.map((proyecto) => (
              <option key={proyecto.id} value={proyecto.id}>{proyecto.nombre}</option>
            ))}
          </select>
        </>
      )}
      {/* Campos que la persona llena. required obliga a no dejarlos vacíos. */}
      <label htmlFor="nombre">Nombre</label>
      <input id="nombre" name="nombre" value={form.nombre} onChange={cambiar} required />
      <label htmlFor="telefono">Teléfono</label>
      <input id="telefono" name="telefono" value={form.telefono} onChange={cambiar} required />
      <label htmlFor="correo">Correo</label>
      <input id="correo" name="correo" type="email" value={form.correo} onChange={cambiar} required />
      <label htmlFor="mensaje">Mensaje</label>
      <textarea id="mensaje" name="mensaje" value={form.mensaje} onChange={cambiar} required />
      <button className="boton" disabled={enviando}>{enviando ? 'Enviando...' : 'Enviar'}</button>
      {/* Mensajes de resultado. Solo aparece el que tenga texto. */}
      {mensaje && <p className="toast ok" role="status">{mensaje}</p>}
      {error && <p className="toast error" role="alert">{error}</p>}
    </form>
  )
}
