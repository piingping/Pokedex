import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PokemonCard from "../components/pokemonCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router-dom";

export default function Pokedex() {
  const [allPokemonList, setAllPokemonList] = useState([]);
  const [pokemonDetailsCache, setPokemonDetailsCache] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [limit, setLimit] = useState(24);
  const [notFound, setNotFound] = useState(false);
  const [showTypeSelector, setShowTypeSelector] = useState(false);
  const location = useLocation();
  const types = [
    "normal",
    "fire",
    "water",
    "electric",
    "grass",
    "ice",
    "fighting",
    "poison",
    "ground",
    "flying",
    "psychic",
    "bug",
    "rock",
    "ghost",
    "dragon",
    "dark",
    "steel",
    "fairy",
  ];

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

  useEffect(() => {
    if (location.pathname === "/") {
      setSearchTerm("");
      setInputValue("");
      setSelectedTypes([]);
      setLimit(24);
    }
  }, [location.pathname]);

  useEffect(() => {
    const fetchDetails = async () => {
      const newDetails = {};
      const targetList = searchTerm
        ? allPokemonList
        : allPokemonList.slice(0, 150);

      await Promise.all(
        targetList.map(async (p) => {
          if (!pokemonDetailsCache[p.name]) {
            const res = await fetch(p.url);
            const data = await res.json();
            newDetails[p.name] = {
              id: data.id,
              name: data.name,
              url: p.url,
              types: data.types.map((t) => t.type.name),
              image: data.sprites.other["official-artwork"].front_default,
            };
          }
        })
      );

      setPokemonDetailsCache((prev) => ({ ...prev, ...newDetails }));
    };

    fetchDetails();
  }, [allPokemonList, searchTerm]);

  const handleSearch = () => {
    const trimmed = inputValue.trim().toLowerCase();

    if (/^\d+$/.test(trimmed)) {
      const id = Number(trimmed);
      if (id < 1 || id > 20000) {
        setNotFound(true);
        return;
      }
    }

    setSearchTerm(trimmed);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };
  const filteredList = Object.values(pokemonDetailsCache)
  .filter((pokemon) => {
    const trimmed = searchTerm.trim().toLowerCase();

    const matchesText =
      trimmed === "" ||
      pokemon.name.toLowerCase().includes(trimmed) ||
      pokemon.id === Number(trimmed);

    const matchesType =
      selectedTypes.length === 0 ||
      selectedTypes.every((type) => pokemon.types?.includes(type));

    return matchesText && matchesType;
  })
  .sort((a, b) => a.id - b.id); 

  useEffect(() => {
    const trimmed = searchTerm.trim().toLowerCase();
    if (!trimmed) return;

    if (
      /^\d+$/.test(trimmed) &&
      (Number(trimmed) < 1 || Number(trimmed) > 1025)
    ) {
      setNotFound(true);
      return;
    }

    const alreadyLoadedForms = Object.values(pokemonDetailsCache).filter((p) =>
      p.name.toLowerCase().includes(trimmed)
    );

    if (alreadyLoadedForms.length >= 2) {
      setNotFound(false);
      return;
    }

    const fetchFallbackPokemon = async () => {
      try {
        console.log("[DEBUG] Fetching species data for:", trimmed);

        const speciesRes = await fetch(
          `https://pokeapi.co/api/v2/pokemon-species/${trimmed}`
        );
        if (!speciesRes.ok) {
          setNotFound(true);
          return;
        }

        const speciesData = await speciesRes.json();
        const altForms = speciesData.varieties
          .map((v) => ({
            name: v.pokemon.name,
            url: v.pokemon.url,
            id: Number(v.pokemon.url.split("/").filter(Boolean).pop()),
          }))
          .filter((p) => p.id <= 1025);

        const fullForms = await Promise.all(
          altForms.map(async (p) => {
            const res = await fetch(p.url);
            const data = await res.json();
            return {
              id: data.id,
              name: data.name,
              url: p.url,
              types: data.types.map((t) => t.type.name),
              image: data.sprites.other["official-artwork"].front_default,
            };
          })
        );

        const cacheMap = {};
        fullForms.forEach((p) => {
          cacheMap[p.name] = p;
        });

        setPokemonDetailsCache((prev) => ({ ...prev, ...cacheMap }));
        setNotFound(false);

        console.log(
          "[DEBUG] Added alternate forms:",
          fullForms.map((f) => f.name)
        );
      } catch (err) {
        console.error("Failed to fetch species data:", err);
        setNotFound(true);
      }
    };

    fetchFallbackPokemon();
  }, [searchTerm]);

  const visibleList = filteredList.slice(0, limit);

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
        <p
          className="note"
          style={{ fontSize: "0.75rem", color: "#ccc", textAlign: "center" }}
        >
          * Search supports Pokémon names or ID (1–1025) only.
        </p>
      </div>

      {/* Type Filter */}
      <div style={{ marginTop: "1rem", textAlign: "center" }}>
        <button
          onClick={() => setShowTypeSelector(!showTypeSelector)}
          className="toggle-type-button"
        >
          {showTypeSelector ? "Hide Type Filters" : "Filter by Type"}
        </button>
      </div>

      {showTypeSelector && (
        <div className="type-select-container">
          {types.map((type) => {
            const isSelected = selectedTypes.includes(type);
            return (
              <button
                key={type}
                onClick={() => {
                  setSelectedTypes((prev) => {
                    if (prev.includes(type))
                      return prev.filter((t) => t !== type);
                    if (prev.length < 2) return [...prev, type];
                    return prev;
                  });
                }}
                className={`type-button ${isSelected ? `type-${type}` : ""} ${
                  isSelected ? "active" : ""
                }`}
              >
                {type}
              </button>
            );
          })}
        </div>
      )}

      {/* Pokémon Grid */}
      <div className="main-wrapper">
        <div className="card-container">
          {visibleList.length > 0 ? (
            visibleList.map((pokemon) => (
              <PokemonCard key={pokemon.name} id={pokemon.id} data={pokemon} />
            ))
          ) : (
            <p className="text-center text-gray-400">No results found.</p>
          )}
        </div>
      </div>

      {/* Load More */}
      {filteredList.length > visibleList.length && (
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
