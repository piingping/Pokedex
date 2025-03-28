import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PokemonCard from "../components/pokemonCard";

export default function Pokedex() {
  const [allPokemonList, setAllPokemonList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [limit, setLimit] = useState(24);

  useEffect(() => {
    fetch(`https://pokeapi.co/api/v2/pokemon?limit=1300`)
      .then((res) => res.json())
      .then((data) => {
        const list = data.results.map((p, i) => ({
          id: i + 1,
          name: p.name,
          url: p.url,
        }));
        setAllPokemonList(list);
      });
  }, []);

  const filteredList = allPokemonList.filter((pokemon) => {
    const trimmed = searchTerm.trim();

    // ถ้าเป็นตัวเลข
    if (/^\d+$/.test(trimmed)) {
      return Number(pokemon.id) === Number(trimmed);
    }

    // ถ้าเป็นชื่อ
    return pokemon.name.toLowerCase().includes(trimmed.toLowerCase());
  });

  const [notFound, setNotFound] = useState(false)

useEffect(() => {
  const trimmed = searchTerm.trim()

  if (!trimmed) return

  const fetchFallbackPokemon = async () => {
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${trimmed.toLowerCase()}`)
      if (!res.ok) {
        setNotFound(true)
        return
      }
      const data = await res.json()
      const fallback = {
        id: data.id,
        name: data.name,
        url: `https://pokeapi.co/api/v2/pokemon/${data.id}`
      }
      setAllPokemonList([fallback])
      setLimit(1)
      setNotFound(false)
    } catch (e) {
      setNotFound(true)
    }
  }

  if (filteredList.length === 0) {
    fetchFallbackPokemon()
  } else {
    setNotFound(false)
  }
}, [searchTerm])


  const visibleList = (searchTerm
    ? filteredList
    : allPokemonList.slice(0, limit)
  ).filter(p => !!p && !!p.id) 
  

  {visibleList.map((pokemon) =>
    pokemon && pokemon.id ? (
      <PokemonCard key={pokemon.id} id={pokemon.id} />
    ) : null
  )}
  

  return (
    <div className="mother-container">
      {/*  Search Bar */}
      <div className="searchbar-container">
        <p className="searchbar-title">Search Pokémon</p>
        <input
          type="text"
          placeholder="Enter name or Pokémon ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="seacrbar"
        />
      </div>

      {/* Pokémon Grid */}
      <div className="main-wrapper">
      <div className="card-container">
        {visibleList.length > 0 ? (
          visibleList.map((pokemon) => (
            <PokemonCard key={pokemon.id} id={pokemon.id} />
          ))
        ) : (
          <p className="text-center text-gray-400">No results found.</p>
        )}
      </div>
      </div>

      {/* Load More */}
      {!searchTerm && (
        <div className="load-more-container">
          <button
            className="load-more-btn"
            onClick={() => setLimit(limit + 20)}
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
