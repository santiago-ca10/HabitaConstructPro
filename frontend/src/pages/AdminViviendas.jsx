import { useEffect, useState } from 'react'
import { TIPOS, dinero, pedir } from '../api'
import { MenuAdmin } from '../ui'

// Valores iniciales del formulario. Habitaciones y baños empiezan en 2.
const vacio = {
  titulo: '',
  tipo: 'CASA',
  habitaciones: 2,
  banos: 2,
  area: '',
  precio: '',
  imagenUrl: '',
  disponible: true,
  proyectoId: '',
}

export default function AdminViviendas() {
  const [viviendas, setViviendas] = useState([])
  const [proyectos, setProyectos] = useState([])
  const [form, setForm] = useState(vacio)
  const [editando, setEditando] = useState(null)
  const [porBorrar, setPorBorrar] = useState(null)
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')
  const [guardando, setGuardando] = useState(false)

  // Pide viviendas y proyectos a la vez, porque el formulario necesita las dos listas.
  async function cargar() {
    const [lista, listaProyectos] = await Promise.all([
      pedir('/viviendas'),
      pedir('/proyectos'),
    ])
    setViviendas(lista)
    setProyectos(listaProyectos)
  }

  useEffect(() => {
    cargar().catch((e) => setError(e.message))
  }, [])

  function cambiar(e) {
    const { name, value, type, checked } = e.target
    setForm((actual) => ({ ...actual, [name]: type === 'checkbox' ? checked : value }))
  }

  // Pasa una fila de la tabla al formulario.
  function editar(vivienda) {
    setEditando(vivienda.id)
    setMensaje('')
    setError('')
    setForm({
      titulo: vivienda.titulo,
      tipo: vivienda.tipo,
      habitaciones: vivienda.habitaciones,
      banos: vivienda.banos,
      area: vivienda.area,
      precio: vivienda.precio,
      imagenUrl: vivienda.imagenUrl || '',
      disponible: Boolean(vivienda.disponible),
      proyectoId: vivienda.proyectoId,
    })
  }

  // Crea o actualiza. Los números se convierten con Number porque el formulario entrega texto.
  async function guardar(e) {
    e.preventDefault()
    setMensaje('')
    setError('')
    setGuardando(true)
    const cuerpo = {
      titulo: form.titulo,
      tipo: form.tipo,
      habitaciones: Number(form.habitaciones),
      banos: Number(form.banos),
      area: Number(form.area),
      precio: Number(form.precio),
      imagenUrl: form.imagenUrl || null,
      disponible: Boolean(form.disponible),
      proyectoId: Number(form.proyectoId),
    }
    try {
      if (editando) {
        await pedir('/viviendas/' + editando, { method: 'PUT', body: JSON.stringify(cuerpo) })
        setMensaje('Vivienda actualizada.')
      } else {
        await pedir('/viviendas', { method: 'POST', body: JSON.stringify(cuerpo) })
        setMensaje('Vivienda creada.')
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

  async function eliminar(id) {
    setMensaje('')
    setError('')
    try {
      await pedir('/viviendas/' + id, { method: 'DELETE' })
      if (editando === id) {
        setEditando(null)
        setForm(vacio)
      }
      setPorBorrar(null)
      setMensaje('Vivienda eliminada.')
      await cargar()
    } catch (err) {
      setPorBorrar(null)
      setError(err.message)
    }
  }

  return (
    <main className="pagina">
      <h1>Administrar viviendas</h1>
      <MenuAdmin />
      {mensaje && <p className="ok">{mensaje}</p>}
      {error && <p className="error">{error}</p>}
      <div className="admin">
        <form className="caja" onSubmit={guardar}>
          <h2>{editando ? 'Editar vivienda' : 'Nueva vivienda'}</h2>
          <label htmlFor="titulo">Título</label>
          <input id="titulo" name="titulo" value={form.titulo} onChange={cambiar} required />
          <label htmlFor="tipo">Tipo</label>
          <select id="tipo" name="tipo" value={form.tipo} onChange={cambiar}>
            {Object.entries(TIPOS).map(([valor, texto]) => (
              <option key={valor} value={valor}>{texto}</option>
            ))}
          </select>
          {/* El proyecto es obligatorio: una vivienda siempre pertenece a uno. */}
          <label htmlFor="proyectoId">Proyecto</label>
          <select id="proyectoId" name="proyectoId" value={form.proyectoId} onChange={cambiar} required>
            <option value="">Selecciona un proyecto</option>
            {proyectos.map((proyecto) => (
              <option key={proyecto.id} value={proyecto.id}>{proyecto.nombre}</option>
            ))}
          </select>
          <div className="fila">
            <div>
              <label htmlFor="habitaciones">Habitaciones</label>
              <input id="habitaciones" name="habitaciones" type="number" min="0" value={form.habitaciones} onChange={cambiar} required />
            </div>
            <div>
              <label htmlFor="banos">Baños</label>
              <input id="banos" name="banos" type="number" min="1" value={form.banos} onChange={cambiar} required />
            </div>
          </div>
          <div className="fila">
            <div>
              <label htmlFor="area">Área (m²)</label>
              <input id="area" name="area" type="number" min="1" step="0.01" value={form.area} onChange={cambiar} required />
            </div>
            <div>
              <label htmlFor="precio">Precio</label>
              <input id="precio" name="precio" type="number" min="1" value={form.precio} onChange={cambiar} required />
            </div>
          </div>
          <label htmlFor="imagenUrl">URL de la imagen</label>
          <input id="imagenUrl" name="imagenUrl" value={form.imagenUrl} onChange={cambiar} />
          <label className="check">
            <input type="checkbox" name="disponible" checked={form.disponible} onChange={cambiar} />
            Disponible
          </label>
          <div className="acciones">
            <button className="boton" disabled={guardando}>{editando ? 'Guardar cambios' : 'Crear vivienda'}</button>
            {editando && (
              <button type="button" className="boton secundario" onClick={() => { setEditando(null); setForm(vacio) }}>
                Cancelar
              </button>
            )}
          </div>
        </form>
        <div className="tabla-wrap">
          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th>Tipo</th>
                <th>Proyecto</th>
                <th>Precio</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {viviendas.map((vivienda) => (
                <tr key={vivienda.id}>
                  <td>{vivienda.titulo}</td>
                  <td>{TIPOS[vivienda.tipo] || vivienda.tipo}</td>
                  <td>{vivienda.proyectoNombre}</td>
                  <td>{dinero(vivienda.precio)}</td>
                  <td className="acciones">
                    <button type="button" className="boton secundario mini" onClick={() => editar(vivienda)}>Editar</button>
                    {porBorrar === vivienda.id ? (
                      <>
                        <button type="button" className="boton peligro mini" onClick={() => eliminar(vivienda.id)}>Sí</button>
                        <button type="button" className="boton secundario mini" onClick={() => setPorBorrar(null)}>No</button>
                      </>
                    ) : (
                      <button type="button" className="boton peligro mini" onClick={() => setPorBorrar(vivienda.id)}>Eliminar</button>
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
