import { useEffect, useMemo, useState } from 'react'
import { ESTADOS, pedir } from '../api'
import { TarjetaProyecto } from '../ui'

export default function Proyectos() {
  const [ciudades, setCiudades] = useState([])
  const [ciudad, setCiudad] = useState('')
  const [proyectos, setProyectos] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [estado, setEstado] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    pedir('/proyectos/ciudades').then(setCiudades).catch((e) => setError(e.message))
  }, [])

  useEffect(() => {
    let activo = true
    pedir('/proyectos' + (ciudad ? `?ciudad=${encodeURIComponent(ciudad)}` : ''))
      .then((lista) => { if (activo) setProyectos(lista) })
      .catch((e) => { if (activo) setError(e.message) })
      .finally(() => { if (activo) setCargando(false) })
    return () => { activo = false }
  }, [ciudad])

  const resultados = useMemo(() => proyectos.filter((proyecto) => {
    const termino = busqueda.trim().toLocaleLowerCase('es')
    return (!termino || `${proyecto.nombre} ${proyecto.ciudad} ${proyecto.descripcion}`.toLocaleLowerCase('es').includes(termino))
      && (!estado || proyecto.estado === estado)
  }), [proyectos, busqueda, estado])

  return (
    <main className="pagina">
      <div className="page-heading"><span className="eyebrow">ESPACIOS PARA TU PRÓXIMA HISTORIA</span><h1>Proyectos que inspiran</h1><p>Encuentra el lugar donde empieza tu nueva etapa.</p></div>
      <div className="filter-bar">
        <label>Ciudad
          <select value={ciudad} onChange={(event) => { setError(''); setCargando(true); setCiudad(event.target.value) }}>
            <option value="">Todas</option>{ciudades.map((nombre) => <option key={nombre} value={nombre}>{nombre}</option>)}
          </select>
        </label>
        <label>Estado
          <select value={estado} onChange={(event) => setEstado(event.target.value)}>
            <option value="">Todos los estados</option>{Object.entries(ESTADOS).map(([key, name]) => <option key={key} value={key}>{name}</option>)}
          </select>
        </label>
        <label className="search-field">Buscar
          <input type="search" placeholder="Nombre, ciudad o descripción" value={busqueda} onChange={(event) => setBusqueda(event.target.value)} />
        </label>
      </div>
      {error && <p className="toast error" role="alert">{error}</p>}
      {cargando && <div className="grid">{Array.from({ length: 3 }, (_, index) => <div className="skeleton-card" key={index} />)}</div>}
      {!cargando && !error && resultados.length === 0 && <div className="empty-state"><span>⌕</span><h2>{ciudad ? 'No hay resultados para esta ciudad' : 'No encontramos proyectos'}</h2><p>Prueba cambiando los filtros o la búsqueda.</p></div>}
      {!cargando && !error && resultados.length > 0 && <p className="result-count">{resultados.length} proyectos disponibles</p>}
      <div className="grid">{!cargando && resultados.map((proyecto) => <TarjetaProyecto key={proyecto.id} proyecto={proyecto} />)}</div>
    </main>
  )
}
