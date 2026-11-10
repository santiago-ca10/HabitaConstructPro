import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { guardarToken, pedir } from '../api'

export default function Login() {
  const location = useLocation()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState(new URLSearchParams(location.search).has('expired')
    ? 'Tu sesión expiró o no tienes permiso'
    : '')
  const [cargando, setCargando] = useState(false)

  async function iniciarSesion(event) {
    event.preventDefault()
    setError('')
    setCargando(true)
    try {
      const resultado = await pedir('/auth/login', {
        method: 'POST',
        body: JSON.stringify(form),
      })
      if (!guardarToken(resultado.token)) {
        setError('No fue posible guardar la sesión en este navegador.')
        return
      }
      navigate('/admin/proyectos', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }

  return (
    <main className="login-page">
      <section className="login-visual">
        <div><span className="eyebrow">ADMINISTRACIÓN HABITA</span><h1>Decisiones que construyen futuro.</h1><p>Accede a tu espacio de gestión de proyectos, viviendas y clientes.</p></div>
        <span className="login-visual-note">HABITA · COLOMBIA</span>
      </section>
      <section className="login-form-wrap">
        <form className="login-form" onSubmit={iniciarSesion}>
          <span className="eyebrow">BIENVENIDO DE NUEVO</span>
          <h2>Ingresar al panel</h2>
          <p>Usa tus credenciales de administrador.</p>
          {error && <div className="toast error" role="alert">{error}</div>}
          <label htmlFor="username">Usuario</label>
          <input id="username" name="username" autoComplete="username" value={form.username}
            onChange={(event) => setForm({ ...form, username: event.target.value })} required />
          <label htmlFor="password">Contraseña</label>
          <input id="password" name="password" type="password" autoComplete="current-password" value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })} required />
          <button className="boton" disabled={cargando}>{cargando ? 'Ingresando…' : 'Ingresar'}</button>
        </form>
      </section>
    </main>
  )
}
