export default function SwapsSummary({ total, success, failed, pending }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px,1fr))', gap: 12, marginBottom: 20 }}>
      {[
        { label: 'Total Permintaan', value: total, color: 'var(--text)' },
        { label: 'Sukses', value: success, color: 'var(--green)' },
        { label: 'Pending', value: pending, color: 'var(--orange)' },
        { label: 'Gagal', value: failed, color: failed > 0 ? 'var(--red)' : 'var(--text3)' }
      ].map((s, i) => (
        <div key={i} className="card" style={{ padding: '14px 18px', textAlign: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
          <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 3 }}>{s.label}</div>
        </div>
      ))}
    </div>
  );
}
