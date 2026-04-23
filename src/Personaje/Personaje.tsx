import "./personaje.css";
import { useParams } from "react-router";
import { useState, useEffect } from 'react'

interface PersonajeData {
  id: number
  name: string
  status: string
  species: string
  type: string
  gender: string
  image: string
  origin: { name: string }
  location: { name: string }
  episode: string[]
}

function Personaje() {
  const { id } = useParams<{ id: string }>()
  const [data, setData] = useState<PersonajeData | null>(null)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    if (!id) return

    const fetchData = async () => {
      try {
        const res = await fetch(`https://rickandmortyapi.com/api/character/${id}`)
        const data = await res.json()
        setData(data)
      } catch (error) {
        console.error('Error cargando personaje:', error)
      }
    }

    fetchData()

    // Verificar si ya es favorito al cargar
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]")
    setIsFavorite(favorites.includes(id))
  }, [id])

  const toggleFavorite = () => {
    if (!id) return
    let favorites = JSON.parse(localStorage.getItem("favorites") || "[]")
    if (favorites.includes(id)) {
      favorites = favorites.filter((fav: string) => fav !== id)
      setIsFavorite(false)
    } else {
      favorites.push(id)
      setIsFavorite(true)
    }
    localStorage.setItem("favorites", JSON.stringify(favorites))
  }

  if (!data) return <p>Cargando...</p>

  return (
    <div className="personaje-detalle">
      <img src={data.image} alt={data.name} className="personaje-detalle-imagen" />

      <h1>
        {data.name}
        <button onClick={toggleFavorite}>
          {isFavorite ? "❤️" : "🤍"}
        </button>
      </h1>

      <h2>Información</h2>
      <p><strong>Estado:</strong> {data.status}</p>
      <p><strong>Especie:</strong> {data.species}</p>
      <p><strong>Tipo:</strong> {data.type || 'Desconocido'}</p>
      <p><strong>Género:</strong> {data.gender}</p>

      <h2>Ubicación</h2>
      <p><strong>Origen:</strong> {data.origin.name}</p>
      <p><strong>Última ubicación:</strong> {data.location.name}</p>

      <h2>Episodios</h2>
      <p><strong>Aparece en:</strong> {data.episode.length} episodios</p>
    </div>
  )
}

export default Personaje