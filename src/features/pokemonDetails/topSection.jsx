import { useEffect, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMicrophone, faMicrophoneSlash } from "@fortawesome/free-solid-svg-icons"

export default function TopSection({ pokemon, weaknesses }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasCry, setHasCry] = useState(true)
  const [cryFailed, setCryFailed] = useState(false)

  const image = pokemon.sprites.other["official-artwork"].front_default
  const abilities = pokemon.abilities.map((a) => a.ability.name).join(", ")
  const height = (pokemon.height / 10).toFixed(1)
  const weight = (pokemon.weight / 10).toFixed(1)

  const cryUrl = `https://play.pokemonshowdown.com/audio/cries/${pokemon.name.toLowerCase()}.ogg`

  const playCry = () => {
    const cry = new Audio(cryUrl)
    cry.play()
      .then(() => {
        setCryFailed(false)
        setIsPlaying(true)
        cry.onended = () => setIsPlaying(false)
      })
      .catch(() => {
        setCryFailed(true)
        setHasCry(false)
      })
  }

  useEffect(() => {
    setCryFailed(false)
    setHasCry(true)
    setIsPlaying(false)
  }, [pokemon.name])

  return (
    <div className="top-container">
      <div className="pic-container">
  <div className="circle-wrapper">
    <img src="/10922160.png" className="circle-bg" alt="bg" />
    <img
      src={image}
      alt={pokemon.name}
      className="pokemon-image"
      onClick={hasCry ? playCry : null}
      style={{ cursor: hasCry ? "pointer" : "default" }}
      title={hasCry ? "Click to hear Pokémon cry" : "Cry not available" }
    />
  </div>
</div>


      <div className="pokemon-card-details">
        <h2 className="pokemon-name-details">
          {pokemon.name}
          <span className="pokemon-id-detail">
            #{pokemon.id.toString().padStart(4, "0")}
            <FontAwesomeIcon
              icon={cryFailed ? faMicrophoneSlash : faMicrophone}
              onClick={playCry}
              title={cryFailed ? "Cry not available" : "Play cry"}
              style={{
                color: cryFailed ? "#888" : (isPlaying ? "#facc15" : "#f5f5f5"),
                marginLeft: "8px",
                cursor: "pointer",
              }}
            />
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
  )
}
