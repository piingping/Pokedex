import "@/components/pokemonDetails.css";

export default function StatColumnChart({ stats }) {
  const statMap = {
    hp: "HP",
    attack: "ATK",
    defense: "DFS",
    "special-attack": "S-AT",
    "special-defense": "S-DF",
    speed: "SPD",
  };

  const fullName = {
    hp: "HP",
    attack: "Attack",
    defense: "Defense",
    "special-attack": "Special Attack",
    "special-defense": "Special Defense",
    speed: "Speed",
    total: "Total",
  };

  const maxValue = 250;
  const maxTotal = 780; // Max possible total stats for balance

  const totalStat = stats.reduce((sum, s) => sum + s.base_stat, 0);

  return (
    <div className="column-chart">
      {stats.map((stat) => {
        const shortLabel = statMap[stat.stat.name];
        const fullLabel = fullName[stat.stat.name];
        const height = (stat.base_stat / maxValue) * 100;

        return (
          <div className="column-item" key={stat.stat.name}>
            <div className="bar-container">
              <div
                className="bar"
                style={{ height: `${height}%` }}
                title={`${fullLabel}: ${stat.base_stat}`}
              >
                <span className="bar-value">{stat.base_stat}</span>
              </div>
            </div>
            <span className="stat-label">{shortLabel}</span>
          </div>
        );
      })}

      {/* TOTAL bar */}
      <div className="column-item" key="total">
        <div className="bar-container">
          <div
            className="bar total-bar"
            style={{ height: `${(totalStat / maxTotal) * 100}%` }}
            title={`Total: ${totalStat}`}
          >
            <span className="bar-value">{totalStat}</span>
          </div>
        </div>
        <span className="stat-label">TOTAL</span>
      </div>
    </div>
  );
}
