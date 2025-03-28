import './statBar.css'

const MAX_STAT = 255

export default function StatBlockBar({ name, value }) {
  const percent = (value / MAX_STAT) * 100

  return (
    <div className="statbar-container">
      <div className="statbar-label">{name.toUpperCase()}</div>
      <div className="statbar-bar">
        <div className="statbar-fill" style={{ width: `${percent}%` }}>
          <span className="statbar-value">{value}</span>
        </div>
      </div>
    </div>
  )
}
