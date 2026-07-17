export default function ScansLiveIndicator() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg-card2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '10px 14px', marginBottom: 16, fontSize: 12, width: 'fit-content' }}>
      <span className="status-dot status-dot-green" />
      <span style={{ color: 'var(--text2)', fontWeight: 600 }}>Log Terupdate Secara Otomatis</span>
    </div>
  );
}
