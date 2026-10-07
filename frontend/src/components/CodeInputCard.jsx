import { LANGUAGES } from '../languages.js'
import './CodeInputCard.css'

function CodeInputCard({ code, setCode, note, setNote, language, setLanguage, selectedMode, onSubmit, isSubmitting, error }) {
  return (
    <div className="card">
      <div className="card-label-row">
        <div className="card-label">Your code</div>
        <div className="language-picker">
          <label className="language-label" htmlFor="language-select">Language:</label>
          <select
            id="language-select"
            className="language-select"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.id} value={lang.id}>{lang.label}</option>
            ))}
          </select>
        </div>
      </div>
      <textarea
        className="code-input"
        placeholder="Paste your code here..."
        value={code}
        onChange={(e) => setCode(e.target.value)}
        rows={8}
      />
      <input
        type="text"
        className="note-input"
        placeholder="Extra Notes (optional)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      {error && <p className="error-text">{error}</p>}
      <button
        className="submit-btn"
        style={{ background: selectedMode.bg, color: selectedMode.color }}
        onClick={onSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Analyzing...' : selectedMode.title}
      </button>
    </div>
  )
}

export default CodeInputCard