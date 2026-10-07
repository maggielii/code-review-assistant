import { useState } from 'react'
import { getSeverityStyle } from '../severity.js'
import './FindingsList.css'

const TITLES = { review: 'Findings', explain: 'Explanation', refactor: 'Suggestions' }
const EMPTY_MESSAGES = {
  review: 'No errors found. This code looks good.',
  explain: 'No explanation came back. Try running it again.',
  refactor: 'No suggestions. This code already looks clean.',
}

function FindingsList({ findings, mode, onResolve }) {
  const [resolvedIds, setResolvedIds] = useState([])

  if (findings === null) return null

  const title = TITLES[mode] || 'Findings'

  if (findings.length === 0) {
    return (
      <div className="card">
        <div className="card-label">{title}</div>
        <div className="empty-state">
          <div className="finding-icon success">✓</div>
          <p className="empty-text">{EMPTY_MESSAGES[mode] || EMPTY_MESSAGES.review}</p>
        </div>
      </div>
    )
  }

  if (mode === 'explain') {
    const explanation = findings[0]
    return (
      <div className="card">
        <div className="card-label">{title}</div>
        <p className="explanation-text">{explanation.message}</p>
        {explanation.suggestion && (
          <div className="takeaway">
            <span className="takeaway-label">Key takeaway</span>
            <p>{explanation.suggestion}</p>
          </div>
        )}
      </div>
    )
  }

  const visible = findings.filter((finding) => !resolvedIds.includes(finding.id))

  function handleResolve(id) {
    setResolvedIds([...resolvedIds, id])
    onResolve(id)
  }

  if (visible.length === 0) {
    return (
      <div className="card">
        <div className="card-label">{title}</div>
        <p className="empty-text">All findings resolved.</p>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="card-label">{title}</div>
      {visible.map((finding) => (
        <div className="finding" key={finding.id}>
          <div className={`finding-icon ${getSeverityStyle(finding.severity).cls}`}>
            {getSeverityStyle(finding.severity).icon}
          </div>
          <div className="finding-text">
            <p className="msg">{finding.message}</p>
            {finding.suggestion && <p className="suggestion-text">{finding.suggestion}</p>}
            <p className="loc">
              Line {finding.lineStart}
              {finding.lineEnd !== finding.lineStart ? `–${finding.lineEnd}` : ''}
            </p>
          </div>
          <button className="resolve-btn" onClick={() => handleResolve(finding.id)}>✓</button>
        </div>
      ))}
    </div>
  )
}

export default FindingsList