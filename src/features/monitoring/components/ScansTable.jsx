const fmtTime = iso => {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }) + ' ' + d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
};

export default function ScansTable({ filtered }) {
  return (
    <div className="card">
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Log ID</th><th>Kode Tiket</th><th>Pengguna</th><th>Plat Kendaraan</th>
              <th>Gedung</th><th>Aksi</th><th>Waktu Scan</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={8}><div className="empty-state"><div className="empty-icon">🔍</div><div>Tidak ada log scan ditemukan</div></div></td></tr>
            ) : filtered.map(s => (
              <tr key={s.id}>
                <td style={{ fontSize: 12, color: 'var(--text3)', fontFamily: 'monospace' }}>{s.id}</td>
                <td><span className="ticket-code">{s.ticketCode}</span></td>
                <td>
                  {s.userName !== '—' ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div className="avatar avatar-sm">{s.userName[0]}</div>
                      <span style={{ fontSize: 13, color: 'var(--text)' }}>{s.userName}</span>
                    </div>
                  ) : <span style={{ fontSize: 13, color: 'var(--red)' }}>⚠ Tidak dikenal</span>}
                </td>
                <td><span style={{ fontSize: 13, fontFamily: 'monospace', fontWeight: 700, color: s.plate !== '—' ? 'var(--text)' : 'var(--text3)' }}>{s.plate}</span></td>
                <td style={{ fontSize: 13, color: 'var(--text)' }}>{s.parking}</td>
                <td><span className={`badge ${s.action === 'masuk' ? 'badge-accent' : 'badge-orange'}`}>{s.action === 'masuk' ? '⬆ Masuk' : '⬇ Keluar'}</span></td>
                <td style={{ fontSize: 12 }}>{fmtTime(s.scanTime)}</td>
                <td><span className={`badge ${s.status === 'success' ? 'badge-green' : 'badge-red'}`}>{s.status === 'success' ? '✓ Berhasil' : '✕ Gagal'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
