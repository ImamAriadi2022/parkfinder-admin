import { CheckCircle2, Smartphone, Globe } from 'lucide-react';

export default function UsersSummary({ total, active, inactive, mobile, guest }) {
  const items = [
    { label: 'Total Pengguna', value: total, subText: 'Users', color: 'var(--text3)', icon: null },
    { label: 'Aktif', value: active, color: 'var(--green)', icon: CheckCircle2 },
    { label: 'Non-Aktif', value: inactive, color: 'var(--text3)', icon: null },
    { label: 'Mobile App', value: mobile, color: 'var(--accent)', icon: Smartphone },
    { label: 'Web (Tamu)', value: guest, color: 'var(--text3)', icon: Globe }
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14, marginBottom: 20 }}>
      {items.map((s, i) => {
        const Icon = s.icon;
        return (
          <div key={i} className="card" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 8 }}>
              {s.label}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, lineHeight: 1 }}>
              <span style={{ fontSize: 28, fontWeight: 800, color: 'var(--text)' }}>{s.value}</span>
              {s.subText && <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text3)', marginLeft: 2 }}>{s.subText}</span>}
              {Icon && (
                <Icon size={16} style={{ color: s.color === 'var(--green)' ? '#10B981' : (s.color === 'var(--accent)' ? '#3B82F6' : 'var(--text3)'), marginLeft: 4 }} />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
