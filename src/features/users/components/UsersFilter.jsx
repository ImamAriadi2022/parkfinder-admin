import { Search } from 'lucide-react';

export default function UsersFilter({ search, setSearch, platformFilter, setPlatform }) {
  return (
    <div className="filter-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 16 }}>
      <div className="input-icon-wrap" style={{ flex: 1, maxWidth: 320 }}>
        <Search size={14} className="input-icon" />
        <input
          className="input"
          placeholder="Cari nama, email, atau plat..."
          value={search || ''}
          onChange={e => setSearch(e.target.value)}
          style={{ height: 40, fontSize: 13 }}
        />
      </div>
      <div className="filter-tabs" style={{ height: 40 }}>
        {[['all', 'Semua'], ['mobile', 'Mobile App'], ['web', 'Web']].map(([v, l]) => (
          <button
            key={v}
            className={`filter-tab ${platformFilter === v ? 'active' : ''}`}
            onClick={() => setPlatform(v)}
            style={{ height: '100%', padding: '0 20px', display: 'inline-flex', alignItems: 'center' }}
          >
            {l}
          </button>
        ))}
      </div>
    </div>
  );
}
