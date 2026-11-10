import { useEffect, useState } from 'react'
import { Link, Navigate, NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import AdminClientes from './pages/AdminClientes'
import AdminProyectos from './pages/AdminProyectos'
import AdminViviendas from './pages/AdminViviendas'
import Contacto from './pages/Contacto'
import DetalleProyecto from './pages/DetallesProyecto'
import Inicio from './pages/Inicio'
import Login from './pages/Login'
import Proyectos from './pages/Proyectos'
import Viviendas from './pages/Viviendas'
import { borrarToken, leerToken } from './api'

function RutaProtegida({ children }) {
  const location = useLocation()
  return leerToken()
    ? children
    : <Navigate to="/login" replace state={{ from: location.pathname }} />
}

function Navegacion({ tema, cambiarTema }) {
  const [menuAbierto, setMenuAbierto] = useState(false)
  const navigate = useNavigate()
  const cerrarSesion = () => {
    borrarToken()
    setMenuAbierto(false)
    navigate('/')
  }
  const enlaceAdmin = leerToken()
    ? <>
      <NavLink to="/admin/proyectos" onClick={() => setMenuAbierto(false)}>Administración</NavLink>
      <button className="nav-action" onClick={cerrarSesion}>Cerrar sesión</button>
    </>
    : <NavLink to="/login" onClick={() => setMenuAbierto(false)}>Ingresar</NavLink>

  return (
    <header className="site-header">
      <Link to="/" className="marca" onClick={() => setMenuAbierto(false)}>
        <span className="marca-simbolo">H</span>
        <span>HABITA <small>CONSTRUCTORA</small></span>
      </Link>
      <button
        className="menu-toggle"
        aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
        aria-expanded={menuAbierto}
        onClick={() => setMenuAbierto(!menuAbierto)}
      >
        <span /><span /><span />
      </button>
      <nav className={menuAbierto ? 'site-nav abierto' : 'site-nav'}>
        <NavLink to="/" end onClick={() => setMenuAbierto(false)}>Inicio</NavLink>
        <NavLink to="/proyectos" onClick={() => setMenuAbierto(false)}>Proyectos</NavLink>
        <NavLink to="/viviendas" onClick={() => setMenuAbierto(false)}>Viviendas</NavLink>
        <NavLink to="/contacto" onClick={() => setMenuAbierto(false)}>Contacto</NavLink>
        {enlaceAdmin}
        <button className="theme-toggle" onClick={cambiarTema} aria-label="Cambiar modo de color">
          {tema === 'oscuro' ? '☼' : '☾'} <span>{tema === 'oscuro' ? 'Claro' : 'Oscuro'}</span>
        </button>
      </nav>
    </header>
  )
}

export default function App() {
  const [tema, setTema] = useState(() => {
    try {
      return localStorage.getItem('habita-tema') === 'oscuro' ? 'oscuro' : 'claro'
    } catch {
      return 'claro'
    }
  })

  useEffect(() => {
    document.documentElement.dataset.tema = tema
  }, [tema])

  function cambiarTema() {
    const nuevoTema = tema === 'oscuro' ? 'claro' : 'oscuro'
    setTema(nuevoTema)
    try {
      localStorage.setItem('habita-tema', nuevoTema)
    } catch {
      // La preferencia queda aplicada en memoria si el navegador bloquea el almacenamiento.
    }
  }

  return (
    <div className="app-shell">
      <Navegacion tema={tema} cambiarTema={cambiarTema} />
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/proyectos" element={<Proyectos />} />
        <Route path="/proyectos/:id" element={<DetalleProyecto />} />
        <Route path="/viviendas" element={<Viviendas />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Navigate to="/admin/proyectos" replace />} />
        <Route path="/admin/proyectos" element={<RutaProtegida><AdminProyectos /></RutaProtegida>} />
        <Route path="/admin/viviendas" element={<RutaProtegida><AdminViviendas /></RutaProtegida>} />
        <Route path="/admin/clientes" element={<RutaProtegida><AdminClientes /></RutaProtegida>} />
        <Route path="*" element={<main className="pagina"><h1>Página no encontrada</h1><Link to="/">Volver al inicio</Link></main>} />
      </Routes>
      <footer className="site-footer">
        <div className="footer-column footer-brand">
          <Link to="/" className="marca"><span className="marca-simbolo">H</span><span>HABITA <small>CONSTRUCTORA</small></span></Link>
          <p>Construimos espacios para vivir bien y proyectos con futuro.</p>
        </div>
        <div className="footer-column">
          <h3>Explora</h3>
          <Link to="/proyectos">Proyectos</Link>
          <Link to="/viviendas">Viviendas</Link>
          <Link to="/contacto">Contacto</Link>
        </div>
        <div className="footer-column">
          <h3>Hablemos</h3>
          <p>Bogotá, Colombia</p>
          <a href="mailto:contacto@habitaconstructora.com">contacto@habitaconstructora.com</a>
          <a href="tel:+576015550199">601 555 0199</a>
        </div>
        <p className="footer-legal">© {new Date().getFullYear()} Habita Constructora. Todos los derechos reservados.</p>
      </footer>
    </div>
  )
}
