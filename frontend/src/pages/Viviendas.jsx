import { useEffect, useState } from 'react'
import { pedir } from '../api'
import { TarjetaVivienda } from '../ui'

export default function Viviendas() {
  const [viviendas, setViviendas] = useState([])
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(true)

  // Al abrir la pantalla, pide todas las viviendas.
  useEffect(() => {
    pedir('/viviendas')
      .then(setViviendas)
      .catch((e) => setError(e.message))
      .finally(() => setCargando(false))
  }, [])

  return (
    <main className="pagina">
      <h1>Viviendas</h1>
      {error && <p className="error">{error}</p>}
      {cargando && <p>Cargando...</p>}
      {!cargando && viviendas.length === 0 && !error && <p>No hay viviendas registradas.</p>}
      <div className="grid">
        {viviendas.map((vivienda) => (
          <TarjetaVivienda key={vivienda.id} vivienda={vivienda} />
        ))}
      </div>
    </main>
  )
}
