import { useState, useEffect, useCallback } from "react"
import "./Original.css"

interface Personaje {
  id: number
  name: string
  image: string
}

// Pool fijo — sin fetch, sin CORS
const PERSONAJES_POOL: Personaje[] = [
  { id: 1,  name: "Rick Sanchez",              image: "https://rickandmortyapi.com/api/character/avatar/1.jpeg" },
  { id: 2,  name: "Morty Smith",               image: "https://rickandmortyapi.com/api/character/avatar/2.jpeg" },
  { id: 3,  name: "Summer Smith",              image: "https://rickandmortyapi.com/api/character/avatar/3.jpeg" },
  { id: 4,  name: "Beth Smith",                image: "https://rickandmortyapi.com/api/character/avatar/4.jpeg" },
  { id: 5,  name: "Jerry Smith",               image: "https://rickandmortyapi.com/api/character/avatar/5.jpeg" },
  { id: 6,  name: "Abadango Cluster Princess", image: "https://rickandmortyapi.com/api/character/avatar/6.jpeg" },
  { id: 7,  name: "Abradolf Lincler",          image: "https://rickandmortyapi.com/api/character/avatar/7.jpeg" },
  { id: 8,  name: "Adjudicator Rick",          image: "https://rickandmortyapi.com/api/character/avatar/8.jpeg" },
  { id: 9,  name: "Agency Director",           image: "https://rickandmortyapi.com/api/character/avatar/9.jpeg" },
  { id: 10, name: "Alan Rails",                image: "https://rickandmortyapi.com/api/character/avatar/10.jpeg" },
  { id: 11, name: "Albert Einstein",           image: "https://rickandmortyapi.com/api/character/avatar/11.jpeg" },
  { id: 12, name: "Alexander",                 image: "https://rickandmortyapi.com/api/character/avatar/12.jpeg" },
  { id: 13, name: "Alien Googah",              image: "https://rickandmortyapi.com/api/character/avatar/13.jpeg" },
  { id: 14, name: "Alien Morty",               image: "https://rickandmortyapi.com/api/character/avatar/14.jpeg" },
  { id: 15, name: "Alien Rick",                image: "https://rickandmortyapi.com/api/character/avatar/15.jpeg" },
  { id: 16, name: "Amish Cyborg",              image: "https://rickandmortyapi.com/api/character/avatar/16.jpeg" },
  { id: 17, name: "Annie",                     image: "https://rickandmortyapi.com/api/character/avatar/17.jpeg" },
  { id: 18, name: "Antenna Morty",             image: "https://rickandmortyapi.com/api/character/avatar/18.jpeg" },
  { id: 19, name: "Antenna Rick",              image: "https://rickandmortyapi.com/api/character/avatar/19.jpeg" },
  { id: 20, name: "Ants in my Eyes Johnson",   image: "https://rickandmortyapi.com/api/character/avatar/20.jpeg" },
]

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

  // Sin fetch — trabaja solo con el pool en memoria
  const cargarPersonaje = useCallback(() => {
    setSeleccion(null)
    setCorrecto(null)

    const mezclados = shuffle(PERSONAJES_POOL)
    const personajeCorrecto = mezclados[0]
    const opcionesFinales = shuffle(mezclados.slice(0, 4))

    setPersonaje(personajeCorrecto)
    setOpciones(opcionesFinales)
    setEstado("jugando")
  }, [])

  // Carga inicial — sin fetch
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