const fmtDate = iso => {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }) + ' ' + d.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

const STATUS_MAP = {
  active: { label: 'Aktif', cls: 'badge-green', prefix: '●' },
  completed: { label: 'Selesai', cls: 'badge-gray', prefix: '✓' },
  swapped: { label: 'Ditukar', cls: 'badge-accent', prefix: '⇄' },
  cancelled: { label: 'Batal', cls: 'badge-red', prefix: '✕' }
};

export default function BookingDetailModal({ booking, onClose }) {
  if (!booking) return null;
  const s = STATUS_MAP[booking.status] || { label: booking.status, cls: 'badge-gray', prefix: '' };
  
  return (
    <div className="modal" style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 999,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
    }} onClick={onClose}>
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border2)', borderRadius: 'var(--radius-lg)',
        width: '100%', maxWidth: 520, overflow: 'hidden'
      }} onClick={e => e.stopPropagation()}>
        <div style={{
          padding: '20px 24px', borderBottom: '1px solid var(--border)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 4 }}>TIKET PARKIR</div>
            <div className="ticket-code" style={{ fontSize: 16 }}>{booking.id}</div>
          </div>
          <span className={`badge ${s.cls}`}>{s.prefix} {s.label}</span>
        </div>

        <div style={{ padding: '20px 24px' }}>
          {[
            ['Nama Pemesan', booking.userName],
            ['No. Telepon', booking.userPhone],
            ['Plat Kendaraan', booking.plate],
            ['Gedung Parkir', booking.parkingName],
            ['Lantai / Slot', `${booking.floor} / ${booking.slot}`],
            ['Waktu Booking', fmtDate(booking.createdAt)],
            ['Waktu Scan Masuk', booking.scanTime ? fmtDate(booking.scanTime) : '—'],
            ['Waktu Keluar', booking.exitTime ? fmtDate(booking.exitTime) : '—'],
            ['Durasi', booking.duration || '—']
          ].map(([k, v]) => (
            <div key={k} style={{
              display: 'flex', justifyContent: 'space-between', padding: '10px 0',
              borderBottom: '1px solid var(--border)', gap: 12
            }}>
              <span style={{ fontSize: 13, color: 'var(--text3)' }}>{k}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', textAlign: 'right', maxWidth: 240 }}>{v}</span>
            </div>
          ))}
        </div>

        <div style={{
          padding: '16px 24px', display: 'flex', justifyContent: 'flex-end', gap: 10,
          borderTop: '1px solid var(--border)'
        }}>
          {booking.status === 'active' && <button className="btn btn-danger btn-sm">Force Checkout</button>}
          <button className="btn btn-ghost btn-sm" onClick={onClose}>Tutup</button>
        </div>
      </div>
    </div>
  );
}
