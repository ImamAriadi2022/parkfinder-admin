import { AlertTriangle, Car, MapPin, LayoutGrid, ShieldCheck, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../../core/providers/AppProvider';
import { parkingService } from '../../parking-area/services/parking.service';
import { slotService } from '../../parking-slot/services/slot.service';

export default function Dashboard() {
  const { user, isSuperAdmin } = useApp();
  const navigate = useNavigate();
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const assignedAreaId =
    user?.areaId ||
    user?.parkingId ||
    user?.assignedAreaId ||
    user?.adminAreaId ||
    user?.managedAreaId ||
    '';

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      let areasList = [];

      if (isSuperAdmin) {
        // Fetch all areas for super admin
        const res = await parkingService.getAll();
        const list = res.data || res || [];
        areasList = Array.isArray(list) ? list : [];
      } else {
        // Fetch only the assigned area for normal admin area / staff
        if (assignedAreaId) {
          const res = await parkingService.getById(assignedAreaId);
          const areaData = res.data || res;
          if (areaData && areaData.id) {
            areasList = [areaData];
          }
        }
      }
      
      // Fetch slots for each area to calculate occupancy
      const areasWithSlots = await Promise.all(
        areasList.map(async (area) => {
          try {
            const slotsRes = await slotService.getByArea(area.id);
            const slots = (slotsRes.data || slotsRes || []);
            const totalSlots = slots.length || area.totalSlots || 0;
            const usedSlots = slots.filter(s => (s.status || s.appStatus) === 'occupied').length;
            return {
              ...area,
              totalSlots: totalSlots || area.totalSlots || 0,
              usedSlots: usedSlots || area.usedSlots || 0,
              slots: slots,
            };
          } catch (err) {
            console.warn(`Gagal fetch slots untuk area ${area.id}:`, err);
            // Fallback to area data if slot fetch fails
            return {
              ...area,
              totalSlots: area.totalSlots || 0,
              usedSlots: area.usedSlots || 0,
              slots: [],
            };
          }
        })
      );
      
      setAreas(areasWithSlots);
    } catch (err) {
      setError(err.message || 'Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isSuperAdmin, user?.areaId, user?.parkingId, user?.managedAreaId]);

  // Compute stats from actual data
  const totalAreas = areas.length;
  const totalSlots = areas.reduce((s, a) => s + (a.totalSlots || 0), 0);
  const occupiedSlots = areas.reduce((s, a) => s + (a.usedSlots || 0), 0);
  const availableSlots = totalSlots - occupiedSlots;
  const occupancyPct = totalSlots > 0 ? Math.round((occupiedSlots / totalSlots) * 100) : 0;

  const stats = [
    { label: 'TOTAL AREA PARKIR', value: totalAreas, icon: MapPin, color: 'var(--accent)', bg: 'var(--accent-glow)' },
    { label: 'TOTAL SLOT', value: totalSlots, icon: LayoutGrid, color: 'var(--accent)', bg: 'var(--accent-glow)' },
    { label: 'SLOT TERISI', value: occupiedSlots, icon: Car, color: 'var(--red)', bg: 'rgba(239,68,68,0.08)' },
    { label: 'SLOT KOSONG', value: availableSlots, icon: ShieldCheck, color: 'var(--accent)', bg: 'var(--accent-glow)' },
  ];

  const getOccupancyColor = (pct) => {
    if (pct >= 80) return 'var(--red)';
    if (pct >= 50) return 'var(--orange)';
    return 'var(--green)';
  };

  return (
    <div className="animate-fade-up">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-sub">Selamat datang, {user?.name || 'Admin'}</p>
        </div>
        <button className="btn btn-ghost" onClick={fetchData} disabled={loading}>
          <RefreshCw size={14} className={loading ? 'spin-icon' : ''} /> Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div style={{
          padding: '12px 16px', borderRadius: 10, marginBottom: 20,
          background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
          color: 'var(--red)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <AlertTriangle size={16} /> {error}
        </div>
      )}

      {/* Stats - Screenshot Style (Split Left/Right) */}
      <div className="stat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16, marginBottom: 24 }}>
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="card animate-fade-up" style={{
              padding: '20px 24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)'
            }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>{s.label}</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: s.color === 'var(--red)' ? 'var(--red)' : 'var(--text)' }}>
                  {loading ? '—' : s.value}
                </div>
              </div>
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: s.bg,
                color: s.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Icon size={20} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Occupancy Overview */}
      <div className="section-grid section-grid-2">
        {/* Area occupancy */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Okupansi per Area</span>
            <span className="badge badge-accent">{occupancyPct}% Total</span>
          </div>
          <div className="card-body">
            {loading ? (
              <div className="empty-state" style={{ padding: '32px 0' }}>
                <div style={{ width: 32, height: 32, border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              </div>
            ) : areas.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🏗️</div>
                <p>Belum ada area parkir</p>
                <button className="btn btn-primary btn-sm" style={{ marginTop: 12 }} onClick={() => navigate('/parkings')}>
                  Tambah Area
                </button>
              </div>
            ) : (
              areas.map((area) => {
                const total = area.totalSlots || 0;
                const used = area.usedSlots || 0;
                const avail = total - used;
                const pct = total > 0 ? Math.round((used / total) * 100) : 0;
                return (
                  <div key={area.id} className="parking-row">
                    <div className="parking-row-name">
                      <div className="name">{area.name}</div>
                      <div className="address">{pct}% ({used}/{total} Slots)</div>
                    </div>
                    <div className="parking-row-bar">
                      <div className="progress">
                        <div
                          className="progress-bar"
                          style={{ width: `${pct}%`, background: getOccupancyColor(pct) }}
                        />
                      </div>
                    </div>
                    <div className="parking-row-pct" style={{ color: getOccupancyColor(pct) }}>{pct}%</div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Quick Info */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Informasi Sistem</span>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--text2)', fontSize: 13 }}>Role Anda</span>
                <span className={`badge ${user?.role === 'superAdmin' ? 'badge-accent' : 'badge-blue'}`}>
                  {user?.role === 'superAdmin' ? 'Super Admin' : 'Admin Parkir'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--text2)', fontSize: 13 }}>Email</span>
                <span style={{ color: 'var(--text)', fontSize: 13, fontWeight: 600 }}>{user?.email || '-'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--text2)', fontSize: 13 }}>Total Okupansi</span>
                <span style={{ color: getOccupancyColor(occupancyPct), fontSize: 18, fontWeight: 800 }}>{occupancyPct}%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
                <span style={{ color: 'var(--text2)', fontSize: 13 }}>Status Sistem</span>
                <span className="badge badge-green"><span className="status-dot status-dot-green" />Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
