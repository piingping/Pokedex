import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PokemonCard from "../components/pokemonCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

export default function Pokedex() {
  const [allPokemonList, setAllPokemonList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [limit, setLimit] = useState(24);
  const [notFound, setNotFound] = useState(false);

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

  const handleSearch = () => {
    setSearchTerm(inputValue.trim());
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const filteredList = allPokemonList.filter((pokemon) => {
    const trimmed = searchTerm.trim();

    if (/^\d+$/.test(trimmed)) {
      return Number(pokemon.id) === Number(trimmed);
    }

    return pokemon.name.toLowerCase().includes(trimmed.toLowerCase());
  });

  useEffect(() => {
    const trimmed = searchTerm.trim();

    if (!trimmed) return;

    const fetchFallbackPokemon = async () => {
      try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${trimmed.toLowerCase()}`);
        if (!res.ok) {
          setNotFound(true);
          return;
        }
        const data = await res.json();
        const fallback = {
          id: data.id,
          name: data.name,
          url: `https://pokeapi.co/api/v2/pokemon/${data.id}`,
        };
        setAllPokemonList([fallback]);
        setLimit(1);
        setNotFound(false);
      } catch (e) {
        setNotFound(true);
      }
    };

    if (filteredList.length === 0) {
      fetchFallbackPokemon();
    } else {
      setNotFound(false);
    }
  }, [searchTerm]);

  const visibleList = (searchTerm
    ? filteredList
    : allPokemonList.slice(0, limit)
  ).filter((p) => !!p && !!p.id);

  return (
    <div className="mother-container">
      {/* Search Bar */}
      <div className="searchbar-container">
        <p className="searchbar-title">Search Pokémon</p>
        <div className="searchbar-wrapper">
          <input
            type="text"
            placeholder="Enter name or Pokémon ID"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="seacrbar"
          />
          <button onClick={handleSearch} className="search-button">
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
        </div>
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
          <button className="load-more-btn" onClick={() => setLimit(limit + 20)}>
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
