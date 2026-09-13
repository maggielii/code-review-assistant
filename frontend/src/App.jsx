import { useState } from 'react'
import BackgroundDecoration from './components/BackgroundDecoration.jsx'
import ModeSelector from './components/ModeSelector.jsx'
import CodeInputCard from './components/CodeInputCard.jsx'
import AuthForm from './components/AuthForm.jsx'
import FindingsList from './components/FindingsList.jsx'

const MODES = [
  { id: 'review', title: 'Check', desc: 'Find bugs and style issues', icon: 'R', color: '#F0A868', bg: 'rgba(240,168,104,0.16)', textColor: '#3A2410' },
  { id: 'explain', title: 'Explain', desc: 'Walk through what this code does', icon: 'E', color: '#B3AAF0', bg: 'rgba(179,170,240,0.16)', textColor: '#221A3D' },
  { id: 'refactor', title: 'Refactor', desc: 'Suggest a cleaner approach', icon: 'F', color: '#F0CE8F', bg: 'rgba(240,206,143,0.16)', textColor: '#3A2A0A' },
]

function App() {
  const [token, setToken] = useState(null)
  const [selectedMode, setSelectedMode] = useState(MODES[0])
  const [code, setCode] = useState('')
  const [note, setNote] = useState('')
  const [findings, setFindings] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  async function handleSubmit() {
    setSubmitError('')
    setIsSubmitting(true)
    const lineCount = code.split('\n').length

    try {
      const response = await fetch('http://localhost:5050/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          code,
          language: 'javascript',
          mode: selectedMode.id,
          lineStart: 1,
          lineEnd: lineCount,
          userNote: note,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setSubmitError(data.error || 'Something went wrong')
        return
      }

      setFindings(data.findings)
    } catch (err) {
      setSubmitError('Could not reach the server.')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleResolve(findingId) {
    try {
      await fetch(`http://localhost:5050/api/reviews/findings/${findingId}`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` },
      })
    } catch (err) {
      console.error('Failed to resolve finding')
    }
  }

  return (
    <>
      <BackgroundDecoration />
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 20px', position: 'relative', zIndex: 1 }}>
        {token === null ? (
          <AuthForm onAuthSuccess={(newToken) => setToken(newToken)} />
        ) : (
          <>
            <ModeSelector modes={MODES} selectedId={selectedMode.id} onSelect={setSelectedMode} />
            <CodeInputCard
              code={code}
              setCode={setCode}
              note={note}
              setNote={setNote}
              selectedMode={selectedMode}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              error={submitError}
            />
            <FindingsList findings={findings} onResolve={handleResolve} />
          </>
        )}
      </div>
    </>
  )
}

export default App