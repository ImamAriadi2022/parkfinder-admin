import { Search } from 'lucide-react';

export default function UsersFilter({ search, setSearch, platformFilter, setPlatform, statusFilter, setStatus }) {
  return (
    <div className="filter-bar">
      <div className="input-icon-wrap" style={{ flex: 1, minWidth: 200 }}>
        <Search size={14} className="input-icon" />
        <input className="input" placeholder="Cari nama, email, telepon, atau plat..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <div className="filter-tabs">
        {[['all', 'Semua'], ['mobile', 'Mobile App'], ['web', 'Web (Tamu)']].map(([v, l]) => (
          <button key={v} className={`filter-tab ${platformFilter === v ? 'active' : ''}`} onClick={() => setPlatform(v)}>{l}</button>
        ))}
      </div>
      <div className="filter-tabs">
        {[['all', 'Semua Status'], ['active', 'Aktif'], ['inactive', 'Non-Aktif']].map(([v, l]) => (
          <button key={v} className={`filter-tab ${statusFilter === v ? 'active' : ''}`} onClick={() => setStatus(v)}>{l}</button>
        ))}
      </div>
    </div>
  );
}
