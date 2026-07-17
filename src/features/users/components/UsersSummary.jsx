export default function UsersSummary({ total, active, inactive, mobile, guest }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(155px,1fr))', gap: 12, marginBottom: 20 }}>
      {[
        { label: 'Total Pengguna', value: total, color: 'var(--text)' },
        { label: 'Aktif', value: active, color: 'var(--green)' },
        { label: 'Non-Aktif', value: inactive, color: 'var(--text3)' },
        { label: 'Mobile App', value: mobile, color: 'var(--accent)' },
        { label: 'Web (Tamu)', value: guest, color: 'var(--accent2)' }
      ].map((s, i) => (
        <div key={i} className="card" style={{ padding: '14px 18px', textAlign: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
          <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 3 }}>{s.label}</div>
        </div>
      ))}
    </div>
  );
}
