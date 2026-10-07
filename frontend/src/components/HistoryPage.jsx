import { useState, useEffect } from 'react'
import { API_URL } from '../config.js'
import { getSeverityStyle } from '../severity.js'
import { getLanguageLabel } from '../languages.js'
import './HistoryPage.css'

const MODE_LABELS = { review: 'Check', explain: 'Explain', refactor: 'Refactor' }

function describeResult(review) {
  const count = review.findings.length
  if (review.mode === 'explain') return 'Explanation'
  if (count === 0) return review.mode === 'refactor' ? 'No suggestions' : 'No errors found'
  const noun = review.mode === 'refactor' ? 'suggestion' : 'finding'
  return `${count} ${noun}${count !== 1 ? 's' : ''}`
}

function HistoryPage({ token }) {
  const [reviews, setReviews] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [expandedId, setExpandedId] = useState(null)

  useEffect(() => {
    async function loadReviews() {
      const response = await fetch(`${API_URL}/api/reviews`, {
        headers: { 'Authorization': `Bearer ${token}` },
      })
      const data = await response.json()
      setReviews(data)
      setIsLoading(false)
    }
    loadReviews()
  }, [])

  function toggleExpand(id) {
    setExpandedId(expandedId === id ? null : id)
  }

  return (
    <div className="card">
      <div className="card-label">History</div>
      {isLoading ? (
        <p className="loading-text">Loading...</p>
      ) : reviews.length === 0 ? (
        <p className="loading-text">No reviews yet.</p>
      ) : (
        reviews.map((review) => {
          const firstLine = review.code.split('\n')[0]
          const preview = firstLine.length > 40 ? firstLine.slice(0, 40) + '...' : firstLine
          const isExpanded = review.id === expandedId
          const languageLabel = getLanguageLabel(review.language)

          let details
          if (review.mode === 'explain') {
            details = (
              <p className="explanation-text">
                {review.findings.map((finding) => finding.message).join('\n\n')}
              </p>
            )
          } else if (review.findings.length === 0) {
            details = <p className="empty-text">No issues were found.</p>
          } else {
            details = review.findings.map((finding) => (
              <div className="finding" key={finding.id}>
                <div className={`finding-icon ${getSeverityStyle(finding.severity).cls}`}>
                  {getSeverityStyle(finding.severity).icon}
                </div>
                <div className="finding-text">
                  <p className="msg">{finding.message}</p>
                  <p className="loc">Line {finding.lineStart}</p>
                </div>
              </div>
            ))
          }

          return (
            <div key={review.id}>
              <div className="history-row" onClick={() => toggleExpand(review.id)}>
                <div className="history-icon">{languageLabel[0].toUpperCase()}</div>
                <div className="history-text">
                  <div className="title">{MODE_LABELS[review.mode] || review.mode} — {languageLabel}</div>
                  <div className="code-preview">{preview}</div>
                  <div className="desc">{describeResult(review)}</div>
                </div>
                <div className={`expand-arrow ${isExpanded ? 'expanded' : ''}`}>›</div>
              </div>

              {isExpanded && (
                <div className="history-expanded">
                  <div className="code-block">{review.code}</div>
                  {details}
                </div>
              )}
            </div>
          )
        })
      )}
    </div>
  )
}

export default HistoryPage