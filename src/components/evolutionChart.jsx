import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './evolutionChart.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowDown, faArrowRight } from "@fortawesome/free-solid-svg-icons";

export default function EvolutionChart({ name }) {
  const [chainList, setChainList] = useState([])
  const [imageMap, setImageMap] = useState({})
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 840)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 840)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    async function fetchEvolutionChain(name) {
      try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
        const pokemon = await res.json()
        const speciesRes = await fetch(pokemon.species.url)
        const species = await speciesRes.json()
        const chainRes = await fetch(species.evolution_chain.url)
        const chainData = await chainRes.json()

        const names = extractChain(chainData.chain)
        setChainList(names)
      } catch (err) {
        console.error("Failed to fetch evolution chain", err)
      }
    }

    fetchEvolutionChain(name)
  }, [name])

  useEffect(() => {
    async function fetchImages() {
      const map = {}
      for (const name of chainList) {
        try {
          const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
          const data = await res.json()
          const fallback =
            data.sprites.other?.['official-artwork']?.front_default ||
            data.sprites.front_default ||
            '/fallback.jpg' // <- default fallback
          map[name] = fallback
        } catch (e) {
          map[name] = '/fallback.png'
        }
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
    <div className="evo-parent">
      <h2 className="evo-title">Evolution Chain</h2>

      {chainList.length <= 1 ? (
        <p className="no-evolution">No Evolution</p>
      ) : (
        <div className="evo-container">
          {chainList.map((pokemonName, i) => (
            <div key={pokemonName} className="evo-item">
              <Link to={`/pokemon/${pokemonName}`} className="evo-link">
                <img
                  src={imageMap[pokemonName]}
                  alt={pokemonName}
                  className="evo-image"
                />
                <p className="evo-name">{pokemonName}</p>
              </Link>
              {i !== chainList.length - 1 && (
                <FontAwesomeIcon
                  icon={isMobile ? faArrowDown : faArrowRight}
                  className="arrow-icon"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
