import { Car } from 'lucide-react';

export default function LoginHeader() {
  return (
    <div style={{ textAlign: 'center', marginBottom: 28 }}>
      <div style={{
        width: 48,
        height: 48,
        borderRadius: 12,
        background: 'var(--accent)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 16px',
        boxShadow: 'var(--shadow-glow)'
      }}>
        <Car size={24} color="#FFFFFF" />
      </div>
      <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)', marginBottom: 4, fontFamily: 'Inter, sans-serif' }}>
        ParkFinder Admin
      </h1>
      <p style={{ fontSize: 12, color: 'var(--text3)', fontWeight: 500 }}>Akses Portal Manajemen</p>
    </div>
  );
}
