export default function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  
  return (
    <div style={{
      background: 'var(--bg-card2)',
      border: '1px solid var(--border2)',
      borderRadius: 10,
      padding: '10px 14px',
      fontSize: 13
    }}>
      <div style={{
        color: 'var(--text3)',
        marginBottom: 6,
        fontWeight: 600
      }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, fontWeight: 700 }}>
          {p.name}: {p.value}
        </div>
      ))}
    </div>
  );
}
