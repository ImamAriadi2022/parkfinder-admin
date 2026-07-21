import { Smartphone, Globe, MoreVertical } from 'lucide-react';

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
              <th>Pengguna</th>
              <th>Kontak</th>
              <th>Plat Kendaraan</th>
              <th>Platform</th>
              <th>Total Booking</th>
              <th>Booking Aktif</th>
              <th>Bergabung</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9}>
                  <div className="empty-state">
                    <div className="empty-icon">👤</div>
                    <div>Tidak ada pengguna ditemukan</div>
                  </div>
                </td>
              </tr>
            ) : filtered.map(u => {
              const guest = isGuest(u);
              return (
                <tr key={u.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div className="avatar" style={{
                        width: 36, height: 36, borderRadius: '50%',
                        background: guest ? 'var(--accent-glow)' : 'var(--bg-hover)',
                        color: guest ? 'var(--accent)' : 'var(--text2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 700, fontSize: 13
                      }}>
                        {guest ? 'W' : (u.name || 'U').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{guest ? 'Web User' : u.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>ID: {u.id || '-'}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    {guest ? (
                      <span style={{ fontSize: 12, color: 'var(--text3)', fontStyle: 'italic' }}>Tamu (Tanpa Akun)</span>
                    ) : (
                      <div>
                        <div style={{ fontSize: 13, color: 'var(--text)' }}>{u.email}</div>
                        <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>{u.phone}</div>
                      </div>
                    )}
                  </td>
                  <td>
                    <span style={{
                      display: 'inline-block',
                      fontFamily: 'monospace',
                      fontWeight: 800,
                      fontSize: 12,
                      color: 'var(--text)',
                      border: '1px solid var(--text)',
                      borderRadius: 4,
                      padding: '3px 8px',
                      background: 'var(--bg-base)',
                      letterSpacing: '0.5px',
                      textTransform: 'uppercase'
                    }}>
                      {u.plate || '—'}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${guest ? 'badge-purple' : 'badge-accent'}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, borderRadius: 6, padding: '3px 8px' }}>
                      {guest ? <Globe size={12} /> : <Smartphone size={12} />}
                      {guest ? 'Web' : 'Mobile'}
                    </span>
                  </td>
                  <td style={{ fontWeight: 700, color: 'var(--text)' }}>{u.totalBookings}</td>
                  <td>
                    {u.activeBookings > 0 ? (
                      <span className="badge badge-green" style={{ borderRadius: 6, padding: '3px 8px' }}>
                        {u.activeBookings} Aktif
                      </span>
                    ) : (
                      <span style={{ fontSize: 13, color: 'var(--text3)' }}>—</span>
                    )}
                  </td>
                  <td style={{ fontSize: 12 }}>{fmtDate(u.joinDate)}</td>
                  <td>
                    <span className={`badge ${u.status === 'active' ? 'badge-green' : 'badge-gray'}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, borderRadius: 6, padding: '3px 8px' }}>
                      <span className="status-dot" style={{
                        width: 6, height: 6, borderRadius: '50%',
                        background: u.status === 'active' ? 'var(--green)' : 'var(--text3)',
                        animation: 'none', marginRight: 0
                      }} />
                      {u.status === 'active' ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => setSelectedUser(u)}
                      style={{ padding: 6, borderRadius: 8 }}
                      title="Detail Pengguna"
                    >
                      <MoreVertical size={14} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
