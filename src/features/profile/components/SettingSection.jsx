export default function SettingSection({ icon: Icon, title, children }) {
  return (
    <div className="card" style={{ marginBottom: 16 }}>
      <div className="card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: 'var(--accent-glow)', border: '1px solid var(--border2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Icon size={16} color="var(--accent)" />
          </div>
          <span className="card-title">{title}</span>
        </div>
      </div>
      <div className="card-body">{children}</div>
    </div>
  );
}
