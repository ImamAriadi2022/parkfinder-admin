const fmtTime = iso => {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }) + ' ' + d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
};

export default function SwapsTable({ filtered }) {
  return (
    <div className="card">
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Swap ID</th><th>Pengguna</th><th>Tiket Lama</th><th>Dari</th><th>Ke</th><th>Tiket Baru</th><th>Waktu</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={8}><div className="empty-state"><div className="empty-icon">🔄</div><div>Tidak ada data swap ditemukan</div></div></td></tr>
            ) : filtered.map(s => (
              <tr key={s.id}>
                <td style={{ fontSize: 12, color: 'var(--text3)', fontFamily: 'monospace' }}>{s.id}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div className="avatar avatar-sm">{s.userName[0]}</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{s.userName}</div>
                      <div style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--text3)' }}>{s.plate}</div>
                    </div>
                  </div>
                </td>
                <td><span className="ticket-code">{s.ticketOld}</span></td>
                <td>
                  <div style={{ fontSize: 13, color: 'var(--text)' }}>{s.fromParking}</div>
                  <div style={{ fontSize: 11, color: 'var(--text3)' }}>{s.fromSlot}</div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ color: 'var(--accent)', fontWeight: 700 }}>→</span>
                    <div>
                      <div style={{ fontSize: 13, color: 'var(--text)' }}>{s.toParking}</div>
                      <div style={{ fontSize: 11, color: 'var(--text3)' }}>{s.toSlot}</div>
                    </div>
                  </div>
                </td>
                <td>
                  {s.ticketNew ? <span className="ticket-code" style={{ color: 'var(--green)' }}>{s.ticketNew}</span> : <span style={{ color: 'var(--text3)', fontSize: 12 }}>—</span>}
                </td>
                <td style={{ fontSize: 12 }}>{fmtTime(s.swapTime)}</td>
                <td>
                  <span className={`badge ${s.status === 'success' ? 'badge-green' : s.status === 'failed' ? 'badge-red' : 'badge-orange'}`}>
                    {s.status === 'success' ? '✓ Berhasil' : s.status === 'failed' ? '✕ Gagal' : '⏳ Pending'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
