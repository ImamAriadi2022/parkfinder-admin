export default function UsersInfoBox() {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, background: 'var(--accent2-glow)', border: '1px solid rgba(123,97,255,0.2)', borderRadius: 'var(--radius)', padding: '12px 16px', marginBottom: 16, fontSize: 13 }}>
      <span style={{ fontSize: 18, flexShrink: 0 }}>ℹ️</span>
      <span style={{ color: 'var(--text2)', lineHeight: 1.5 }}>
        Pengguna <strong style={{ color: 'var(--accent2)' }}>Web User</strong> menggunakan sistem tanpa login — ditampilkan sebagai <strong style={{ color: 'var(--accent2)' }}>Tamu</strong>. Data yang tersimpan hanya plat kendaraan dari form booking.
      </span>
    </div>
  );
}
