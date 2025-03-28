import "../components/pokemonDetails.css";

export default function StatColumnChart({ stats }) {
    const statMap = {
      hp: "HP",
      attack: "ATK",
      defense: "DFS",
      "special-attack": "S-AT",
      "special-defense": "S-DF",
      speed: "SPD",
    };
  
    const maxValue = 150; 
  
    return (
      <div className="column-chart">
        {stats.map((stat) => {
          const label = statMap[stat.stat.name];
          const height = (stat.base_stat / maxValue) * 100;
  
          return (
            <div className="column-item" key={stat.stat.name}>
            <div className="bar-container">
              <div
                className="bar"
                style={{ height: `${height}%` }}
              >
                <span className="bar-value">{stat.base_stat}</span>
              </div>
            </div>
            <span className="stat-label">{label}</span>
          </div>
          
          );
        })}
      </div>
    );
  }
  