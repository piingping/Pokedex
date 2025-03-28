export default function TopSection({ pokemon, weaknesses }) {
    const image = pokemon.sprites.other["official-artwork"].front_default;
    const abilities = pokemon.abilities.map((a) => a.ability.name).join(", ");
    const height = (pokemon.height / 10).toFixed(1);
    const weight = (pokemon.weight / 10).toFixed(1);
  
    return (
      <div className="top-container">
        <div className="pic-container">
          <img src={image} alt={pokemon.name} className="pokemon-image" />
        </div>
        <div className="pokemon-card-details">
          <h2 className="pokemon-name-details">
            {pokemon.name}
            <span className="pokemon-id-detail">
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
    );
  }
  