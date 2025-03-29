import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import PokemonCard from "../components/pokemonCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useSearchParams, useNavigate } from "react-router-dom";

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
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

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
    const query = searchParams.get("query") || "";
    let typeParams = searchParams.getAll("type");

    if (typeParams.length === 1 && typeParams[0].includes(",")) {
      // กรณีเกิดจาก type=ice,dark
      typeParams = typeParams[0].split(",");
    }

    setInputValue(query);
    setSearchTerm(query);
    setSelectedTypes(typeParams.slice(0, 2));
  }, [searchParams]);
  useEffect(() => {
    const fetchDetails = async () => {
      setIsLoading(true);

      const newDetails = {};
      const targetList =
        searchTerm || selectedTypes.length > 0
          ? allPokemonList
          : allPokemonList.slice(0, 150);

      await Promise.all(
        targetList.map(async (p) => {
          const cached = pokemonDetailsCache[p.name];
          if (!cached || !cached.types || cached.types.length === 0) {
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
      setIsLoading(false);
    };

    fetchDetails();
  }, [allPokemonList, searchTerm, selectedTypes]);

  const handleSearch = () => {
    const trimmed = inputValue.trim().toLowerCase();
    if (/^\d+$/.test(trimmed)) {
      const id = Number(trimmed);
      if (id < 1 || id > 20000) {
        setNotFound(true);
        return;
      }
    }

    const params = {};
    if (trimmed) params.query = trimmed;
    if (selectedTypes.length) params.type = selectedTypes;

    setSearchParams(params);
    navigate("/search?" + new URLSearchParams(params).toString());
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
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
        (selectedTypes.length === 1
          ? pokemon.types?.includes(selectedTypes[0])
          : selectedTypes.every((type) => pokemon.types?.includes(type)));

      return matchesText && matchesType;
    })
    .sort((a, b) => a.id - b.id);

  const visibleList = filteredList.slice(0, limit);
  return (
    <div className="mother-container">
      {/* Search Bar */}
      <div className="searchbar-container">
        <p className="searchbar-title">Search Pokémon</p>
        <div className="searchbar-wrapper">
          <input
            type="text"
            placeholder="Enter a Pokémon name, ID, or form"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="seacrbar"
          />
          <button onClick={handleSearch} className="search-button">
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
        </div>
        <p className="sr-only">Search by name, ID, or alternate forms.</p>
      </div>

      {/* Type Filter Toggle */}
      <div style={{ marginTop: "1rem", textAlign: "center" }}>
        <button
          onClick={() => setShowTypeSelector(!showTypeSelector)}
          className="toggle-type-button"
        >
          {showTypeSelector ? "▼ Hide Type Filters" : "► Filter by Type"}
        </button>
      </div>

      {/* Type Filter Buttons */}
      {showTypeSelector && (
        <div className="type-select-container">
          {types.map((type) => {
            const isSelected = selectedTypes.includes(type);
            return (
              <button
                key={type}
                onClick={() => {
                  setSelectedTypes((prev) => {
                    let updated = prev.includes(type)
                      ? prev.filter((t) => t !== type)
                      : prev.length < 2
                      ? [...prev, type]
                      : prev;

                    const params = {};
                    if (searchTerm) params.query = searchTerm;
                    if (updated.length) params.type = updated;

                    setSearchParams(params);
                    navigate(
                      "/search?" + new URLSearchParams(params).toString()
                    );

                    return updated;
                  });
                }}
                className={`type-button ${
                  isSelected ? `type-${type} active` : ""
                }`}
              >
                {type}
              </button>
            );
          })}
        </div>
      )}

      {/* Pokémon Cards */}
      <div className="main-wrapper">
        <div className="card-container">
          {isLoading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : visibleList.length > 0 ? (
            visibleList.map((pokemon) => (
              <PokemonCard key={pokemon.name} id={pokemon.id} data={pokemon} />
            ))
          ) : (
            <p className="text-center text-gray-400">No results found.</p>
          )}

        </div>
      </div>

      {/* Load More */}
      {!isLoading && filteredList.length > visibleList.length && (
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
