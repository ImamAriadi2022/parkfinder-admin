import { Info } from 'lucide-react';

export default function UsersInfoBox() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      background: 'var(--accent-glow)',
      border: '1px solid var(--border2)',
      borderRadius: 'var(--radius)',
      padding: '14px 18px',
      marginBottom: 20,
      fontSize: 13
    }}>
      <div style={{
        width: 32,
        height: 32,
        borderRadius: 8,
        background: 'var(--accent)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#FFFFFF',
        flexShrink: 0
      }}>
        <Info size={16} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div style={{ fontWeight: 700, color: 'var(--text)' }}>Mengenai Web Users/Tamu</div>
        <div style={{ color: 'var(--text2)', lineHeight: 1.5, fontSize: 12 }}>
          Pengguna web adalah tamu yang melakukan reservasi tanpa registrasi akun. Data mereka disimpan berdasarkan sesi booking aktif.
        </div>
      </div>
    </div>
  );
}
