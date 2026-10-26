import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MAP_CONFIG } from '../lib/config'
import { GeocodeError, geocodeAddress } from '../lib/geocode'

// Pin con el ícono de FontAwesome (evita los PNG por defecto de Leaflet, que se rompen con los bundlers)
const PIN_ICON = L.divIcon({
  className: '',
  html: '<i class="fa-solid fa-location-dot text-indigo-600 drop-shadow" style="font-size:34px;line-height:1"></i>',
  iconSize: [28, 36],
  iconAnchor: [14, 36],
})

const round = (n) => Math.round(n * 1e6) / 1e6

const GEO_ERRORS = {
  1: 'Permiso de ubicación denegado. Puedes marcar el punto tocando el mapa.',
  2: 'No se pudo determinar tu ubicación. Marca el punto tocando el mapa.',
  3: 'Se agotó el tiempo para obtener tu ubicación. Marca el punto tocando el mapa.',
}

const BUTTON_CLASSES =
  'inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition disabled:opacity-50 disabled:cursor-not-allowed'

/**
 * Mapa (Leaflet + OpenStreetMap) para marcar el punto de entrega.
 *  - Tocar el mapa o arrastrar el pin define la ubicación.
 *  - "Usar mi ubicación" usa el GPS del dispositivo.
 *  - "Ubicar la dirección escrita" busca `addressQuery` con Nominatim (solo al pulsar el botón).
 * Es un componente controlado: `value` = { lat, lng } | null.
 */
export default function LocationPicker({ value, onChange, addressQuery }) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const markerRef = useRef(null)
  const onChangeRef = useRef(onChange)
  const [busy, setBusy] = useState(null) // 'geo' | 'search' | null
  const [message, setMessage] = useState({ kind: 'info', text: '' })

  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  // Crear el mapa una sola vez
  useEffect(() => {
    const map = L.map(containerRef.current, {
      center: value ? [value.lat, value.lng] : MAP_CONFIG.center,
      zoom: value ? 16 : MAP_CONFIG.zoom,
      scrollWheelZoom: false, // no secuestrar el scroll del modal; quedan los botones +/- y el doble toque
    })

    L.tileLayer(MAP_CONFIG.tileUrl, { maxZoom: 19, attribution: MAP_CONFIG.attribution }).addTo(map)

    map.on('click', (e) => {
      setMessage({ kind: 'info', text: '' })
      onChangeRef.current({ lat: round(e.latlng.lat), lng: round(e.latlng.lng) })
    })

    mapRef.current = map
    // El contenedor puede terminar de dimensionarse después del montaje (modal, carga diferida)
    const raf = requestAnimationFrame(() => map.invalidateSize())

    return () => {
      cancelAnimationFrame(raf)
      map.remove()
      mapRef.current = null
      markerRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // El pin sigue al valor (fuente de verdad: el estado del padre)
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    if (!value) {
      if (markerRef.current) {
        markerRef.current.remove()
        markerRef.current = null
      }
      return
    }

    const latlng = [value.lat, value.lng]
    if (markerRef.current) {
      markerRef.current.setLatLng(latlng)
      return
    }

    // `alt` solo aplica a íconos de imagen; para un divIcon se usan title y aria-label
    const marker = L.marker(latlng, { icon: PIN_ICON, draggable: true, title: 'Punto de entrega' }).addTo(map)
    marker.getElement()?.setAttribute('aria-label', 'Punto de entrega. Arrástralo para ajustarlo.')
    marker.on('dragend', () => {
      const p = marker.getLatLng()
      onChangeRef.current({ lat: round(p.lat), lng: round(p.lng) })
    })
    markerRef.current = marker
  }, [value])

  const moveTo = (lat, lng) => {
    mapRef.current?.setView([lat, lng], 17)
    onChangeRef.current({ lat: round(lat), lng: round(lng) })
  }

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setMessage({ kind: 'error', text: 'Tu navegador no permite obtener la ubicación. Marca el punto tocando el mapa.' })
      return
    }
    setBusy('geo')
    setMessage({ kind: 'info', text: '' })
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        moveTo(pos.coords.latitude, pos.coords.longitude)
        setMessage({ kind: 'ok', text: 'Ubicación detectada. Ajusta el pin si hace falta.' })
        setBusy(null)
      },
      (err) => {
        setMessage({ kind: 'error', text: GEO_ERRORS[err.code] ?? GEO_ERRORS[2] })
        setBusy(null)
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    )
  }

  const searchAddress = async () => {
    setBusy('search')
    setMessage({ kind: 'info', text: '' })
    try {
      const found = await geocodeAddress(addressQuery)
      if (!found) {
        setMessage({
          kind: 'error',
          text: 'No encontramos esa dirección. Prueba agregando la ciudad, o marca el punto tocando el mapa.',
        })
      } else {
        moveTo(found.lat, found.lng)
        setMessage({ kind: 'ok', text: 'Dirección ubicada. Ajusta el pin si hace falta.' })
      }
    } catch (err) {
      setMessage({
        kind: 'error',
        text: err instanceof GeocodeError ? err.message : 'No se pudo buscar la dirección.',
      })
    } finally {
      setBusy(null)
    }
  }

  const messageColor = {
    info: 'text-gray-500 dark:text-gray-400',
    ok: 'text-green-700 dark:text-green-400',
    error: 'text-red-600 dark:text-red-400',
  }[message.kind]

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
          Punto de entrega en el mapa <span className="font-normal text-gray-400">(opcional)</span>
        </label>
        {value && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="text-[11px] text-red-600 dark:text-red-400 hover:underline"
          >
            Quitar pin
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-2">
        <button type="button" onClick={useMyLocation} disabled={busy !== null} className={BUTTON_CLASSES}>
          <i className={`fa-solid ${busy === 'geo' ? 'fa-spinner animate-spin' : 'fa-crosshairs'}`}></i>
          <span>Usar mi ubicación</span>
        </button>
        <button
          type="button"
          onClick={searchAddress}
          disabled={busy !== null || !addressQuery?.trim()}
          title={addressQuery?.trim() ? '' : 'Escribe primero la dirección de entrega'}
          className={BUTTON_CLASSES}
        >
          <i className={`fa-solid ${busy === 'search' ? 'fa-spinner animate-spin' : 'fa-magnifying-glass-location'}`}></i>
          <span>Ubicar la dirección escrita</span>
        </button>
      </div>

      <div
        ref={containerRef}
        role="application"
        aria-label="Mapa para marcar el punto de entrega"
        className="relative z-0 h-56 sm:h-64 w-full rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden"
      ></div>

      <p className={`mt-1.5 text-[11px] sm:text-xs ${messageColor}`} role={message.kind === 'error' ? 'alert' : 'status'}>
        {message.text ||
          (value
            ? `Pin en ${value.lat.toFixed(5)}, ${value.lng.toFixed(5)}. Arrástralo para ajustarlo.`
            : 'Toca el mapa o usa los botones para marcar dónde entregar el pedido.')}
      </p>
    </div>
  )
}
