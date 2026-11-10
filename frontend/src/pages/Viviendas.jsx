import { useEffect, useMemo, useState } from 'react'
import { TIPOS, pedir } from '../api'
import { TarjetaVivienda } from '../ui'

export default function Viviendas() {
  const [ciudades, setCiudades] = useState([])
  const [ciudad, setCiudad] = useState('')
  const [viviendas, setViviendas] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [tipo, setTipo] = useState('')
  const [disponibilidad, setDisponibilidad] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    pedir('/proyectos/ciudades').then(setCiudades).catch((e) => setError(e.message))
  }, [])

  useEffect(() => {
    let activo = true
    pedir('/viviendas' + (ciudad ? `?ciudad=${encodeURIComponent(ciudad)}` : ''))
      .then((lista) => { if (activo) setViviendas(lista) })
      .catch((e) => { if (activo) setError(e.message) })
      .finally(() => { if (activo) setCargando(false) })
    return () => { activo = false }
  }, [ciudad])

  const resultados = useMemo(() => viviendas.filter((vivienda) => {
    const termino = busqueda.trim().toLocaleLowerCase('es')
    return (!termino || `${vivienda.titulo} ${vivienda.proyectoNombre}`.toLocaleLowerCase('es').includes(termino))
      && (!tipo || vivienda.tipo === tipo)
      && (disponibilidad === '' || String(vivienda.disponible) === disponibilidad)
  }), [viviendas, busqueda, tipo, disponibilidad])

  return (
    <main className="pagina">
      <div className="page-heading"><span className="eyebrow">ENCUENTRA TU LUGAR</span><h1>Viviendas disponibles</h1><p>Opciones pensadas para cada forma de vivir.</p></div>
      <div className="filter-bar">
        <label>Ciudad
          <select value={ciudad} onChange={(event) => { setError(''); setCargando(true); setCiudad(event.target.value) }}>
            <option value="">Todas</option>{ciudades.map((nombre) => <option key={nombre} value={nombre}>{nombre}</option>)}
          </select>
        </label>
        <label>Tipo
          <select value={tipo} onChange={(event) => setTipo(event.target.value)}>
            <option value="">Todos los tipos</option>{Object.entries(TIPOS).map(([key, name]) => <option key={key} value={key}>{name}</option>)}
          </select>
        </label>
        <label>Disponibilidad
          <select value={disponibilidad} onChange={(event) => setDisponibilidad(event.target.value)}>
            <option value="">Todas</option><option value="true">Disponible</option><option value="false">No disponible</option>
          </select>
        </label>
        <label className="search-field">Buscar
          <input type="search" placeholder="Vivienda o proyecto" value={busqueda} onChange={(event) => setBusqueda(event.target.value)} />
        </label>
      </div>
      {error && <p className="toast error" role="alert">{error}</p>}
      {cargando && <div className="grid">{Array.from({ length: 3 }, (_, index) => <div className="skeleton-card" key={index} />)}</div>}
      {!cargando && !error && resultados.length === 0 && <div className="empty-state"><span>⌕</span><h2>{ciudad ? 'No hay resultados para esta ciudad' : 'No encontramos viviendas'}</h2><p>Prueba cambiando los filtros o la búsqueda.</p></div>}
      {!cargando && !error && resultados.length > 0 && <p className="result-count">{resultados.length} viviendas encontradas</p>}
      <div className="grid">{!cargando && resultados.map((vivienda) => <TarjetaVivienda key={vivienda.id} vivienda={vivienda} />)}</div>
    </main>
  )
}
