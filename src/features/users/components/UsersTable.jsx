import { Smartphone, Globe, MoreVertical, ChevronLeft, ChevronRight } from 'lucide-react';

const fmtDate = iso => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
};

const getAvatarTheme = name => {
  const char = (name || 'T').toUpperCase().charAt(0);
  const code = char.charCodeAt(0) || 0;
  const themes = [
    { bg: 'rgba(59,130,246,0.12)', fg: '#3B82F6' },  // Blue
    { bg: 'rgba(168,85,247,0.12)', fg: '#A855F7' }, // Purple
    { bg: 'rgba(245,158,11,0.12)', fg: '#F59E0B' }, // Orange
    { bg: 'rgba(20,184,166,0.12)', fg: '#14B8A6' }   // Teal
  ];
  return themes[code % themes.length];
};

export default function UsersTable({ filtered, isGuest, setSelectedUser, totalCount, currentPage, setCurrentPage, pageSize }) {
  const totalPages = Math.ceil(totalCount / pageSize) || 1;
  const startIdx = (currentPage - 1) * pageSize + 1;
  const endIdx = Math.min(currentPage * pageSize, totalCount);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <div className="table-wrap">
        <table className="data-table" style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th style={{ padding: '14px 20px', fontSize: 10, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Pengguna</th>
              <th style={{ padding: '14px 20px', fontSize: 10, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Kontak</th>
              <th style={{ padding: '14px 20px', fontSize: 10, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Plat Kendaraan</th>
              <th style={{ padding: '14px 20px', fontSize: 10, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Platform</th>
              <th style={{ padding: '14px 20px', fontSize: 10, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Total Booking</th>
              <th style={{ padding: '14px 20px', fontSize: 10, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Booking Aktif</th>
              <th style={{ padding: '14px 20px', fontSize: 10, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Bergabung</th>
              <th style={{ padding: '14px 20px', fontSize: 10, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.8px', textAlign: 'center' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8}>
                  <div className="empty-state" style={{ padding: '40px 20px' }}>
                    <div className="empty-icon" style={{ fontSize: 24, marginBottom: 8 }}>👤</div>
                    <div style={{ color: 'var(--text3)', fontSize: 13 }}>Tidak ada pengguna ditemukan</div>
                  </div>
                </td>
              </tr>
            ) : filtered.map(u => {
              const guest = isGuest(u);
              const theme = getAvatarTheme(u.name);
              return (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div className="avatar" style={{
                        width: 36, height: 36, borderRadius: '50%',
                        background: theme.bg,
                        color: theme.fg,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 700, fontSize: 13, border: 'none'
                      }}>
                        {(u.name || 'T').charAt(0).toUpperCase()}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 160 }} title={u.name}>{u.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 160 }} title={guest ? 'Tamu' : (u.email || '—')}>
                          {guest ? 'Tamu' : (u.email || '—')}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{ fontSize: 13, color: 'var(--text2)', fontWeight: 500 }}>
                      {guest ? 'Tamu (Tanpa Akun)' : (u.phone || '—')}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{
                      display: 'inline-block',
                      fontFamily: 'monospace',
                      fontWeight: 800,
                      fontSize: 12,
                      color: 'var(--text)',
                      border: '1px solid var(--border)',
                      borderRadius: 6,
                      padding: '3px 8px',
                      background: 'rgba(255,255,255,0.02)',
                      letterSpacing: '0.5px',
                      textTransform: 'uppercase'
                    }}>
                      {u.plate || '—'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <span className={`badge ${guest ? 'badge-purple' : 'badge-accent'}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, borderRadius: 6, padding: '3px 8px', fontSize: 11, fontWeight: 600 }}>
                      {guest ? <Globe size={11} /> : <Smartphone size={11} />}
                      {guest ? 'Web' : 'Mobile App'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px', fontWeight: 800, color: 'var(--text)', fontSize: 13 }}>{u.totalBookings}</td>
                  <td style={{ padding: '14px 20px' }}>
                    {u.activeBookings > 0 ? (
                      <span className="badge badge-green" style={{ borderRadius: 6, padding: '3px 8px', fontSize: 11, fontWeight: 700 }}>
                        {u.activeBookings}
                      </span>
                    ) : (
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 6,
                        padding: '3px 8px',
                        fontSize: 11,
                        fontWeight: 700,
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid var(--border)',
                        color: 'var(--text3)',
                        minWidth: 20
                      }}>
                        0
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '14px 20px', fontSize: 12, color: 'var(--text2)', fontWeight: 500 }}>{fmtDate(u.joinDate)}</td>
                  <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => setSelectedUser(u)}
                      style={{ padding: 6, borderRadius: 8, color: 'var(--text2)' }}
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

      {/* Pagination Footer Row - Screenshot Style */}
      {totalCount > 0 && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 20px',
          background: 'rgba(0, 0, 0, 0.05)',
          borderTop: '1px solid var(--border)',
          flexWrap: 'wrap',
          gap: 12
        }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
            MENAMPILKAN {startIdx}-{endIdx} DARI {totalCount} PENGGUNA
          </div>
          
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            {/* Prev Arrow */}
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              style={{
                background: 'transparent',
                border: '1px solid var(--border)',
                borderRadius: 6,
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: currentPage === 1 ? 'var(--text3)' : 'var(--text2)',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                opacity: currentPage === 1 ? 0.4 : 1
              }}
            >
              <ChevronLeft size={14} />
            </button>

            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(pageNo => {
              const isPageActive = currentPage === pageNo;
              return (
                <button
                  key={pageNo}
                  onClick={() => setCurrentPage(pageNo)}
                  style={{
                    background: isPageActive ? 'var(--accent)' : 'transparent',
                    border: isPageActive ? 'none' : '1px solid var(--border)',
                    borderRadius: 6,
                    width: 32,
                    height: 32,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isPageActive ? '#FFFFFF' : 'var(--text2)',
                    fontWeight: 700,
                    fontSize: 12,
                    cursor: 'pointer'
                  }}
                >
                  {pageNo}
                </button>
              );
            })}

            {/* Next Arrow */}
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              style={{
                background: 'transparent',
                border: '1px solid var(--border)',
                borderRadius: 6,
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: currentPage === totalPages ? 'var(--text3)' : 'var(--text2)',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                opacity: currentPage === totalPages ? 0.4 : 1
              }}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
