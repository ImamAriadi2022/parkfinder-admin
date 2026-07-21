import { Search } from 'lucide-react';

export default function UsersFilter({ search, setSearch, platformFilter, setPlatform, statusFilter, setStatus }) {
  return (
    <div className="filter-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 16 }}>
      <div className="input-icon-wrap" style={{ flex: 1, maxWidth: 320 }}>
        <Search size={14} className="input-icon" />
        <input
          className="input"
          placeholder="Cari nama, email, telepon, atau plat..."
          value={search || ''}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <div className="filter-tabs">
          {[['all', 'Semua'], ['mobile', 'Mobile App'], ['web', 'Web']].map(([v, l]) => (
            <button key={v} className={`filter-tab ${platformFilter === v ? 'active' : ''}`} onClick={() => setPlatform(v)}>{l}</button>
          ))}
        </div>
        <div className="filter-tabs">
          {[['all', 'Semua Status'], ['active', 'Aktif'], ['inactive', 'Non-Aktif']].map(([v, l]) => (
            <button key={v} className={`filter-tab ${statusFilter === v ? 'active' : ''}`} onClick={() => setStatus(v)}>{l}</button>
          ))}
        </div>
      </div>
    </div>
  );
}
