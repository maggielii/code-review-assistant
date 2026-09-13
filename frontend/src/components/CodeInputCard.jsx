import './CodeInputCard.css'

function CodeInputCard({ code, setCode, note, setNote, selectedMode, onSubmit, isSubmitting, error }) {
  return (
    <div className="card">
      <div className="card-label">Your code</div>
      <textarea
        className="code-input"
        placeholder="Paste your code here..."
        value={code}
        onChange={(e) => setCode(e.target.value)}
        rows={8}
      />
      {error && <p className="error-text">{error}</p>}
      <div className="row">
        <input
          type="text"
          placeholder="Optional note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <button
          className="primary"
          style={{ background: selectedMode.bg, color: selectedMode.color }}
          onClick={onSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Analyzing...' : selectedMode.title}
        </button>
      </div>
    </div>
  )
}

export default CodeInputCard