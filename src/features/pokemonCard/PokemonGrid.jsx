import PokemonCard from "@/components/pokemonCard";

export default function PokemonGrid({ isLoading, visibleList }) {
  return (
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
  );
}
