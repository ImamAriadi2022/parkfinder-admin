import { Info } from 'lucide-react';

export default function UsersInfoBox() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: 12,
      background: 'var(--accent-glow)',
      border: '1px solid var(--border)',
      borderLeft: '4px solid var(--accent)',
      borderRadius: 'var(--radius)',
      padding: '14px 18px',
      marginBottom: 20,
      fontSize: 13
    }}>
      <Info size={18} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 1 }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div style={{ fontWeight: 700, color: 'var(--text)' }}>Mengenai Web Users/Tamu</div>
        <div style={{ color: 'var(--text2)', lineHeight: 1.5, fontSize: 12 }}>
          Web user adalah pengguna tidak terdaftar yang menggunakan website tamu untuk memesan slot parkir secara langsung tanpa akun. Data pengguna ini disimpan berdasarkan nomor plat kendaraan saat booking.
        </div>
      </div>
    </div>
  );
}
