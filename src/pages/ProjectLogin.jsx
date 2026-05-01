import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { hasProjectAccess, PROJECT_AUTH_KEY } from '../utils/projectAuth'
import './ProjectLogin.css'

function ProjectLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  if (hasProjectAccess()) {
    return <Navigate to={from} replace />
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (username.trim() === 'user' && password === '111111') {
      sessionStorage.setItem(PROJECT_AUTH_KEY, 'true')
      navigate(from, { replace: true })
      return
    }

    setError('Incorrect username or password.')
  }

  return (
    <main className="project-login-page">
      <div className="login-aurora login-aurora-one" />
      <div className="login-aurora login-aurora-two" />
      <div className="login-aurora login-aurora-three" />
      <div className="login-grid" />

      <section className="project-login-shell" aria-label="BrainBoost project login">
        <div className="project-login-brand">
          <span className="brand-mark" aria-hidden="true">BB</span>
          <span>Brain<span>Boost</span></span>
        </div>

        <form className="project-login-card" onSubmit={handleSubmit}>
          <div className="card-accent" />
          <p className="login-kicker">Project access</p>
          <h1>Welcome back</h1>
          <p className="login-copy">Sign in to continue to BrainBoost.</p>

          <label className="login-field">
            <span>Username</span>
            <input
              autoComplete="username"
              value={username}
              onChange={(event) => {
                setUsername(event.target.value)
                setError('')
              }}
              placeholder="Enter username"
            />
          </label>

          <label className="login-field">
            <span>Password</span>
            <input
              autoComplete="current-password"
              type="password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value)
                setError('')
              }}
              placeholder="Enter password"
            />
          </label>

          {error && <div className="login-error" role="alert">{error}</div>}

          <button className="project-login-button" type="submit">Sign In</button>
        </form>

        <p className="login-footnote">BrainBoost - Brain Health Platform - FIT5120</p>
      </section>
    </main>
  )
}

export default ProjectLogin
