import { useState, useEffect } from 'react'
import './HistoryPage.css'
import { API_URL } from '../config.js'
import { getSeverityStyle } from '../severity.js'

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

                    return (
                        <div key={review.id}>
                            <div className="history-row" onClick={() => toggleExpand(review.id)}>
                                <div className="history-icon">{review.language[0].toUpperCase()}</div>
                                <div className="history-text">
                                    <div className="title">{review.mode} — {review.language}</div>
                                    <div className="code-preview">{preview}</div>
                                    <div className="desc">{review.findings.length} finding{review.findings.length !== 1 ? 's' : ''}</div>
                                </div>
                                <div className={`expand-arrow ${isExpanded ? 'expanded' : ''}`}>›</div>
                            </div>

                            {isExpanded && (
                                <div className="history-expanded">
                                    <div className="code-block">{review.code}</div>
                                    {review.findings.map((finding) => (
                                        <div className="finding" key={finding.id}>
                                            <div className={`finding-icon ${getSeverityStyle(finding.severity).cls}`}>
                                                {getSeverityStyle(finding.severity).icon}
                                            </div>
                                            <div className="finding-text">
                                                <p className="msg">{finding.message}</p>
                                                <p className="loc">Line {finding.lineStart}</p>
                                            </div>
                                        </div>
                                    ))}
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