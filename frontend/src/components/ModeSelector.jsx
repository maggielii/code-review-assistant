import './ModeSelector.css'

function ModeSelector({ modes, selectedId, onSelect }) {
  return (
    <div className="card">
      <div className="card-label">What do you need?</div>
      {modes.map((mode) => (
        <div
          key={mode.id}
          className="mode-row"
          style={{ background: mode.id === selectedId ? mode.bg : 'transparent' }}
          onClick={() => onSelect(mode)}
        >
          <div className="mode-icon" style={{ background: mode.color, color: mode.textColor }}>
            {mode.icon}
          </div>
          <div className="mode-text">
            <div className="title">{mode.title}</div>
            <div className="desc">{mode.desc}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ModeSelector