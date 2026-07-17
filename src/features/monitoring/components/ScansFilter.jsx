import { Search } from 'lucide-react';

export default function ScansFilter({ search, setSearch, actionFilter, setActionFilter, statusFilter, setStatusFilter }) {
  return (
    <div className="filter-bar">
      <div className="input-icon-wrap" style={{ flex: 1, minWidth: 200 }}>
        <Search size={14} className="input-icon" />
        <input className="input" placeholder="Cari kode tiket, nama, plat, gedung..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <div className="filter-tabs">
        {[['all', 'Semua Aksi'], ['masuk', '⬆ Masuk'], ['keluar', '⬇ Keluar']].map(([v, l]) => (
          <button key={v} className={`filter-tab ${actionFilter === v ? 'active' : ''}`} onClick={() => setActionFilter(v)}>{l}</button>
        ))}
      </div>
      <div className="filter-tabs">
        {[['all', 'Semua Status'], ['success', '✓ Berhasil'], ['failed', '✕ Gagal']].map(([v, l]) => (
          <button key={v} className={`filter-tab ${statusFilter === v ? 'active' : ''}`} onClick={() => setStatusFilter(v)}>{l}</button>
        ))}
      </div>
    </div>
  );
}
