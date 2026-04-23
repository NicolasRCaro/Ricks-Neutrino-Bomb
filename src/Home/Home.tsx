import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import "./Home.css"

interface Personaje {
  id: number
  name: string
  status: string
  species: string
  image: string
}

type FiltroTipo = 'todos' | 'alive' | 'dead' | 'unknown'

function Home() {
  const [personajes, setPersonajes] = useState<Personaje[]>([])
  const [filtro, setFiltro] = useState<FiltroTipo>('todos')
  const filtros: FiltroTipo[] = ['todos', 'alive', 'dead', 'unknown']
  const [busqueda, setBusqueda] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        // primer llamado del api con la pagina 1 ya pedida, se determina cuantas paginas tiene el api
        const statusParam = filtro === 'todos' ? '' : `?status=${filtro}`
        const primera = await fetch(`https://rickandmortyapi.com/api/character${statusParam}`)
        const data = await primera.json()
        // cuando se determina cuantas paginas tiene el api se llaman las siguientes sin llamar la primera
        const peticiones = Array.from({ length: data.info.pages - 1 }, (_, i) =>
          fetch(`https://rickandmortyapi.com/api/character${statusParam}${statusParam ? '&' : '?'}page=${i + 2}`)
            .then(r => r.json())
        )
        // await para renderizar las paginas llamadas y traerlas en orden
        const paginas = await Promise.all(peticiones)
        // une la pagina de la primera llamada con el resto de paginas en una sola lista
        const todos = [data.results, ...paginas.map(p => p.results)].flat()
        setPersonajes(todos)
      } catch (error) {
        console.error('Error cargando personajes:', error)
      }
    }

    fetchData()
  }, [filtro])

  const personajesFiltrados = personajes.filter((p) =>
    busqueda.length < 3 ? true : p.name.toLowerCase().includes(busqueda.toLowerCase())
  )

  const statusColor = (status: string) => {
    if (status === 'Alive') return '#4ade80'
    if (status === 'Dead') return '#f87171'
    return '#94a3b8'
  }

  return (
    <div className="home-container">

      <div className="filtros">
        {filtros.map((onestat) => (
          <button
            key={onestat}
            onClick={() => setFiltro(onestat)}
            className={filtro === onestat ? 'activo' : ''}
          >
            {onestat}
          </button>
        ))}
      </div>

      <input
        type="text"
        placeholder="Buscar personaje..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="buscador"
      />

      {personajesFiltrados.length === 0 && (
        <p className="sin-resultados">No se encontraron personajes.</p>
      )}

      <div className="personajes-grid">
        {personajesFiltrados.map((p) => (
          <Link to={`/personaje/${p.id}`} key={p.id} className="personaje-card">
            <img src={p.image} alt={p.name} className="personaje-imagen" />
            <div className="personaje-info">
              <h3 className="personaje-nombre">{p.name}</h3>
              <p className="personaje-especie">{p.species}</p>
              <span className="personaje-status" style={{ backgroundColor: statusColor(p.status) }}>
                {p.status}
              </span>
            </div>
          </Link>
        ))}
      </div>

    </div>
  )
}

export default Home