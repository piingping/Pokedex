import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Pokedex from "./pages/pokedexList.jsx";
import PokemonDetail from "./pages/pokemonDetails.jsx";


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Pokedex />} />
        <Route path="/pokemon/:name" element={<PokemonDetail />} />
        <Route path="/search" element={<Pokedex />} />
      </Routes>
    </Router>
  );
}
