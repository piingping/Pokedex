import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Link } from 'react-router-dom'
import EvolutionChart from "../components/evolutionChart";
import StatBar from "../components/statBar";
import "../components/pokemonCard.css";
import "../components/pokemonDetails.css";

export default function PokemonDetail() {
  const { name } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [weaknesses, setWeaknesses] = useState([]);
  const [varieties, setVarieties] = useState([]);
  const [species, setSpecies] = useState(null);

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
      const allWeaknesses = await Promise.all(
        pokemon.types.map(async (t) => {
          const res = await fetch(t.type.url);
          const data = await res.json();
          return data.damage_relations.double_damage_from.map((d) => d.name);
        })
      );
      const merged = [...new Set(allWeaknesses.flat())];
      setWeaknesses(merged);
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

  useEffect(() => {
    if (!species) return
  
    const fetchVarieties = async () => {
      try {
        const forms = await Promise.all(
          species.varieties.map(async (v) => {
            const res = await fetch(v.pokemon.url)
            return res.json()
          })
        )
        setVarieties(forms)
      } catch (err) {
        console.error("Failed to fetch varieties", err)
      }
    }
  
    fetchVarieties()
  }, [species])
  

  if (!pokemon) return <p className="text-white p-4">Loading {name}...</p>;

  const image = pokemon.sprites.other["official-artwork"].front_default;
  const abilities = pokemon.abilities.map((a) => a.ability.name).join(", ");
  const height = (pokemon.height / 10).toFixed(1);
  const weight = (pokemon.weight / 10).toFixed(1);

  const getGenderRatio = (rate) => {
    if (rate === -1) return "Genderless";
    const female = (rate / 8) * 100;
    const male = 100 - female;
    return `♂ ${male.toFixed(0)}% / ♀ ${female.toFixed(0)}%`;
  };

  const getEvYields = (stats) =>
    stats
      .filter((stat) => stat.effort > 0)
      .map((stat) => `${stat.effort} ${stat.stat.name}`)
      .join(", ");

  return (
    <div className="container">
      {/* ⬆️ Top Section */}
      <div className="top-container">
        <div className="pic-container">
          <img src={image} alt={pokemon.name} className="pokemon-image" />
        </div>

        <div className="pokemon-card-details">
          <h2 className="pokemon-name-details">
            {pokemon.name}
            <span className="pokemon-id">
              #{pokemon.id.toString().padStart(4, "0")}
            </span>
          </h2>

          <div className="types">
            {pokemon.types.map((t) => (
              <span key={t.type.name} className={`type-badge type-${t.type.name}`}>
                {t.type.name}
              </span>
            ))}
          </div>

          <p><span className="label">Abilities:</span> {abilities}</p>
          <p><span className="label">Height:</span> {height} m</p>
          <p><span className="label">Weight:</span> {weight} kg</p>
          <p>
            <span className="label">Weak Against:</span>{" "}
            {weaknesses.map((w) => (
              <span key={w} className={`type-badge type-${w}`}>{w}</span>
            ))}
          </p>
        </div>
      </div>

      {/* ⬇️ Bottom Section: Stats + Breeding/Training */}
      <div className="info-grid">
        <div className="stat-box">
          <h2>Stats</h2>
          {pokemon.stats.map((stat) => (
            <StatBar
              key={stat.stat.name}
              name={stat.stat.name}
              value={stat.base_stat}
            />
          ))}
        </div>

        {species ? (
  <div className="info-box">
    <h3>Breeding</h3>
    <ul>
      <li><strong>Gender ratio:</strong> {getGenderRatio(species.gender_rate)}</li>
      <li><strong>Egg groups:</strong> {species.egg_groups.map((e) => e.name).join(", ")}</li>
    </ul>

    <h3>Training</h3>
    <ul>
      <li><strong>EV yield:</strong> {getEvYields(pokemon.stats)}</li>
      <li><strong>Catch rate:</strong> {species.capture_rate}</li>
      <li><strong>Base Friendship:</strong> {species.base_happiness}</li>
      <li><strong>Base Exp:</strong> {pokemon.base_experience}</li>
      <li><strong>Growth Rate:</strong> {species.growth_rate?.name.replace("-", " ")}</li>
    </ul>
  </div>
) : (
  <div className="info-box">Loading species info...</div>
)}

      </div>

      {varieties?.length > 1 && (
  <div className="mt-8">
    <h3 className="text-xl font-bold mb-4 text-white">Alternate Forms</h3>
    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
      {varieties.map((v) => (
        <Link to={`/pokemon/${v.name}`} key={v.name} className="alternative-card">
          <img
            src={v.sprites?.other?.["official-artwork"]?.front_default ?? v.sprites?.front_default}
            alt={v.name}
            style={{ width: 100, margin: "0 auto" }}
          />
          <div className="text-sm mt-2">
            <strong>#{v.id.toString().padStart(4, "0")}</strong>
            <br />
            {v.name.replace(/-/g, " ")}
          </div>
        
          <div style={{
            marginTop: 8,
            display: "flex",
            justifyContent: "center",
            gap: 4
          }}>
            {v.types.map((t) => (
              <span
                key={t.type.name}
                className={`type-badge type-${t.type.name}`}
                style={{
                  borderRadius: 9999,
                  padding: "2px 8px",
                  fontSize: 12,
                  fontWeight: 500,
                }}
              >
                {t.type.name}
              </span>
            ))}
          </div>
        </Link>
        
      ))}
    </div>
  </div>
)}


      {/* ⬇️ Evolution */}
      <EvolutionChart name={pokemon.name} />
    </div>
  );
}
