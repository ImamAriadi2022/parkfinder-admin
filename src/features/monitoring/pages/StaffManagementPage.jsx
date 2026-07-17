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

export default function StaffManagementPage() {
  const [staffList, setStaffList] = useState([]);
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
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
      <div className="page-header">
        <div>
          <h1 className="page-title">Manajemen Staff</h1>
          <p className="page-sub">Khusus Super Admin: kelola petugas parkir</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
          <Plus size={15} /> Tambah Staff
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(155px,1fr))', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Total Staff', value: staffList.length, color: 'var(--text)' },
          { label: 'Aktif', value: staffList.filter((s) => s.status === 'active').length, color: 'var(--green)' },
          { label: 'Non-Aktif', value: staffList.filter((s) => s.status !== 'active').length, color: 'var(--text3)' },
          { label: 'Gedung', value: areas.length, color: 'var(--accent)' },
        ].map((item, i) => (
          <div key={i} className="card" style={{ padding: '14px 18px', textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: item.color }}>{item.value}</div>
            <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 3 }}>{item.label}</div>
          </div>
        ))}
      </div>

      <div className="filter-bar">
        <div className="input-icon-wrap" style={{ flex: 1, minWidth: 200 }}>
          <Search size={14} className="input-icon" />
          <input
            className="input"
            placeholder="Cari nama, email, gedung..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
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

      <div className="card">
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Staff</th>
                <th>Email</th>
                <th>Telepon</th>
                <th>Gedung</th>
                <th>Shift</th>
                <th>Bergabung</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8}>
                    <div className="empty-state">Memuat data staff...</div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <div className="empty-state">Tidak ada staff ditemukan</div>
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className="avatar">{(s.name || 'S').charAt(0).toUpperCase()}</div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{s.name || '—'}</div>
                          <div style={{ fontSize: 11, color: 'var(--text3)' }}>{s.id || '-'}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize: 13 }}>{s.email || '—'}</td>
                    <td style={{ fontSize: 13 }}>{s.phone || '—'}</td>
                    <td style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{s.parkingName || '—'}</td>
                    <td style={{ fontSize: 12 }}>{s.shifts || '—'}</td>
                    <td style={{ fontSize: 12 }}>{fmtDate(s.joinDate)}</td>
                    <td>
                      <span className={`badge ${s.status === 'active' ? 'badge-green' : 'badge-gray'}`}>
                        {s.status === 'active' ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => setEditData(s)} title="Edit">
                          <Edit2 size={13} />
                        </button>
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => setChangePasswordTarget(s)}
                          title="Ubah Password"
                          style={{ color: 'var(--orange)' }}
                        >
                          <Lock size={13} />
                        </button>
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => toggleStatus(s.id)}
                          title={s.status === 'active' ? 'Nonaktifkan' : 'Aktifkan'}
                        >
                          {s.status === 'active' ? '⏸' : '▶'}
                        </button>
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => setDeleteTarget(s)}
                          title="Hapus"
                          style={{ color: 'var(--red)' }}
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

      {showAdd && <StaffFormModal editData={null} onClose={() => setShowAdd(false)} onSave={handleSave} areas={areas} />}
      {editData && <StaffFormModal editData={editData} onClose={() => setEditData(null)} onSave={handleSave} areas={areas} />}
      {deleteTarget && <DeleteModal staff={deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} />}
      {changePasswordTarget && (
        <ChangeStaffPasswordModal staff={changePasswordTarget} onClose={() => setChangePasswordTarget(null)} />
      )}
    </div>
  );
}
