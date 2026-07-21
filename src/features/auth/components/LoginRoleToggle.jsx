import { Shield, Building2 } from 'lucide-react';

export default function LoginRoleToggle({ mode, switchMode }) {
  const roles = [
    { id: 'admin', label: 'Admin Parkir', icon: Shield },
    { id: 'staff', label: 'Staff Gedung', icon: Building2 }
  ];

  return (
    <div style={{ marginBottom: 24 }}>
      <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 10 }}>
        PILIH PERAN AKSES
      </label>
      <div style={{ display: 'flex', gap: 12 }}>
        {roles.map(role => {
          const Icon = role.icon;
          const isActive = mode === role.id;
          return (
            <button
              key={role.id}
              type="button"
              onClick={() => switchMode(role.id)}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '16px 12px',
                borderRadius: 10,
                border: isActive ? '2px solid var(--accent)' : '1px solid var(--border)',
                background: isActive ? 'var(--accent-glow)' : 'transparent',
                cursor: 'pointer',
                transition: 'all 0.2s',
                color: isActive ? 'var(--accent)' : 'var(--text3)'
              }}
            >
              <Icon size={18} style={{ color: isActive ? 'var(--accent)' : 'var(--text3)' }} />
              <span style={{ fontSize: 12, fontWeight: isActive ? 700 : 500 }}>
                {role.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
