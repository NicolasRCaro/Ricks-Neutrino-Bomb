import "./Informativa.css"
import rickImg from "../assets/Rick.jpg"
function Informativa() {
  return (
    <section className="informativo">
      <h1>Rick's Neutrino Bomb</h1>
      <h2>Nicolás Ramírez Caro</h2>
      <img src={rickImg} className="logo" /> <br />
      <p id="desc">APP con información de personajes de la serie Rick and Morty y con el juego de la bomba de neutrino de Rick</p> <br />
      <p>
        https://github.com/NicolasRCaro/Ricks-Neutrino-Bomb<br />
        v 1.0
      </p>
    </section>
  )
}

export default Informativa