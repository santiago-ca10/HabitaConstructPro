import { useEffect, useMemo, useState } from 'react'
import { ESTADOS, dinero, pedir } from '../api'
import { AdminShell, ConfirmModal, SkeletonRows } from '../ui'

const vacio = {
  nombre: '', descripcion: '', ciudad: '', direccion: '', precioDesde: '',
  imagenUrl: '', estado: 'EN_PLANOS', destacado: false,
}

export default function AdminProyectos() {
  const [proyectos, setProyectos] = useState([])
  const [form, setForm] = useState(vacio)
  const [editando, setEditando] = useState(null)
  const [porBorrar, setPorBorrar] = useState(null)
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [cargando, setCargando] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [formAbierto, setFormAbierto] = useState(false)

  async function cargar() { return pedir('/proyectos') }

  useEffect(() => {
    let activo = true
    cargar().then((lista) => { if (activo) setProyectos(lista) })
      .catch((e) => { if (activo) setError(e.message) })
      .finally(() => { if (activo) setCargando(false) })
    return () => { activo = false }
  }, [])

  const filtrados = useMemo(() => proyectos.filter((item) =>
    `${item.nombre} ${item.ciudad} ${ESTADOS[item.estado] || item.estado}`.toLocaleLowerCase('es')
      .includes(busqueda.trim().toLocaleLowerCase('es'))), [proyectos, busqueda])

  function cambiar(event) {
    const { name, value, type, checked } = event.target
    setForm((actual) => ({ ...actual, [name]: type === 'checkbox' ? checked : value }))
  }

  function editar(proyecto) {
    setEditando(proyecto.id)
    setFormAbierto(true)
    setMensaje('')
    setError('')
    setForm({
      nombre: proyecto.nombre, descripcion: proyecto.descripcion, ciudad: proyecto.ciudad,
      direccion: proyecto.direccion || '', precioDesde: proyecto.precioDesde,
      imagenUrl: proyecto.imagenUrl || '', estado: proyecto.estado, destacado: Boolean(proyecto.destacado),
    })
  }

  async function guardar(event) {
    event.preventDefault()
    setMensaje('')
    setError('')
    setGuardando(true)
    const cuerpo = {
      ...form,
      direccion: form.direccion || null,
      precioDesde: Number(form.precioDesde),
      imagenUrl: form.imagenUrl || null,
      destacado: Boolean(form.destacado),
    }
    try {
      await pedir(editando ? `/proyectos/${editando}` : '/proyectos', {
        method: editando ? 'PUT' : 'POST',
        body: JSON.stringify(cuerpo),
      })
      setMensaje(editando ? 'Proyecto actualizado.' : 'Proyecto creado.')
      setForm(vacio)
      setEditando(null)
      setFormAbierto(false)
      setProyectos(await cargar())
    } catch (err) {
      setError(err.message)
    } finally {
      setGuardando(false)
    }
  }

  async function eliminar() {
    setError('')
    try {
      await pedir(`/proyectos/${porBorrar.id}`, { method: 'DELETE' })
      if (editando === porBorrar.id) {
        setEditando(null)
        setFormAbierto(false)
        setForm(vacio)
      }
      setPorBorrar(null)
      setMensaje('Proyecto eliminado.')
      setProyectos(await cargar())
    } catch (err) {
      setPorBorrar(null)
      setError(err.message)
    }
  }

  return (
    <AdminShell titulo="Proyectos">
      {mensaje && <p className="toast ok" role="status">{mensaje}</p>}
      {error && <p className="toast error" role="alert">{error}</p>}
      <div className="projects-dashboard">
        <section className="project-stats" aria-label="Resumen de proyectos">
          <article className="project-stat">
            <span className="project-stat-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z" /></svg></span>
            <div><strong>{proyectos.length}</strong><span>Proyectos registrados</span></div>
          </article>
          <article className="project-stat">
            <span className="project-stat-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></svg></span>
            <div><strong>{new Set(proyectos.map((proyecto) => proyecto.ciudad.toLocaleLowerCase('es'))).size}</strong><span>Ciudades</span></div>
          </article>
          <article className="project-stat">
            <span className="project-stat-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m12 3 2.3 5.2 5.7.5-4.3 3.8 1.3 5.5-5-2.9-5 2.9 1.3-5.5L4 8.7l5.7-.5L12 3Z" /><path d="m19 16 .8 1.8 1.9.2-1.4 1.2.4 1.8-1.7-1-1.7 1 .4-1.8-1.4-1.2 1.9-.2L19 16Z" /></svg></span>
            <div><strong>{proyectos.filter((proyecto) => proyecto.destacado).length}</strong><span>Destacados en inicio</span></div>
          </article>
        </section>

        {formAbierto && (
          <form className="caja project-form" onSubmit={guardar}>
            <div className="project-form-heading">
              <span className="eyebrow">{editando ? 'ACTUALIZACIÓN' : 'NUEVO REGISTRO'}</span>
              <h2>{editando ? 'Editar proyecto' : 'Crear proyecto'}</h2>
            </div>
            <div className="project-form-fields">
              <div><label htmlFor="nombre">Nombre</label><input id="nombre" name="nombre" value={form.nombre} onChange={cambiar} required /></div>
              <div><label htmlFor="ciudad">Ciudad</label><input id="ciudad" name="ciudad" value={form.ciudad} onChange={cambiar} required /></div>
              <div className="project-field-wide"><label htmlFor="descripcion">Descripción</label><textarea id="descripcion" name="descripcion" value={form.descripcion} onChange={cambiar} required /></div>
              <div><label htmlFor="direccion">Dirección</label><input id="direccion" name="direccion" value={form.direccion} onChange={cambiar} /></div>
              <div><label htmlFor="precioDesde">Precio desde</label><input id="precioDesde" name="precioDesde" type="number" min="1" value={form.precioDesde} onChange={cambiar} required /></div>
              <div><label htmlFor="imagenUrl">URL de la imagen</label><input id="imagenUrl" name="imagenUrl" value={form.imagenUrl} onChange={cambiar} /></div>
              <div><label htmlFor="estado">Estado</label><select id="estado" name="estado" value={form.estado} onChange={cambiar}>
                {Object.entries(ESTADOS).map(([valor, texto]) => <option key={valor} value={valor}>{texto}</option>)}
              </select></div>
            </div>
            <label className="check"><input type="checkbox" name="destacado" checked={form.destacado} onChange={cambiar} /> Destacado en inicio</label>
            <div className="acciones">
              <button className="boton" disabled={guardando}>{guardando ? 'Guardando…' : editando ? 'Guardar cambios' : 'Crear proyecto'}</button>
              <button type="button" className="boton secundario" onClick={() => { setEditando(null); setForm(vacio); setFormAbierto(false) }}>Cancelar</button>
            </div>
          </form>
        )}

        <section className="admin-list project-list">
          <div className="list-heading">
            <div><span className="eyebrow">PORTAFOLIO</span><h2>Proyectos <span className="count-pill">{filtrados.length}</span></h2></div>
            <div className="list-controls">
              <input aria-label="Buscar proyectos" type="search" placeholder="Buscar por nombre o ciudad" value={busqueda} onChange={(event) => setBusqueda(event.target.value)} />
              <button type="button" className="boton" onClick={() => { setEditando(null); setForm(vacio); setFormAbierto(!formAbierto) }}>
                {formAbierto ? 'Cerrar formulario' : '+ Nuevo proyecto'}
              </button>
            </div>
          </div>
          <div className="tabla-wrap">
            <table><thead><tr><th>Proyecto</th><th>Ciudad</th><th>Estado</th><th>Precio desde</th><th>Acciones</th></tr></thead>
              <tbody>
                {cargando && <SkeletonRows columns={5} />}
                {!cargando && filtrados.map((proyecto) => (
                  <tr key={proyecto.id}>
                    <td><strong>{proyecto.nombre}</strong></td><td>{proyecto.ciudad}</td>
                    <td><span className={`badge estado-${proyecto.estado.toLowerCase()}`}>{ESTADOS[proyecto.estado] || proyecto.estado}</span></td>
                    <td>{dinero(proyecto.precioDesde)}</td>
                    <td className="acciones">
                      <button type="button" className="boton secundario mini" onClick={() => editar(proyecto)}>Editar</button>
                      <button type="button" className="boton peligro mini" onClick={() => setPorBorrar(proyecto)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
                {!cargando && !filtrados.length && <tr><td colSpan="5" className="table-empty">No hay proyectos que coincidan con la búsqueda.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>
      </div>
      {porBorrar && <ConfirmModal titulo="¿Eliminar este proyecto?" mensaje={`Se eliminará “${porBorrar.nombre}”. Esta acción no se puede deshacer.`} onConfirmar={eliminar} onCancelar={() => setPorBorrar(null)} />}
    </AdminShell>
  )
}
