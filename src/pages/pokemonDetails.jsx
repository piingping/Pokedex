import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import TopSection from "../components/topSection";
import DetailSection from "../components/detailSection";
import AlternateForms from "../components/alternativeForms";
import EvolutionChart from "../components/evolutionChart";
import "../components/pokemonDetails.css";

export default function PokemonDetail() {
  const { name } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [species, setSpecies] = useState(null);
  const [weaknesses, setWeaknesses] = useState([]);
  const [varieties, setVarieties] = useState([]);

  useEffect(() => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
      .then((res) => res.json())
      .then((data) => setPokemon(data));
  }, [name]);

  useEffect(() => {
    if (!pokemon) return;
    fetch(pokemon.species.url)
      .then((res) => res.json())
      .then((data) => setSpecies(data));
  }, [pokemon]);

  useEffect(() => {
    if (!pokemon) return;
    const fetchWeaknesses = async () => {
      const all = await Promise.all(
        pokemon.types.map(async (t) => {
          const res = await fetch(t.type.url);
          const data = await res.json();
          return data.damage_relations.double_damage_from.map((d) => d.name);
        })
      );
      setWeaknesses([...new Set(all.flat())]);
    };
    fetchWeaknesses();
  }, [pokemon]);

  useEffect(() => {
    if (!species) return;
    const fetchVarieties = async () => {
      const forms = await Promise.all(
        species.varieties.map(async (v) => {
          const res = await fetch(v.pokemon.url);
          return res.json();
        })
      );
      setVarieties(forms);
    };
    fetchVarieties();
  }, [species]);

  

  if (!pokemon || !species) return <p className="text-white p-4">Loading {name}...</p>;

  return (
    <div className="container">
      {pokemon && (
  <div className="navigation-buttons">
    {pokemon.id > 1 ? (
      <Link to={`/pokemon/${pokemon.id - 1}`} className="nav-button">
        &lt; Previous
      </Link>
    ) : <div />}

<Link to={`/pokemon/${pokemon.id + 1}`} className="nav-button">
      Next &gt;
    </Link>
  </div>
)}


      <TopSection pokemon={pokemon} weaknesses={weaknesses} />
      <DetailSection pokemon={pokemon} species={species} />
      <AlternateForms varieties={varieties} />
      <EvolutionChart name={pokemon.name} />
    </div>
  );
}
