import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import SearchBar from "@/features/pokemonCard/SearchBar";
import TypeFilter from "@/features/pokemonCard/TypeFilter";
import PokemonGrid from "@/features/pokemonCard/PokemonGrid";
import LoadMoreButton from "@/features/pokemonCard/LoadMoreButton";
import ScrollToTopButton from "@/components/ScrollToTopButton";

export default function Pokedex() {
  const [allPokemonList, setAllPokemonList] = useState([]);
  const [pokemonDetailsCache, setPokemonDetailsCache] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [limit, setLimit] = useState(24);
  const [notFound, setNotFound] = useState(false);
  const [showTypeSelector, setShowTypeSelector] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const types = [
    "normal", "fire", "water", "electric", "grass", "ice", "fighting",
    "poison", "ground", "flying", "psychic", "bug", "rock", "ghost",
    "dragon", "dark", "steel", "fairy"
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
    <div className="parent-container">
      <SearchBar
        inputValue={inputValue}
        setInputValue={setInputValue}
        handleSearch={handleSearch}
        handleKeyDown={handleKeyDown}
      />
      <TypeFilter
        types={types}
        selectedTypes={selectedTypes}
        setSelectedTypes={setSelectedTypes}
        showTypeSelector={showTypeSelector}
        setShowTypeSelector={setShowTypeSelector}
        searchTerm={searchTerm}
        setSearchParams={setSearchParams}
        navigate={navigate}
      />
      <PokemonGrid isLoading={isLoading} visibleList={visibleList} />
      <LoadMoreButton
        isLoading={isLoading}
        filteredList={filteredList}
        visibleList={visibleList}
        onLoadMore={() => setLimit(limit + 20)}
      />
       <ScrollToTopButton />
    </div>
  );
}
