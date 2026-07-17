import { useState } from 'react';

export default function Toggle({ label, desc, defaultChecked = true }) {
  const [on, setOn] = useState(defaultChecked);
  
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '12px 0', borderBottom: '1px solid var(--border)'
    }}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{label}</div>
        {desc && <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>{desc}</div>}
      </div>
      <div onClick={() => setOn(!on)} style={{
        width: 46, height: 26, borderRadius: 13, cursor: 'pointer', position: 'relative',
        background: on ? 'var(--accent)' : 'var(--bg-hover)',
        border: `1px solid ${on ? 'var(--accent)' : 'var(--border)'}`,
        transition: 'all 0.2s', flexShrink: 0
      }}>
        <div style={{
          position: 'absolute', top: 2, width: 20, height: 20, borderRadius: '50%',
          background: on ? 'var(--bg-base)' : 'var(--text3)',
          left: on ? 22 : 2, transition: 'all 0.2s'
        }} />
      </div>
    </div>
  );
}
