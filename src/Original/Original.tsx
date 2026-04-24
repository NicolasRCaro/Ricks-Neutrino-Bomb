import { useState, useEffect, useCallback } from "react"
import "./Original.css"

interface Personaje {
  id: number
  name: string
  image: string
}

function getRandomIds(exclude: number, total = 826, count = 3): number[] {
  const ids = new Set<number>()
  while (ids.size < count) {
    const id = Math.floor(Math.random() * total) + 1
    if (id !== exclude) ids.add(id)
  }
  return Array.from(ids)
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

type Estado = "jugando" | "perdiste" | "cargando"

function Original() {
  const [personaje, setPersonaje] = useState<Personaje | null>(null)
  const [opciones, setOpciones] = useState<Personaje[]>([])
  const [tiempo, setTiempo] = useState(60)
  const [estado, setEstado] = useState<Estado>("cargando")
  const [seleccion, setSeleccion] = useState<number | null>(null)
  const [correcto, setCorrecto] = useState<number | null>(null)
  const [puntaje, setPuntaje] = useState(0)
  const [explota, setExplota] = useState(false)

  const cargarPersonaje = useCallback(async () => {
    setEstado("cargando")
    setSeleccion(null)
    setCorrecto(null)
    try {
      const idCorrecto = Math.floor(Math.random() * 826) + 1
      const idsWrong = getRandomIds(idCorrecto)
      const todosIds = [idCorrecto, ...idsWrong]

      const res = await fetch(`https://rickandmortyapi.com/api/character/${todosIds.join(",")}`)
      const data = await res.json()
      const personajes: Personaje[] = (Array.isArray(data) ? data : [data]).map((p: Personaje) => ({
        id: p.id, name: p.name, image: p.image
      }))

      const correcto = personajes.find(p => p.id === idCorrecto)!
      setPersonaje(correcto)
      setOpciones(shuffle(personajes))
      setEstado("jugando")
    } catch (e) {
      console.error(e)
    }
  }, [])

  // Carga inicial
  useEffect(() => {
    cargarPersonaje()
  }, [cargarPersonaje])

  // Temporizador
  useEffect(() => {
    if (estado !== "jugando") return
    if (tiempo <= 0) {
      setExplota(true)
      setTimeout(() => {
        setExplota(false)
        setEstado("perdiste")
      }, 1200)
      return
    }
    const timer = setInterval(() => setTiempo(t => t - 1), 1000)
    return () => clearInterval(timer)
  }, [estado, tiempo])

  const elegir = (opcion: Personaje) => {
    if (seleccion !== null || estado !== "jugando") return
    setSeleccion(opcion.id)
    setCorrecto(personaje!.id)

    if (opcion.id === personaje!.id) {
      setPuntaje(p => p + 1)
      setTiempo(t => Math.min(t + 15, 120))
      setTimeout(() => cargarPersonaje(), 1000)
    } else {
      setTiempo(t => Math.max(t - 10, 0))
      setTimeout(() => cargarPersonaje(), 1000)
    }
  }

  const reiniciar = () => {
    setPuntaje(0)
    setTiempo(60)
    setEstado("cargando")
    cargarPersonaje()
  }

  const pct = Math.min((tiempo / 120) * 100, 100)
  const barColor = tiempo > 30 ? "rgb(254,217,37)" : tiempo > 10 ? "#ff9800" : "#f44336"

  if (explota) return (
    <div className="explosion">
      <div className="boom">💥</div>
      <p>BOOM</p>
    </div>
  )

  if (estado === "perdiste") return (
    <div className="game-over">
      <h1>💣 BOMBA DE NEUTRINO DETONADA</h1>
      <p className="go-score">Puntaje final: <span>{puntaje}</span></p>
      <button onClick={reiniciar}>Intentar de nuevo</button>
    </div>
  )

  if (estado === "cargando" || !personaje) return (
    <div className="game-loading">
      <div className="spinner" />
      <p>Cargando...</p>
    </div>
  )

  return (
    <div className="original-container">

      <div className="hud">
        <div className="hud-puntaje">Puntaje: <span>{puntaje}</span></div>
        <div className="hud-timer">
          <div className="timer-bar-bg">
            <div className="timer-bar" style={{ width: `${pct}%`, backgroundColor: barColor }} />
          </div>
          <span className="timer-num" style={{ color: barColor }}>{tiempo}s</span>
        </div>
      </div>

      <div className="game-area">
        <img src={personaje.image} alt="?" className="personaje-pregunta" />

        <div className="opciones">
          <p className="pregunta-texto">¿Quién es este personaje?</p>
          {opciones.map((op) => {
            let clase = "opcion"
            if (seleccion !== null) {
              if (op.id === correcto) clase += " correcta"
              else if (op.id === seleccion) clase += " incorrecta"
            }
            return (
              <button key={op.id} className={clase} onClick={() => elegir(op)}>
                {op.name}
              </button>
            )
          })}
        </div>
      </div>

    </div>
  )
}

export default Original