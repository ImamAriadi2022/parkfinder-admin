import { useState } from 'react';
import { User, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';

export default function LoginForm({ email, setEmail, password, setPassword, error, loading, handleSubmit }) {
  const [showPass, setShowPass] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Username / Email field */}
      <div>
        <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text2)', display: 'block', marginBottom: 6 }}>
          Nama Pengguna / Email
        </label>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <User size={16} style={{ position: 'absolute', left: 14, color: 'var(--text3)' }} />
          <input
            className="input"
            type="email"
            placeholder="Masukkan nama pengguna"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ paddingLeft: 42, height: 42, background: 'var(--bg-base)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13 }}
            autoComplete="email"
            required
          />
        </div>
      </div>

      {/* Password field */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text2)' }}>
            Kata Sandi
          </label>
          <a
            href="#forgot"
            onClick={e => { e.preventDefault(); alert('Hubungi Super Admin untuk mereset password.'); }}
            style={{ fontSize: 11, color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}
          >
            Lupa password?
          </a>
        </div>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Lock size={16} style={{ position: 'absolute', left: 14, color: 'var(--text3)' }} />
          <input
            className="input"
            type={showPass ? 'text' : 'password'}
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ paddingLeft: 42, paddingRight: 42, height: 42, background: 'var(--bg-base)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13 }}
            autoComplete="current-password"
            required
          />
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            style={{ position: 'absolute', right: 14, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)', display: 'flex', padding: 2 }}
          >
            {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      {/* Remember Me Checkbox */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
        <input
          type="checkbox"
          id="rememberMe"
          checked={rememberMe}
          onChange={e => setRememberMe(e.target.checked)}
          style={{
            cursor: 'pointer',
            accentColor: 'var(--accent)',
            width: 14,
            height: 14,
            borderRadius: 4
          }}
        />
        <label htmlFor="rememberMe" style={{ fontSize: 11, color: 'var(--text3)', cursor: 'pointer', userSelect: 'none', fontWeight: 500 }}>
          Ingat perangkat ini selama 30 hari
        </label>
      </div>

      {/* Error message */}
      {error && (
        <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: 'var(--red)', display: 'flex', alignItems: 'center', gap: 6 }}>
          <AlertCircle size={15} style={{ flexShrink: 0 }} /> {error}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        className="btn btn-primary"
        disabled={loading}
        style={{
          width: '100%',
          height: 42,
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: 13,
          fontWeight: 700,
          borderRadius: 8,
          gap: 8,
          marginTop: 4
        }}
      >
        {loading ? (
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.25)', borderTopColor: '#FFF', borderRadius: '50%', animation: 'spin .7s linear infinite', display: 'inline-block' }} />
            Sedang Masuk...
          </span>
        ) : (
          <>
            Masuk ke Dashboard
            <ArrowRight size={15} />
          </>
        )}
      </button>

      {/* Security notice under button */}
      <div style={{ textAlign: 'center', marginTop: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={{ fontSize: 10, color: 'var(--text3)', fontWeight: 600 }}>Khusus Petugas Berwenang.</span>
        <span style={{ fontSize: 9, color: 'var(--text3)' }}>Alamat IP dicatat untuk audit keamanan.</span>
      </div>
    </form>
  );
}
