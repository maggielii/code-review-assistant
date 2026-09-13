import { useState } from 'react'
import './FindingsList.css'

function FindingsList({ findings }) {
  const [resolvedIds, setResolvedIds] = useState([])

  if (!findings || findings.length === 0) return null

  const visible = findings.filter((finding) => !resolvedIds.includes(finding.id))

  function handleResolve(id) {
    setResolvedIds([...resolvedIds, id])
  }

  if (visible.length === 0) {
    return (
      <div className="card">
        <div className="card-label">Findings</div>
        <p className="empty-text">All findings resolved.</p>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="card-label">Findings</div>
      {visible.map((finding) => (
        <div className="finding" key={finding.id}>
          <div className={`finding-icon ${finding.severity === 'ERROR' ? 'error' : 'info'}`}>
            {finding.severity === 'ERROR' ? '!' : 'i'}
          </div>
          <div className="finding-text">
            <p className="msg">{finding.message}</p>
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