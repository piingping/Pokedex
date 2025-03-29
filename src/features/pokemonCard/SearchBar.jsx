import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

export default function SearchBar({ inputValue, setInputValue, handleSearch, handleKeyDown }) {
  return (
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
  );
}
