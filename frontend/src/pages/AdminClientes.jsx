import { useEffect, useMemo, useState } from 'react'
import { fecha, pedir } from '../api'
import { AdminShell, ConfirmModal, SkeletonRows } from '../ui'

export default function AdminClientes() {
  const [clientes, setClientes] = useState([])
  const [porBorrar, setPorBorrar] = useState(null)
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(true)
  const [busqueda, setBusqueda] = useState('')

  async function cargar() { return pedir('/clientes-interesados') }

  useEffect(() => {
    let activo = true
    cargar().then((lista) => { if (activo) setClientes(lista) })
      .catch((e) => { if (activo) setError(e.message) })
      .finally(() => { if (activo) setCargando(false) })
    return () => { activo = false }
  }, [])

  const filtrados = useMemo(() => clientes.filter((cliente) =>
    `${cliente.nombre} ${cliente.telefono} ${cliente.correo} ${cliente.proyectoNombre} ${cliente.mensaje}`
      .toLocaleLowerCase('es').includes(busqueda.trim().toLocaleLowerCase('es'))), [clientes, busqueda])

  async function eliminar() {
    try {
      await pedir(`/clientes-interesados/${porBorrar.id}`, { method: 'DELETE' })
      setPorBorrar(null)
      setMensaje('Registro eliminado.')
      setClientes(await cargar())
    } catch (err) {
      setPorBorrar(null)
      setError(err.message)
    }
  }

  return (
    <AdminShell titulo="Clientes interesados">
      {mensaje && <p className="toast ok" role="status">{mensaje}</p>}
      {error && <p className="toast error" role="alert">{error}</p>}
      <section className="admin-list">
        <div className="list-heading"><div><span className="eyebrow">CONTACTOS RECIBIDOS</span><h2>Registros <span className="count-pill">{filtrados.length}</span></h2></div>
          <input aria-label="Buscar clientes" type="search" placeholder="Buscar por nombre, correo o proyecto" value={busqueda} onChange={(event) => setBusqueda(event.target.value)} />
        </div>
        <div className="tabla-wrap">
          <table><thead><tr><th>Nombre</th><th>Contacto</th><th>Proyecto</th><th>Mensaje</th><th>Fecha</th><th>Acciones</th></tr></thead>
            <tbody>
              {cargando && <SkeletonRows columns={6} />}
              {!cargando && filtrados.map((cliente) => (
                <tr key={cliente.id}>
                  <td><strong>{cliente.nombre}</strong></td><td>{cliente.telefono}<br /><a href={`mailto:${cliente.correo}`}>{cliente.correo}</a></td>
                  <td>{cliente.proyectoNombre}</td><td className="message-cell">{cliente.mensaje}</td><td>{fecha(cliente.fechaRegistro)}</td>
                  <td><button type="button" className="boton peligro mini" onClick={() => setPorBorrar(cliente)}>Eliminar</button></td>
                </tr>
              ))}
              {!cargando && !filtrados.length && <tr><td colSpan="6" className="table-empty">No hay clientes que coincidan con la búsqueda.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
      {porBorrar && <ConfirmModal titulo="¿Eliminar este contacto?" mensaje={`Se eliminará el registro de ${porBorrar.nombre}. Esta acción no se puede deshacer.`} onConfirmar={eliminar} onCancelar={() => setPorBorrar(null)} />}
    </AdminShell>
  )
}
