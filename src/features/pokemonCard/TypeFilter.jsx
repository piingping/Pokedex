export default function TypeFilter({
  types,
  selectedTypes,
  setSelectedTypes,
  showTypeSelector,
  setShowTypeSelector,
  searchTerm,
  setSearchParams,
  navigate,
}) {
  return (
    <>
      <div style={{ marginTop: "1rem", textAlign: "center" }}>
        <button
          onClick={() => setShowTypeSelector(!showTypeSelector)}
          className="toggle-type-button"
        >
          {showTypeSelector ? "▼ Hide Type Filters" : "► Filter by Type"}
        </button>
      </div>

      {showTypeSelector && (
        <div className="type-select-container">
          {types.map((type) => {
            const isSelected = selectedTypes.includes(type);
            const isDisabled = !isSelected && selectedTypes.length >= 2;

            return (
              <button
                key={type}
                onClick={() => {
                  if (isDisabled) return; 
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
                    navigate("/search?" + new URLSearchParams(params).toString());
                    return updated;
                  });
                }}
                className={`type-button ${isSelected ? `type-${type} active` : ""} ${
                  isDisabled ? "type-disabled" : ""
                }`}
              >
                {type}
              </button>
            );
          })}
        </div>
      )}
    </>
  );
}
