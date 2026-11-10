import { useEffect, useMemo, useState } from 'react'
import { TIPOS, dinero, pedir } from '../api'
import { AdminShell, ConfirmModal, SkeletonRows } from '../ui'

const vacio = {
  titulo: '', tipo: 'CASA', habitaciones: 2, banos: 2, area: '', precio: '',
  imagenUrl: '', disponible: true, proyectoId: '',
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
  const [cargando, setCargando] = useState(true)
  const [busqueda, setBusqueda] = useState('')

  async function cargar() { return Promise.all([pedir('/viviendas'), pedir('/proyectos')]) }

  useEffect(() => {
    let activo = true
    cargar().then(([lista, listaProyectos]) => {
      if (activo) { setViviendas(lista); setProyectos(listaProyectos) }
    }).catch((e) => { if (activo) setError(e.message) })
      .finally(() => { if (activo) setCargando(false) })
    return () => { activo = false }
  }, [])

  const filtradas = useMemo(() => viviendas.filter((item) =>
    `${item.titulo} ${item.proyectoNombre} ${TIPOS[item.tipo] || item.tipo}`.toLocaleLowerCase('es')
      .includes(busqueda.trim().toLocaleLowerCase('es'))), [viviendas, busqueda])

  function cambiar(event) {
    const { name, value, type, checked } = event.target
    setForm((actual) => ({ ...actual, [name]: type === 'checkbox' ? checked : value }))
  }

  function editar(vivienda) {
    setEditando(vivienda.id)
    setMensaje('')
    setError('')
    setForm({
      titulo: vivienda.titulo, tipo: vivienda.tipo, habitaciones: vivienda.habitaciones,
      banos: vivienda.banos, area: vivienda.area, precio: vivienda.precio,
      imagenUrl: vivienda.imagenUrl || '', disponible: Boolean(vivienda.disponible),
      proyectoId: vivienda.proyectoId,
    })
  }

  async function guardar(event) {
    event.preventDefault()
    setMensaje('')
    setError('')
    setGuardando(true)
    const cuerpo = {
      ...form, habitaciones: Number(form.habitaciones), banos: Number(form.banos),
      area: Number(form.area), precio: Number(form.precio), imagenUrl: form.imagenUrl || null,
      disponible: Boolean(form.disponible), proyectoId: Number(form.proyectoId),
    }
    try {
      await pedir(editando ? `/viviendas/${editando}` : '/viviendas', {
        method: editando ? 'PUT' : 'POST',
        body: JSON.stringify(cuerpo),
      })
      setMensaje(editando ? 'Vivienda actualizada.' : 'Vivienda creada.')
      setForm(vacio)
      setEditando(null)
      const [lista, listaProyectos] = await cargar()
      setViviendas(lista)
      setProyectos(listaProyectos)
    } catch (err) {
      setError(err.message)
    } finally {
      setGuardando(false)
    }
  }

  async function eliminar() {
    try {
      await pedir(`/viviendas/${porBorrar.id}`, { method: 'DELETE' })
      if (editando === porBorrar.id) { setEditando(null); setForm(vacio) }
      setPorBorrar(null)
      setMensaje('Vivienda eliminada.')
      const [lista, listaProyectos] = await cargar()
      setViviendas(lista)
      setProyectos(listaProyectos)
    } catch (err) {
      setPorBorrar(null)
      setError(err.message)
    }
  }

  return (
    <AdminShell titulo="Viviendas">
      {mensaje && <p className="toast ok" role="status">{mensaje}</p>}
      {error && <p className="toast error" role="alert">{error}</p>}
      <div className="admin">
        <form className="caja admin-form" onSubmit={guardar}>
          <span className="eyebrow">{editando ? 'ACTUALIZACIÓN' : 'NUEVO REGISTRO'}</span>
          <h2>{editando ? 'Editar vivienda' : 'Crear vivienda'}</h2>
          <label htmlFor="titulo">Título</label><input id="titulo" name="titulo" value={form.titulo} onChange={cambiar} required />
          <div className="fila">
            <div><label htmlFor="tipo">Tipo</label><select id="tipo" name="tipo" value={form.tipo} onChange={cambiar}>{Object.entries(TIPOS).map(([key, text]) => <option key={key} value={key}>{text}</option>)}</select></div>
            <div><label htmlFor="proyectoId">Proyecto</label><select id="proyectoId" name="proyectoId" value={form.proyectoId} onChange={cambiar} required><option value="">Selecciona un proyecto</option>{proyectos.map((proyecto) => <option key={proyecto.id} value={proyecto.id}>{proyecto.nombre}</option>)}</select></div>
          </div>
          <div className="fila">
            <div><label htmlFor="habitaciones">Habitaciones</label><input id="habitaciones" name="habitaciones" type="number" min="0" value={form.habitaciones} onChange={cambiar} required /></div>
            <div><label htmlFor="banos">Baños</label><input id="banos" name="banos" type="number" min="0" value={form.banos} onChange={cambiar} required /></div>
          </div>
          <div className="fila">
            <div><label htmlFor="area">Área (m²)</label><input id="area" name="area" type="number" min="1" value={form.area} onChange={cambiar} required /></div>
            <div><label htmlFor="precio">Precio</label><input id="precio" name="precio" type="number" min="1" value={form.precio} onChange={cambiar} required /></div>
          </div>
          <label htmlFor="imagenUrl">URL de la imagen</label><input id="imagenUrl" name="imagenUrl" value={form.imagenUrl} onChange={cambiar} />
          <label className="check"><input type="checkbox" name="disponible" checked={form.disponible} onChange={cambiar} /> Disponible</label>
          <div className="acciones">
            <button className="boton" disabled={guardando}>{guardando ? 'Guardando…' : editando ? 'Guardar cambios' : 'Crear vivienda'}</button>
            {editando && <button type="button" className="boton secundario" onClick={() => { setEditando(null); setForm(vacio) }}>Cancelar</button>}
          </div>
        </form>

        <section className="admin-list">
          <div className="list-heading"><div><span className="eyebrow">INVENTARIO</span><h2>Registros <span className="count-pill">{filtradas.length}</span></h2></div>
            <input aria-label="Buscar viviendas" type="search" placeholder="Buscar por vivienda o proyecto" value={busqueda} onChange={(event) => setBusqueda(event.target.value)} />
          </div>
          <div className="tabla-wrap">
            <table><thead><tr><th>Vivienda</th><th>Tipo</th><th>Proyecto</th><th>Precio</th><th>Acciones</th></tr></thead>
              <tbody>
                {cargando && <SkeletonRows columns={5} />}
                {!cargando && filtradas.map((vivienda) => (
                  <tr key={vivienda.id}>
                    <td><strong>{vivienda.titulo}</strong></td><td><span className="badge badge-gold">{TIPOS[vivienda.tipo] || vivienda.tipo}</span></td>
                    <td>{vivienda.proyectoNombre}</td><td>{dinero(vivienda.precio)}</td>
                    <td className="acciones"><button type="button" className="boton secundario mini" onClick={() => editar(vivienda)}>Editar</button><button type="button" className="boton peligro mini" onClick={() => setPorBorrar(vivienda)}>Eliminar</button></td>
                  </tr>
                ))}
                {!cargando && !filtradas.length && <tr><td colSpan="5" className="table-empty">No hay viviendas que coincidan con la búsqueda.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>
      </div>
      {porBorrar && <ConfirmModal titulo="¿Eliminar esta vivienda?" mensaje={`Se eliminará “${porBorrar.titulo}”. Esta acción no se puede deshacer.`} onConfirmar={eliminar} onCancelar={() => setPorBorrar(null)} />}
    </AdminShell>
  )
}
