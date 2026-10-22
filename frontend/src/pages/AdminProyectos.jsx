import { useEffect, useState } from 'react'
import { ESTADOS, dinero, pedir } from '../api'
import { MenuAdmin } from '../ui'

// Formulario en blanco. Se usa al empezar y después de guardar.
const vacio = {
  nombre: '',
  descripcion: '',
  ciudad: '',
  direccion: '',
  precioDesde: '',
  imagenUrl: '',
  estado: 'EN_PLANOS',
  destacado: false,
}

export default function AdminProyectos() {
  // La tabla, lo escrito en el formulario y avisos de éxito o error.
  const [proyectos, setProyectos] = useState([])
  const [form, setForm] = useState(vacio)
  // Si editando tiene un número, se está modificando ese proyecto. Si es null, se está creando.
  const [editando, setEditando] = useState(null)
  // Guarda el id que está a punto de borrarse, para mostrar los botones Sí y No.
  const [porBorrar, setPorBorrar] = useState(null)
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')
  const [guardando, setGuardando] = useState(false)

  // Trae de nuevo la lista y la pone en la tabla.
  async function cargar() {
    setProyectos(await pedir('/proyectos'))
  }

  // Al abrir la pantalla, carga los proyectos.
  useEffect(() => {
    cargar().catch((e) => setError(e.message))
  }, [])

  // Actualiza el campo que la persona acaba de cambiar. El checkbox usa checked, no value.
  function cambiar(e) {
    const { name, value, type, checked } = e.target
    setForm((actual) => ({ ...actual, [name]: type === 'checkbox' ? checked : value }))
  }

  // Copia un proyecto de la tabla al formulario para modificarlo.
  function editar(proyecto) {
    setEditando(proyecto.id)
    setMensaje('')
    setError('')
    setForm({
      nombre: proyecto.nombre,
      descripcion: proyecto.descripcion,
      ciudad: proyecto.ciudad,
      direccion: proyecto.direccion || '',
      precioDesde: proyecto.precioDesde,
      imagenUrl: proyecto.imagenUrl || '',
      estado: proyecto.estado,
      destacado: Boolean(proyecto.destacado),
    })
  }

  // Crea un proyecto nuevo o actualiza el que se está editando.
  async function guardar(e) {
    e.preventDefault()
    setMensaje('')
    setError('')
    setGuardando(true)
    // El cuerpo es el paquete de datos que entiende el backend.
    const cuerpo = {
      nombre: form.nombre,
      descripcion: form.descripcion,
      ciudad: form.ciudad,
      direccion: form.direccion || null,
      precioDesde: Number(form.precioDesde),
      imagenUrl: form.imagenUrl || null,
      estado: form.estado,
      destacado: Boolean(form.destacado),
    }
    try {
      if (editando) {
        await pedir('/proyectos/' + editando, { method: 'PUT', body: JSON.stringify(cuerpo) })
        setMensaje('Proyecto actualizado.')
      } else {
        await pedir('/proyectos', { method: 'POST', body: JSON.stringify(cuerpo) })
        setMensaje('Proyecto creado.')
      }
      setForm(vacio)
      setEditando(null)
      await cargar()
    } catch (err) {
      setError(err.message)
    } finally {
      setGuardando(false)
    }
  }

  // Borra el proyecto. Si tiene viviendas o clientes, el backend no deja y se avisa.
  async function eliminar(id) {
    setMensaje('')
    setError('')
    try {
      await pedir('/proyectos/' + id, { method: 'DELETE' })
      if (editando === id) {
        setEditando(null)
        setForm(vacio)
      }
      setPorBorrar(null)
      setMensaje('Proyecto eliminado.')
      await cargar()
    } catch {
      setPorBorrar(null)
      setError('No se puede eliminar: primero quita sus viviendas y clientes.')
    }
  }

  return (
    <main className="pagina">
      <h1>Administrar proyectos</h1>
      <MenuAdmin />
      {mensaje && <p className="ok">{mensaje}</p>}
      {error && <p className="error">{error}</p>}
      <div className="admin">
        {/* Formulario de alta o de edición. */}
        <form className="caja" onSubmit={guardar}>
          <h2>{editando ? 'Editar proyecto' : 'Nuevo proyecto'}</h2>
          <label htmlFor="nombre">Nombre</label>
          <input id="nombre" name="nombre" value={form.nombre} onChange={cambiar} required />
          <label htmlFor="descripcion">Descripción</label>
          <textarea id="descripcion" name="descripcion" value={form.descripcion} onChange={cambiar} required />
          <label htmlFor="ciudad">Ciudad</label>
          <input id="ciudad" name="ciudad" value={form.ciudad} onChange={cambiar} required />
          <label htmlFor="direccion">Dirección</label>
          <input id="direccion" name="direccion" value={form.direccion} onChange={cambiar} />
          <label htmlFor="precioDesde">Precio desde</label>
          <input id="precioDesde" name="precioDesde" type="number" min="1" value={form.precioDesde} onChange={cambiar} required />
          <label htmlFor="imagenUrl">URL de la imagen</label>
          <input id="imagenUrl" name="imagenUrl" value={form.imagenUrl} onChange={cambiar} />
          <label htmlFor="estado">Estado</label>
          <select id="estado" name="estado" value={form.estado} onChange={cambiar}>
            {Object.entries(ESTADOS).map(([valor, texto]) => (
              <option key={valor} value={valor}>{texto}</option>
            ))}
          </select>
          <label className="check">
            <input type="checkbox" name="destacado" checked={form.destacado} onChange={cambiar} />
            Destacado en el inicio
          </label>
          <div className="acciones">
            <button className="boton" disabled={guardando}>{editando ? 'Guardar cambios' : 'Crear proyecto'}</button>
            {editando && (
              <button type="button" className="boton secundario" onClick={() => { setEditando(null); setForm(vacio) }}>
                Cancelar
              </button>
            )}
          </div>
        </form>

        {/* Tabla con los proyectos que ya están guardados. */}
        <div className="tabla-wrap">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Ciudad</th>
                <th>Estado</th>
                <th>Precio</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {proyectos.map((proyecto) => (
                <tr key={proyecto.id}>
                  <td>{proyecto.nombre}</td>
                  <td>{proyecto.ciudad}</td>
                  <td>{ESTADOS[proyecto.estado] || proyecto.estado}</td>
                  <td>{dinero(proyecto.precioDesde)}</td>
                  <td className="acciones">
                    <button type="button" className="boton secundario mini" onClick={() => editar(proyecto)}>Editar</button>
                    {/* El primer clic pregunta. El segundo confirma o cancela. */}
                    {porBorrar === proyecto.id ? (
                      <>
                        <button type="button" className="boton peligro mini" onClick={() => eliminar(proyecto.id)}>Sí</button>
                        <button type="button" className="boton secundario mini" onClick={() => setPorBorrar(null)}>No</button>
                      </>
                    ) : (
                      <button type="button" className="boton peligro mini" onClick={() => setPorBorrar(proyecto.id)}>Eliminar</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}
