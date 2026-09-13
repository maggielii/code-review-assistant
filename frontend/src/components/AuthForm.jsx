import { useState } from 'react'
import './AuthForm.css'

function AuthForm({ onAuthSuccess }) {
  const [isRegister, setIsRegister] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit() {
    setError('')
    const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login'

    try {
      const response = await fetch(`http://localhost:5050${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Something went wrong')
        return
      }

      if (isRegister) {
        setIsRegister(false)
        setError('Account created — now log in.')
      } else {
        onAuthSuccess(data.token)
      }
    } catch (err) {
      setError('Could not reach the server.')
    }
  }

  return (
    <div className="card">
      <div className="card-label">{isRegister ? 'Create an account' : 'Log in'}</div>
      <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      {error && <p className="error-text">{error}</p>}
      <button className="primary" onClick={handleSubmit}>
        {isRegister ? 'Register' : 'Log in'}
      </button>
      <p className="switch-link" onClick={() => setIsRegister(!isRegister)}>
        {isRegister ? 'Already have an account? Log in' : "Don't have an account? Register"}
      </p>
    </div>
  )
}

export default AuthForm