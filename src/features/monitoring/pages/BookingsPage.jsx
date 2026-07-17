import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import BookingDetailModal from '../components/BookingDetailModal';
import { getBookings } from '../services/monitoring.service';

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

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const PER_PAGE = 6;

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const data = await getBookings();
        setBookings(data);
        setLoading(false);
      } catch (error) {
        console.error('Error loading bookings:', error);
        setLoading(false);
      }
    };
    loadBookings();
  }, []);

  const filtered = bookings.filter(b => {
    const matchSearch = b.userName.toLowerCase().includes(search.toLowerCase()) || b.id.toLowerCase().includes(search.toLowerCase()) || b.plate.toLowerCase().includes(search.toLowerCase()) || b.parkingName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchSearch && matchStatus;
  });
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const counts = {
    all: bookings.length,
    active: bookings.filter(b => b.status === 'active').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    swapped: bookings.filter(b => b.status === 'swapped').length
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">📋 Manajemen Booking</h1>
          <p className="page-sub">Monitor dan kelola semua transaksi booking parkir</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost">Export CSV</button>
        </div>
      </div>

      {/* Summary mini cards */}
      <div className="summary-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(140px,1fr))',
        gap: 12,
        marginBottom: 20
      }}>
        {[
          { label: 'Total', value: counts.all, color: 'var(--text)' },
          { label: 'Aktif', value: counts.active, color: 'var(--green)' },
          { label: 'Selesai', value: counts.completed, color: 'var(--text3)' },
          { label: 'Ditukar', value: counts.swapped, color: 'var(--accent)' }
        ].map((s, i) => (
          <div key={i} className="card" style={{ padding: '14px 18px', textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 3 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div className="filter-bar">
        <div className="input-icon-wrap" style={{ flex: 1, minWidth: 200 }}>
          <Search size={14} className="input-icon" />
          <input className="input" placeholder="Cari nama, kode tiket, plat, gedung..." value={search} onChange={e => {
            setSearch(e.target.value);
            setPage(1);
          }} />
        </div>
        <div className="filter-tabs">
          {[
            ['all', 'Semua'],
            ['active', 'Aktif'],
            ['completed', 'Selesai'],
            ['swapped', 'Ditukar']
          ].map(([v, l]) => (
            <button key={v} className={`filter-tab ${statusFilter === v ? 'active' : ''}`} onClick={() => {
              setStatusFilter(v);
              setPage(1);
            }}>{l}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Kode Tiket</th>
                <th>Pengguna</th>
                <th>Plat</th>
                <th>Gedung / Slot</th>
                <th>Durasi</th>
                <th>Waktu Booking</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <div className="empty-state">
                      <div className="empty-icon">🔍</div>
                      <div>Tidak ada data ditemukan</div>
                    </div>
                  </td>
                </tr>
              ) : paged.map(b => {
                const s = STATUS_MAP[b.status] || { label: b.status, cls: 'badge-gray', prefix: '' };
                return (
                  <tr key={b.id}>
                    <td><span className="ticket-code">{b.id}</span></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div className="avatar avatar-sm">{b.userName[0]}</div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{b.userName}</div>
                          <div style={{ fontSize: 11, color: 'var(--text3)' }}>{b.userPhone}</div>
                        </div>
                      </div>
                    </td>
                    <td><span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', fontFamily: 'monospace' }}>{b.plate}</span></td>
                    <td>
                      <div style={{ fontSize: 13, color: 'var(--text)' }}>{b.parkingName}</div>
                      <div style={{ fontSize: 11, color: 'var(--text3)' }}>{b.floor} / {b.slot}</div>
                    </td>
                    <td><span style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 700 }}>{b.duration || '—'}</span></td>
                    <td><span style={{ fontSize: 12 }}>{fmtDate(b.createdAt)}</span></td>
                    <td><span className={`badge ${s.cls}`}>{s.prefix} {s.label}</span></td>
                    <td>
                      <button className="btn btn-ghost btn-sm" onClick={() => setSelected(b)}>Detail</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{
            padding: '14px 20px', borderTop: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between'
          }}>
            <div style={{ fontSize: 13, color: 'var(--text3)' }}>
              Menampilkan {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} dari {filtered.length} data
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button className="btn btn-ghost btn-sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                <button key={n} className={`btn btn-sm ${n === page ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setPage(n)}>{n}</button>
              ))}
              <button className="btn btn-ghost btn-sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next →</button>
            </div>
          </div>
        )}
      </div>

      {selected && <BookingDetailModal booking={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
