import { useState } from 'react';

export default function LoginForm({ mode, email, setEmail, password, setPassword, error, loading, handleSubmit }) {
  const [showPass, setShowPass] = useState(false);
  
  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: 14 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text2)', display: 'block', marginBottom: 7 }}>Email</label>
        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 15 }}>✉️</span>
          <input className="input" type="email" placeholder="email@parkfinder.id" value={email} onChange={e => setEmail(e.target.value)} style={{ paddingLeft: 38 }} autoComplete="email" />
        </div>
      </div>
      <div style={{ marginBottom: 8 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text2)', display: 'block', marginBottom: 7 }}>Password</label>
        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 15 }}>🔒</span>
          <input className="input" type={showPass ? 'text' : 'password'} placeholder="Masukkan password" value={password} onChange={e => setPassword(e.target.value)} style={{ paddingLeft: 38, paddingRight: 42 }} autoComplete="current-password" />
          <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 15, lineHeight: 1, padding: 2 }}>{showPass ? '🙈' : '👁️'}</button>
        </div>
      </div>
      {error && <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: 'var(--red)', marginBottom: 14 }}>⚠️ {error}</div>}
      <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: 15, borderRadius: 12 }}>
        {loading ? <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 16, height: 16, border: '2px solid rgba(0,0,0,0.3)', borderTopColor: '#000', borderRadius: '50%', animation: 'spin .7s linear infinite', display: 'inline-block' }} />Memverifikasi...</span> : '🚀 Masuk'}
      </button>
    </form>
  );
}
