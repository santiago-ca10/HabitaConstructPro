import { useEffect, useState } from 'react'
import { fecha, pedir } from '../api'
import { MenuAdmin } from '../ui'


export default function AdminClientes(){
    const [clientes, setClientes] = useState([])
    const [porBorrar, setPorBorrar] = useState(null)
    const [mensaje, setMensaje] = useState('')
    const [error, setError] = useState('')
    const [cargando, setCargando] = useState(true)

    async function cargar() {
        setClientes(await pedir('/clientes-interesados'))

    }
    useEffect(() => {
        cargar()
            .catch((e) => setError(e.message))
            .finally(() => setCargando(false))
    }, [])

    //borra un registro despues de confirmar con un si
    async function eliminar(id) {
        setMensaje('')
        setError('')
        try {
            await pedir('/clientes-interesados' + id, { method: 'DELETE' })
            setPorBorrar(null)
            setMensaje('Cliente eliminado')
            await cargar()
        } catch (err) {
            setPorBorrar(null)
            setError(err.message)
        }
    }

return (
    <main className="pagina">
      <h1>Clientes interesados</h1>
      <MenuAdmin />
      {mensaje && <p className="ok">{mensaje}</p>}
      {error && <p className="error">{error}</p>}
      {cargando && <p>Cargando...</p>}
      {!cargando && clientes.length === 0 && !error && <p>No hay clientes registrados.</p>}
      {/* La tabla solo se dibuja si hay al menos un cliente. */}
      {clientes.length > 0 && (
        <div className="tabla-wrap">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Contacto</th>
                <th>Proyecto</th>
                <th>Mensaje</th>
                <th>Fecha</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((cliente) => (
                <tr key={cliente.id}>
                  <td>{cliente.nombre}</td>
                  <td>{cliente.telefono}<br />{cliente.correo}</td>
                  <td>{cliente.proyectoNombre}</td>
                  <td>{cliente.mensaje}</td>
                  <td>{fecha(cliente.fechaRegistro)}</td>
                  <td className="acciones">
                    {porBorrar === cliente.id ? (
                      <>
                        <button type="button" className="boton peligro mini" onClick={() => eliminar(cliente.id)}>Sí</button>
                        <button type="button" className="boton secundario mini" onClick={() => setPorBorrar(null)}>No</button>
                      </>
                    ) : (
                      <button type="button" className="boton peligro mini" onClick={() => setPorBorrar(cliente.id)}>Eliminar</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}
