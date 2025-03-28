import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './pokemonCard.css' 

export default function PokemonCard({ id }) {
  const [pokemon, setPokemon] = useState(null)

  useEffect(() => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
      .then(res => res.json())
      .then(data => {
        setPokemon({
          id: data.id,
          name: data.name,
          image: data.sprites.other['official-artwork'].front_default,
          types: data.types.map(t => t.type.name)
        })
      })
  }, [id])

 

  if (!pokemon) return <div className="p-4 text-center">Loading...</div>

  return (
    <div className="pokemon-card">
  <Link to={`/pokemon/${pokemon.name}`} className="pokemon-link">
    <img src={pokemon.image} alt={pokemon.name} className="pokemon-img" loading="lazy" />
    <div className='card-details'>
    <p className="pokemon-id">{String(pokemon.id).padStart(4, '0')}</p>

    <p className="pokemon-name">{pokemon.name}</p>

    <div className="type-container">
      {pokemon.types.map(type => (
        <span key={type} className={`type-badge type-${type}`}>
          {type}
        </span>
      ))}
    </div>
    </div>
  </Link>
</div>

  
  )
}
