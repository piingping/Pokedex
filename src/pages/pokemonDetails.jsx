import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import TopSection from "@/features/pokemonDetails/topSection";
import DetailSection from "@/features/pokemonDetails/detailSection";
import AlternateForms from "@/features/pokemonDetails/alternateForms";
import EvolutionChain from "@/features/pokemonDetails/evolutionChain";
import "@/components/pokemonDetails.css";

export default function PokemonDetail() {
  const { name } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [species, setSpecies] = useState(null);
  const [weaknesses, setWeaknesses] = useState([]);
  const [varieties, setVarieties] = useState([]);

  // Load Pokemon Data
  useEffect(() => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
      .then((res) => res.json())
      .then((data) => setPokemon(data));
  }, [name]);

  // Load Species Data
  useEffect(() => {
    if (!pokemon) return;
    fetch(pokemon.species.url)
      .then((res) => res.json())
      .then((data) => setSpecies(data));
  }, [pokemon]);

  // Load Weaknesses
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

  // Load Alternate Forms
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

  // Update Tab Title and Favicon
  useEffect(() => {
    if (!pokemon) return;
    const originalTitle = document.title;
    const originalFavicon = document.querySelector("link[rel='icon']")?.href;

    // Set dynamic tab info
    document.title = `${pokemon.name} | Pokedex`;

    const favicon = document.querySelector("link[rel='icon']");
    if (favicon && pokemon.sprites?.front_default) {
      favicon.href = pokemon.sprites.front_default;
    }

    return () => {
      // Reset when unmount
      document.title = originalTitle;
      if (favicon && originalFavicon) {
        favicon.href = originalFavicon;
      }
    };
  }, [pokemon]);

  if (!pokemon || !species)
    return <p className="text-white p-4 mar">Loading {name}...</p>;

  return (
    <div className="container">
      {pokemon && (
        <div className="navigation-buttons">
          {pokemon.id > 1 ? (
            <Link to={`/pokemon/${pokemon.id - 1}`} className="nav-button">
              &lt; Previous
            </Link>
          ) : (
            <div />
          )}
          <Link to={`/pokemon/${pokemon.id + 1}`} className="nav-button">
            Next &gt;
          </Link>
        </div>
      )}

      <TopSection pokemon={pokemon} weaknesses={weaknesses} />
      <DetailSection pokemon={pokemon} species={species} />
      <AlternateForms varieties={varieties} />
      <EvolutionChain name={pokemon.name} />
    </div>
  );
}
