import { CheckCircle2, Smartphone, Globe, Users } from 'lucide-react';

export default function UsersSummary({ total, active, inactive, mobile, guest }) {
  const items = [
    { label: 'Total Pengguna', value: `${total} Users`, color: 'var(--text)', icon: Users, bg: 'var(--bg-hover)' },
    { label: 'Aktif', value: active, color: 'var(--green)', icon: CheckCircle2, bg: 'rgba(16,185,129,0.08)' },
    { label: 'Non-Aktif', value: inactive, color: 'var(--text3)', icon: null, bg: 'var(--bg-hover)' },
    { label: 'Mobile App', value: mobile, color: 'var(--accent)', icon: Smartphone, bg: 'var(--accent-glow)' },
    { label: 'Web (Tamu)', value: guest, color: 'var(--accent)', icon: Globe, bg: 'var(--accent-glow)' }
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12, marginBottom: 20 }}>
      {items.map((s, i) => {
        const Icon = s.icon;
        return (
          <div key={i} className="card animate-fade-up" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>{s.label}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)' }}>{s.value}</span>
              {Icon && (
                <span style={{ display: 'inline-flex', padding: 4, borderRadius: 6, background: s.bg, color: s.color }}>
                  <Icon size={14} />
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
