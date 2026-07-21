import { useState } from 'react';
import { Sun, Moon, BarChart3, ShieldCheck } from 'lucide-react';
import LoginForm from '../components/LoginForm';
import LoginHeader from '../components/LoginHeader';
import LoginRoleToggle from '../components/LoginRoleToggle';
import { useApp } from '../../../core/providers/AppProvider';

export default function LoginPage() {
  const { login, toast, theme, toggleTheme } = useApp();
  const [mode, setMode] = useState('admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isDark = theme === 'dark';

  const switchMode = nextMode => {
    setMode(nextMode);
    setError('');
    setEmail('');
    setPassword('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Email dan password wajib diisi');
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    if (!result.ok) {
      setError(result.msg);
      setLoading(false);
    } else {
      toast.success(`Selamat datang kembali, ${result.user.name || 'Admin'}!`);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: isDark
        ? 'radial-gradient(circle at top left, rgba(59, 130, 246, 0.06), transparent 30%), var(--bg-base)'
        : 'radial-gradient(circle at top left, rgba(26, 86, 219, 0.04), transparent 30%), var(--bg-base)',
      padding: 20,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Floating Theme Toggle (Sun/Moon Switch on Login Screen) */}
      <button
        onClick={toggleTheme}
        title={isDark ? 'Switch ke Light Mode' : 'Switch ke Dark Mode'}
        style={{
          position: 'absolute',
          top: 20,
          right: 20,
          zIndex: 10,
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 10,
          padding: '8px 10px',
          cursor: 'pointer',
          color: 'var(--text2)',
          display: 'flex',
          alignItems: 'center',
          transition: 'all 0.2s',
          boxShadow: isDark ? 'none' : '0 4px 6px -1px rgba(0,0,0,0.05)'
        }}
      >
        {isDark ? <Sun size={16} /> : <Moon size={16} />}
      </button>

      <div style={{ position: 'absolute', top: -120, left: -120, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -80, right: -80, width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {/* Main Wrapper for Card & Bottom Footer */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: 440 }}>
        {/* Login Card */}
        <div style={{
          width: '100%',
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 20,
          padding: '36px 34px 28px',
          position: 'relative',
          zIndex: 1,
          boxShadow: isDark ? '0 24px 64px rgba(0,0,0,0.35)' : '0 20px 40px rgba(0,0,0,0.04)',
          animation: 'fadeUp 0.5s ease both',
          marginBottom: 24
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

        {/* Bottom Metadata Info - Screenshot Style */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          color: 'var(--text3)',
          fontSize: 11,
          fontWeight: 600,
          animation: 'fadeIn 0.6s ease both'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <BarChart3 size={14} />
            <span>Analitik Real-time</span>
          </div>
          <div style={{ width: 1, height: 12, background: 'var(--border)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <ShieldCheck size={14} />
            <span>Akses Terenkripsi</span>
          </div>
        </div>
      </div>
    </div>
  );
}
