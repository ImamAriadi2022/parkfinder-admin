import { useState } from 'react'
import LoginForm from '../components/pages/LoginPage/LoginForm'
import LoginHeader from '../components/pages/LoginPage/LoginHeader'
import LoginRoleToggle from '../components/pages/LoginPage/LoginRoleToggle'
import { useApp } from '../context/AppContext'

export default function LoginPage() {
  const { login, toast } = useApp()
  const [mode, setMode] = useState('admin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const switchMode = nextMode => {
    setMode(nextMode)
    setError('')
    setEmail('')
    setPassword('')
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Email dan password wajib diisi')
      return
    }

    setLoading(true)
    const result = await login(email, password)
    if (!result.ok) {
      setError(result.msg)
      setLoading(false)
    } else {
      toast.success(`Selamat datang kembali, ${result.user.name || 'Admin'}!`)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at top left, rgba(0,210,255,0.08), transparent 30%), radial-gradient(circle at bottom right, rgba(123,97,255,0.08), transparent 26%), var(--bg-base)',
      padding: 20,
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: -120, left: -120, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,210,255,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -80, right: -80, width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(123,97,255,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{
        width: '100%',
        maxWidth: 480,
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 20,
        padding: '36px 34px 28px',
        position: 'relative',
        zIndex: 1,
        boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
        animation: 'fadeUp 0.5s ease both',
      }}>
        <LoginHeader mode={mode} />

        <LoginRoleToggle mode={mode} switchMode={switchMode} />

        <LoginForm
          mode={mode}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          error={error}
          loading={loading}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  )
}