const fmtDate = iso => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
};

export default function UsersTable({ filtered, isGuest, setSelectedUser }) {
  return (
    <div className="card">
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Pengguna</th><th>Kontak</th><th>Plat Kendaraan</th><th>Platform</th><th>Total Booking</th>
              <th>Booking Aktif</th><th>Bergabung</th><th>Terakhir Aktif</th><th>Status</th><th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={10}><div className="empty-state"><div className="empty-icon">👤</div><div>Tidak ada pengguna ditemukan</div></div></td></tr>
            ) : filtered.map(u => {
              const guest = isGuest(u);
              return (
                <tr key={u.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="avatar" style={{ background: guest ? 'linear-gradient(135deg,var(--accent2),#a855f7)' : undefined }}>
                        {guest ? '👤' : u.name[0]}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{guest ? 'Tamu' : u.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text3)' }}>{u.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    {guest ? <span style={{ fontSize: 12, color: 'var(--text3)', fontStyle: 'italic' }}>Tidak ada akun</span> : (
                      <div>
                        <div style={{ fontSize: 12, color: 'var(--text)' }}>{u.email}</div>
                        <div style={{ fontSize: 11, color: 'var(--text3)' }}>{u.phone}</div>
                      </div>
                    )}
                  </td>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: 13, color: 'var(--accent)', letterSpacing: '0.5px' }}>{u.plate || '—'}</span>
                  </td>
                  <td><span className={`badge ${guest ? 'badge-purple' : 'badge-accent'}`}>{guest ? '🌐 Web (Tamu)' : '📱 Mobile'}</span></td>
                  <td style={{ fontWeight: 700, color: 'var(--text)' }}>{u.totalBookings}</td>
                  <td>{u.activeBookings > 0 ? <span className="badge badge-green">● {u.activeBookings} Aktif</span> : <span style={{ fontSize: 13, color: 'var(--text3)' }}>—</span>}</td>
                  <td style={{ fontSize: 12 }}>{fmtDate(u.joinDate)}</td>
                  <td style={{ fontSize: 12 }}>{fmtDate(u.lastActive)}</td>
                  <td><span className={`badge ${u.status === 'active' ? 'badge-green' : 'badge-gray'}`}>{u.status === 'active' ? '● Aktif' : '○ Nonaktif'}</span></td>
                  <td><button className="btn btn-ghost btn-sm" onClick={() => setSelectedUser(u)}>Detail</button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
