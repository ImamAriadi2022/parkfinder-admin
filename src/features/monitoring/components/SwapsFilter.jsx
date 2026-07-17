import { Search } from 'lucide-react';

export default function SwapsFilter({ search, setSearch, statusFilter, setStatusFilter }) {
  return (
    <div className="filter-bar">
      <div className="input-icon-wrap" style={{ flex: 1, minWidth: 200 }}>
        <Search size={14} className="input-icon" />
        <input className="input" placeholder="Cari nama, tiket asal, plat, gedung..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <div className="filter-tabs">
        {[['all', 'Semua'], ['success', '✓ Sukses'], ['pending', '⏳ Pending'], ['failed', '✕ Gagal']].map(([v, l]) => (
          <button key={v} className={`filter-tab ${statusFilter === v ? 'active' : ''}`} onClick={() => setStatusFilter(v)}>{l}</button>
        ))}
      </div>
    </div>
  );
}
