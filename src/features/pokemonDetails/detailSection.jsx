import StatColumnChart from "./StatColumnChart";

export default function DetailSection({ pokemon, species }) {
  const getGenderRatio = (rate) => {
    if (rate === -1) return "Genderless";
    const female = (rate / 8) * 100;
    const male = 100 - female;
    return (
      <>
        <span style={{ color: "rgb(128, 204, 245)", fontWeight: "bold" }}>
          ♂ {male.toFixed(0)}%
        </span>{" "}
        /{" "}
        <span style={{ color: "#ec4899", fontWeight: "bold" }}>
          ♀ {female.toFixed(0)}%
        </span>
      </>
    );
  };

  const getEvYields = (stats) =>
    stats
      .filter((stat) => stat.effort > 0)
      .map((stat) => `${stat.effort} ${stat.stat.name}`)
      .join(", ");

  return (
    <div className="info-grid">
      <div className="stat-box">
        <h2>Stats</h2>
        <StatColumnChart stats={pokemon.stats} />
      </div>

      <div className="info-box">
        <h3>Breeding</h3>
        <ul>
          <li>
            <strong>Gender ratio:</strong> {getGenderRatio(species.gender_rate)}
          </li>
          <li>
            <strong>Egg groups:</strong>{" "}
            {species.egg_groups.map((e) => e.name).join(", ")}
          </li>
        </ul>

        <h3>Training</h3>
        <ul>
          <li>
            <strong>EV yield:</strong> {getEvYields(pokemon.stats)}
          </li>
          <li>
            <strong>Catch rate:</strong> {species.capture_rate}
          </li>
          <li>
            <strong>Base Friendship:</strong> {species.base_happiness}
          </li>
          <li>
            <strong>Base Exp:</strong> {pokemon.base_experience}
          </li>
          <li>
            <strong>Growth Rate:</strong>{" "}
            {species.growth_rate?.name.replace("-", " ")}
          </li>
        </ul>
      </div>
    </div>
  );
}
