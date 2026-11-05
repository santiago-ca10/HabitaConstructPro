
export const ESTADOS = {
    EN_PLANOS: 'En planos',
    EN_CONSTRUCCION: 'En construcción',
    ENTREGA_INMEDIATA: 'Entrega inmediata',
    FINALIZADO: 'Finalizado',
}

export const TIPOS = {
    CASA: 'Casa',
    APARTAMENTO: 'Apartamento',
    LOTE: 'Lote',
}

export function dinero(valor) {
    return Number(valor).toLocaleString('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0,
    })
}

// Convierte la fecha que manda el backend en una fecha legible.
export function fecha(valor) {
    if (!valor) return ''
    // A veces la fecha llega como lista: año, mes, día, hora, minuto.
    if (Array.isArray(valor)) {
        const [anio, mes, dia, hora = 0, minuto = 0] = valor
        return new Date(anio, mes - 1, dia, hora, minuto).toLocaleString('es-CO')
    }
    const date = new Date(valor)
    return Number.isNaN(date.getTime()) ? String(valor) : date.toLocaleString('es-CO')
}

/*
  Pide o envía datos al backend.
  ruta es lo que va después de /api. Ejemplo: '/proyectos'.
  opciones sirve para crear, editar o borrar. Si no se envía, solo consulta.
*/
export async function pedir(ruta, opciones = {}) {
    try {
        // fetch hace la llamada. /api lo reenvía Vite al puerto 8080.
        const respuesta = await fetch('/api' + ruta, {
            ...opciones,
            headers: {
                'Content-Type': 'application/json',
                ...(opciones.headers || {}),
            },
        })
        // 204 significa "listo, y no hay datos que devolver". Pasa al borrar.
        if (respuesta.status === 204) return null
        if ([502, 503, 504].includes(respuesta.status)) {
            throw new Error('No hay conexión con el backend. Inícialo en el puerto 8080.')
        }
        const datos = await respuesta.json().catch(() => ({}))
        // Si el backend rechazó la petición, se muestra su mensaje.
        if (!respuesta.ok) {
            const detalle = datos.errors ? Object.values(datos.errors).join('. ') : datos.message
            throw new Error(detalle || 'No se pudo completar la operación')
        }
        return datos
    } catch (error) {
        // TypeError suele significar que el backend no está encendido.
        if (error instanceof TypeError) {
            throw new Error('No hay conexión con el backend. Inícialo en el puerto 8080.', { cause: error })
        }
        throw error
    }
}