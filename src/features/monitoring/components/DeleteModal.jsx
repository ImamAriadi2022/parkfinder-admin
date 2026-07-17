import { useState } from 'react';

export default function DeleteModal({ staff, onClose, onConfirm }) {
  const [loading, setLoading] = useState(false);
  
  const handle = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    onConfirm(staff);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1001,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
    }} onClick={onClose}>
      <div style={{
        background: 'var(--bg-card)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius-lg)',
        width: '100%', maxWidth: 400, padding: 28, animation: 'fadeUp .3s ease'
      }} onClick={e => e.stopPropagation()}>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: 44, marginBottom: 12 }}>⚠️</div>
          <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--text)', marginBottom: 8 }}>Hapus Staff?</h3>
          <p style={{ fontSize: 13, color: 'var(--text3)', lineHeight: 1.5 }}>
            Akun <strong style={{ color: 'var(--red)' }}>{staff.name}</strong> ({staff.parkingName}) akan dihapus permanen dari sistem.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-ghost" onClick={onClose} style={{ flex: 1, justifyContent: 'center' }}>Batal</button>
          <button className="btn btn-danger" onClick={handle} disabled={loading} style={{ flex: 1, justifyContent: 'center' }}>
            {loading ? 'Menghapus...' : '🗑️ Ya, Hapus'}
          </button>
        </div>
      </div>
    </div>
  );
}
