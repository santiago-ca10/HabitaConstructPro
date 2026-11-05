// Piezas para el menú y para decidir qué pantalla mostrar.
import { NavLink, Navigate, Route, Routes } from 'react-router-dom'
// Cada import trae una pantalla distinta.
import AdminClientes from './pages/AdminClientes'
import AdminProyectos from './pages/AdminProyectos'
import AdminViviendas from './pages/AdminViviendas'
import Contacto from './pages/Contacto'
import DetalleProyecto from './pages/DetallesProyecto'
import Inicio from './pages/Inicio'
import Proyectos from './pages/Proyectos'
import Viviendas from './pages/Viviendas'

// App es el componente principal. Se dibuja en todas las direcciones.
export default function App() {
  return (
    <>
      {/* Menú de arriba. Cada enlace abre una pantalla sin recargar el navegador. */}
      <header>
        <NavLink to="/" className="marca" end>Habita Constructora</NavLink>
        <nav>
          <NavLink to="/" end>Inicio</NavLink>
          <NavLink to="/proyectos">Proyectos</NavLink>
          <NavLink to="/viviendas">Viviendas</NavLink>
          <NavLink to="/contacto">Contacto</NavLink>
          <NavLink to="/admin/proyectos">Administración</NavLink>
        </nav>
      </header>

      {/* Según la dirección, muestra una sola de estas pantallas. */}
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/proyectos" element={<Proyectos />} />
        {/* :id es el número del proyecto. Ejemplo: /proyectos/1 */}
        <Route path="/proyectos/:id" element={<DetalleProyecto />} />
        <Route path="/viviendas" element={<Viviendas />} />
        <Route path="/contacto" element={<Contacto />} />
        {/* /admin sola redirige a la administración de proyectos. */}
        <Route path="/admin" element={<Navigate to="/admin/proyectos" replace />} />
        <Route path="/admin/proyectos" element={<AdminProyectos />} />
        <Route path="/admin/viviendas" element={<AdminViviendas />} />
        <Route path="/admin/clientes" element={<AdminClientes />} />
      </Routes>

      {/* Pie de página. Se ve en todas las pantallas. */}
      <footer>
        <strong>Habita Constructora</strong>
        <p>Bogotá, Colombia · contacto@habitaconstructora.com · 601 555 0199</p>
      </footer>
    </>
  )
}