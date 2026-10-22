import { useEffect, useState } from 'react'
import { pedir } from '../api'
import { TarjetaProyecto } from '../ui'

export default function Proyectos() {
  const [proyectos, setProyectos] = useState([])
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(true)

  // Al abrir la pantalla, pide la lista completa.
  useEffect(() => {
    pedir('/proyectos')
      .then(setProyectos)
      .catch((e) => setError(e.message))
      .finally(() => setCargando(false))
  }, [])

  return (
    <main className="pagina">
      <h1>Proyectos</h1>
      {error && <p className="error">{error}</p>}
      {cargando && <p>Cargando...</p>}
      {!cargando && proyectos.length === 0 && !error && <p>No hay proyectos registrados.</p>}
      {/* map recorre la lista y dibuja una tarjeta por proyecto. */}
      <div className="grid">
        {proyectos.map((proyecto) => (
          <TarjetaProyecto key={proyecto.id} proyecto={proyecto} />
        ))}
      </div>
    </main>
  )
}
