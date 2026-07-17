const fmtDate = iso => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
};

export default function UserDetailModal({ selectedUser, setSelectedUser, isGuest }) {
  if (!selectedUser) return null;
  
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={() => setSelectedUser(null)}>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border2)', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: 460, overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div className="avatar avatar-lg" style={{ background: isGuest(selectedUser) ? 'linear-gradient(135deg,var(--accent2),#a855f7)' : undefined }}>
            {isGuest(selectedUser) ? '👤' : selectedUser.name[0]}
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)' }}>{isGuest(selectedUser) ? 'Pengguna Tamu' : selectedUser.name}</div>
            <div style={{ fontSize: 13, color: 'var(--text3)' }}>{selectedUser.id}</div>
          </div>
          <button onClick={() => setSelectedUser(null)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', fontSize: 20 }}>✕</button>
        </div>
        {isGuest(selectedUser) && (
          <div style={{ background: 'var(--accent2-glow)', borderBottom: '1px solid var(--border)', padding: '10px 24px', fontSize: 12, color: 'var(--accent2)' }}>
            🌐 Pengguna ini mengakses melalui <strong>Web User</strong> tanpa login — tidak ada data akun.
          </div>
        )}
        <div style={{ padding: '20px 24px' }}>
          {[
            ['Platform', isGuest(selectedUser) ? '🌐 Web User (Tamu)' : '📱 Mobile App'],
            ['Plat Kendaraan', selectedUser.plate || '—'],
            ['Email', selectedUser.email || '—'],
            ['Telepon', selectedUser.phone || '—'],
            ['Total Booking', selectedUser.totalBookings],
            ['Booking Aktif', selectedUser.activeBookings],
            ['Bergabung', fmtDate(selectedUser.joinDate)],
            ['Terakhir Aktif', fmtDate(selectedUser.lastActive)],
            ['Status', selectedUser.status === 'active' ? '● Aktif' : '○ Nonaktif']
          ].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)', gap: 12 }}>
              <span style={{ fontSize: 13, color: 'var(--text3)' }}>{k}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', textAlign: 'right', maxWidth: 260 }}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{ padding: '14px 24px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          {!isGuest(selectedUser) && <button className="btn btn-danger btn-sm">Nonaktifkan</button>}
          <button className="btn btn-ghost btn-sm" onClick={() => setSelectedUser(null)}>Tutup</button>
        </div>
      </div>
    </div>
  );
}
