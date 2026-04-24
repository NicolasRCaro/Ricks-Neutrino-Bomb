import { BrowserRouter as Router, Route, Routes, Link } from "react-router";
import "./App.css"
import Home from "./Home/Home"
import Original from "./Original/Original"
import Favoritos from "./Favoritos/Favoritos"
import Informativa from "./Informativa/Informativa"
import Usuario from "./Usuario/Usuario"
import Personaje from "./Personaje/Personaje"

 
function App() {
  return (
    <Router>
      <nav className="c-menu">
        <Link to="/">Home</Link>
        <Link to="/favoritos">Favoritos</Link>
        <Link to="/original">Original</Link>
        <Link to="/informativa">Informativa</Link>
        <Link to="/usuario">Usuario</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/favoritos" element={<Favoritos />} />
        <Route path="/original" element={<Original />} />
        <Route path="/informativa" element={<Informativa />} />
        <Route path="/usuario" element={<Usuario />} />
        <Route path="/personaje/:id" element={<Personaje />} />
      </Routes>
    </Router>
  )
}
 
export default App