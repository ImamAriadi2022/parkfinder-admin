export default function LoginRoleToggle({ mode, switchMode }) {
  return (
    <div style={{ display: 'flex', background: 'var(--bg-base)', border: '1px solid var(--border)', borderRadius: 12, padding: 4, marginBottom: 24, gap: 4 }}>
      {[['admin', '🛡️  Admin Parkir', 'Kelola gedung dan akun'], ['staff', '👷  Staff Gedung', 'Monitoring 1 gedung']].map(([r, label, sub]) => (
        <button key={r} type="button" onClick={() => switchMode(r)} style={{
          flex: 1, padding: '10px 8px', borderRadius: 9, border: 'none', cursor: 'pointer',
          background: mode === r ? 'var(--bg-card)' : 'transparent', boxShadow: mode === r ? '0 2px 8px rgba(0,0,0,0.25)' : 'none',
          transition: 'all 0.2s', textAlign: 'center'
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: mode === r ? 'var(--accent)' : 'var(--text3)' }}>{label}</div>
          <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 2 }}>{sub}</div>
        </button>
      ))}
    </div>
  );
}
