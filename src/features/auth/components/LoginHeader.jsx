const LOGO_URL = 'https://storage.googleapis.com/parkfinderbucket/foto/logo.png';

export default function LoginHeader({ mode }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: 28 }}>
      <div style={{ marginBottom: 12 }}>
        <img src={LOGO_URL} alt="ParkFinder" style={{ height: 48, width: 'auto', objectFit: 'contain' }} onError={e => { e.target.style.display = 'none'; }} />
      </div>
      <h1 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)', marginBottom: 4 }}>
        Selamat Datang, <span style={{ background: 'linear-gradient(90deg,var(--accent),var(--accent2))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          {mode === 'admin' ? 'Admin Parkir' : 'Staff Gedung'}
        </span>
      </h1>
      <p style={{ fontSize: 13, color: 'var(--text3)' }}>Masuk ke panel monitoring ParkFinder</p>
    </div>
  );
}
