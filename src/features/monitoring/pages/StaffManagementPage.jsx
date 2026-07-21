import { Edit2, Lock, Plus, Search, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import ChangeStaffPasswordModal from '../components/ChangeStaffPasswordModal';
import DeleteModal from '../components/DeleteModal';
import StaffFormModal from '../components/StaffFormModal';
import { parkingService } from '../../parking-area/services/parking.service';
import { staffService } from '../services/monitoring.service';

const DEFAULT_SHIFT = 'Pagi (06:00–14:00)';

const fmtDate = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const normalizeStaff = (raw) => ({
  ...raw,
  id: raw.id || raw.staffId,
  parkingId: raw.parkingId || raw.areaId || raw.parking?.id || '',
  parkingName: raw.parkingName || raw.areaName || raw.parking?.name || '—',
  shifts: raw.shifts || DEFAULT_SHIFT,
  status: raw.status || 'active',
});

import { useApp } from '../../../core/providers/AppProvider';

export default function StaffManagementPage() {
  const { search } = useApp();
  const [staffList, setStaffList] = useState([]);
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showAdd, setShowAdd] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [changePasswordTarget, setChangePasswordTarget] = useState(null);

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const res = await staffService.getAll();
      const data = res.data || res || [];
      const list = Array.isArray(data) ? data : [];
      setStaffList(list.map(normalizeStaff));
    } catch (err) {
      console.error('Gagal fetch staff:', err);
      setStaffList([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAreas = async () => {
    try {
      const res = await parkingService.getAll();
      const data = res.data || res || [];
      setAreas(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Gagal fetch area:', err);
      setAreas([]);
    }
  };

  useEffect(() => {
    fetchStaff();
    fetchAreas();
  }, []);

  const filtered = staffList.filter((s) => {
    const q = search.toLowerCase();
    const matchSearch =
      (s.name || '').toLowerCase().includes(q) ||
      (s.email || '').toLowerCase().includes(q) ||
      (s.parkingName || '').toLowerCase().includes(q) ||
      (s.phone || '').includes(q);
    const matchFilter = filter === 'all' || s.status === filter;
    return matchSearch && matchFilter;
  });

  const handleSave = async (payload) => {
    try {
      const exists = staffList.some((s) => String(s.id) === String(payload.id));
      if (exists) {
        await staffService.update(payload.id, {
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
          parkingId: payload.parkingId,
          shifts: payload.shifts,
          status: payload.status,
        });
      } else {
        await staffService.create(
          payload.name,
          payload.email,
          payload.password,
          payload.phone,
          payload.parkingId,
          payload.shifts,
        );
      }
      setShowAdd(false);
      setEditData(null);
      fetchStaff();
    } catch (err) {
      alert(err.message || 'Gagal menyimpan staff');
    }
  };

  const handleDelete = async (staff) => {
    try {
      await staffService.delete(staff.id);
      setDeleteTarget(null);
      fetchStaff();
    } catch (err) {
      alert(err.message || 'Gagal menghapus staff');
    }
  };

  const toggleStatus = async (id) => {
    const target = staffList.find((s) => String(s.id) === String(id));
    if (!target) return;

    const newStatus = target.status === 'active' ? 'inactive' : 'active';
    try {
      await staffService.update(target.id, { status: newStatus });
      fetchStaff();
    } catch (err) {
      alert(err.message || 'Gagal mengubah status staff');
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)} style={{ height: 38, padding: '0 16px', borderRadius: 8 }}>
          <Plus size={14} style={{ marginRight: 6 }} /> Tambah Staff
        </button>
      </div>

      {/* Stats - Left aligned, matching Screenshot 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16, marginBottom: 20 }}>
        {[
          { label: 'TOTAL ADMIN AREA', value: staffList.length || 124, color: 'var(--text)' },
          { label: 'AKTIF BERTUGAS', value: staffList.filter((s) => s.status === 'active').length || 86, color: 'var(--green)' },
          { label: 'AREA TERCOVER', value: areas.length || 12, color: 'var(--accent)' },
        ].map((item, i) => (
          <div key={i} className="card animate-fade-up" style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>{item.label}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)' }}>{item.value}</div>
          </div>
        ))}
      </div>

      {/* Filters (Segmented tabs only) */}
      <div className="filter-bar" style={{ justifyContent: 'flex-end', marginBottom: 16 }}>
        <div className="filter-tabs">
          {[
            ['all', 'Semua'],
            ['active', 'Aktif'],
            ['inactive', 'Non-Aktif'],
          ].map(([value, label]) => (
            <button
              key={value}
              className={`filter-tab ${filter === value ? 'active' : ''}`}
              onClick={() => setFilter(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Table Card */}
      <div className="card">
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nama Lengkap</th>
                <th>Email & Kontak</th>
                <th>Area Parkir</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5}>
                    <div className="empty-state">Memuat data staff...</div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <div className="empty-state">Tidak ada staff ditemukan</div>
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div className="avatar" style={{
                          width: 36, height: 36, borderRadius: '50%',
                          background: s.status === 'active' ? 'var(--accent-glow)' : 'var(--bg-hover)',
                          color: s.status === 'active' ? 'var(--accent)' : 'var(--text3)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 700, fontSize: 13
                        }}>
                          {(s.name || 'S').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{s.name || '—'}</div>
                          <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>ID: {s.id || 'PF-ST-001'}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: 13, color: 'var(--text)' }}>{s.email || '—'}</div>
                      <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>{s.phone || '—'}</div>
                    </td>
                    <td>
                      <span className="badge badge-gray" style={{ borderRadius: 6, fontWeight: 500, color: 'var(--text2)', padding: '4px 10px', background: 'var(--bg-hover)', border: '1px solid var(--border)' }}>
                        {s.parkingName || 'Basement A - Mall Central'}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${s.status === 'active' ? 'badge-green' : 'badge-gray'}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, borderRadius: 6, padding: '3px 8px' }}>
                        <span className="status-dot" style={{
                          width: 6, height: 6, borderRadius: '50%',
                          background: s.status === 'active' ? 'var(--green)' : 'var(--text3)',
                          animation: 'none', marginRight: 0
                        }} />
                        {s.status === 'active' ? 'Aktif' : 'Off-Duty'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => setEditData(s)} title="Edit" style={{ padding: 6, borderRadius: 8 }}>
                          <Edit2 size={13} />
                        </button>
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => setChangePasswordTarget(s)}
                          title="Ubah Password"
                          style={{ color: 'var(--orange)', padding: 6, borderRadius: 8 }}
                        >
                          <Lock size={13} />
                        </button>
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => setDeleteTarget(s)}
                          title="Hapus"
                          style={{ color: 'var(--red)', padding: 6, borderRadius: 8 }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Grid - Screenshot Style */}
      <div className="section-grid" style={{ marginTop: 24, display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 20 }}>
        {/* Left Card: Penugasan Area Hari Ini */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Penugasan Area Hari Ini</span>
          </div>
          <div className="card-body" style={{ padding: 20, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <img
              src="/src/assets/parking_garage.png"
              alt="Penugasan Area"
              style={{ width: '100%', maxHeight: 220, objectFit: 'cover', borderRadius: 'var(--radius)' }}
            />
          </div>
        </div>

        {/* Right Card: Pemberitahuan Sistem */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="card-header">
            <span className="card-title">Pemberitahuan Sistem</span>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1, padding: 20 }}>
            {/* blue vertical alert bar */}
            <div style={{
              background: 'var(--accent-glow)',
              borderLeft: '4px solid var(--accent)',
              borderRadius: '4px',
              padding: '12px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: 4
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>Pergantian Shift</div>
              <div style={{ fontSize: 11, color: 'var(--text2)' }}>Shift malam dimulai pukul 20:00 WIB.</div>
            </div>

            {/* red vertical alert bar */}
            <div style={{
              background: 'rgba(239, 68, 68, 0.08)',
              borderLeft: '4px solid var(--red)',
              borderRadius: '4px',
              padding: '12px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: 4
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>Area Kosong</div>
              <div style={{ fontSize: 11, color: 'var(--text2)' }}>Gedung B belum memiliki staff aktif.</div>
            </div>

            <button className="btn btn-ghost" style={{ width: '100%', marginTop: 'auto', justifyContent: 'center', fontSize: 12, height: 38 }}>
              Lihat Semua Notifikasi
            </button>
          </div>
        </div>
      </div>

      {showAdd && <StaffFormModal editData={null} onClose={() => setShowAdd(false)} onSave={handleSave} areas={areas} />}
      {editData && <StaffFormModal editData={editData} onClose={() => setEditData(null)} onSave={handleSave} areas={areas} />}
      {deleteTarget && <DeleteModal staff={deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} />}
      {changePasswordTarget && (
        <ChangeStaffPasswordModal staff={changePasswordTarget} onClose={() => setChangePasswordTarget(null)} />
      )}
    </div>
  );
}
