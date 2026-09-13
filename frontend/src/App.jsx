import { useState } from 'react'
import BackgroundDecoration from './components/BackgroundDecoration.jsx'
import ModeSelector from './components/ModeSelector.jsx'
import CodeInputCard from './components/CodeInputCard.jsx'
import AuthForm from './components/AuthForm.jsx'

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

  function handleSubmit() {
    console.log('Submitting:', { code, note, mode: selectedMode.id })
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
            />
          </>
        )}
      </div>
    </>
  )
}

export default App