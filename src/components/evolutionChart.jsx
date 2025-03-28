import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'


export default function EvolutionChart({ name }) {
  const [chainList, setChainList] = useState([])
  const [imageMap, setImageMap] = useState({})

  useEffect(() => {
    async function fetchEvolutionChain(name) {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
      const pokemon = await res.json()
      const speciesRes = await fetch(pokemon.species.url)
      const species = await speciesRes.json()
      const chainRes = await fetch(species.evolution_chain.url)
      const chainData = await chainRes.json()

      const names = extractChain(chainData.chain)
      setChainList(names)
    }

    fetchEvolutionChain(name)
  }, [name])

  useEffect(() => {
    async function fetchImages() {
      const map = {}
      for (const name of chainList) {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
        const data = await res.json()
        map[name] = data.sprites.other['official-artwork'].front_default
      }
      setImageMap(map)
    }

    if (chainList.length > 0) fetchImages()
  }, [chainList])

  const extractChain = (node, acc = []) => {
    acc.push(node.species.name)
    if (node.evolves_to.length > 0) {
      return extractChain(node.evolves_to[0], acc)
    }
    return acc
  }

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-2">Evolution Chain</h2>
      <div className="flex items-center flex-wrap gap-4">
      {chainList.map((pokemonName, i) => (
        <div key={pokemonName} className="flex items-center gap-2">
            <Link to={`/pokemon/${pokemonName}`} className="text-center hover:scale-105 transition">
            <img
                src={imageMap[pokemonName]}
                alt={pokemonName}
                className="w-20 h-20 mx-auto"
            />
            <p className="capitalize mt-1 text-white">{pokemonName}</p>
            </Link>
            {i !== chainList.length - 1 && <span className="text-2xl">➡️</span>}
        </div>
        ))}

      </div>
    </div>
  )
}
