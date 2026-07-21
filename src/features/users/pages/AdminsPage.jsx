import { Pencil, Plus, RefreshCw, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { adminService } from '../services/user.service';
import { parkingService } from '../../parking-area/services/parking.service';
import { useApp } from '../../../core/providers/AppProvider';
import Modal from '../../../shared/components/Modal';
import FormField from '../../../shared/components/FormField';

export default function AdminsPage() {
  const { toast } = useApp();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [areas, setAreas] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', password: '', areaId: '' });
  const [saving, setSaving] = useState(false);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await adminService.getAll();
      const data = res.data || res || [];
      const mappedAdmins = data.map(admin => ({
        ...admin,
        id: admin.userId || admin.id || admin._id,
        areaId: admin.managedAreaId || admin.areaId || admin.parkingId || admin.assignedAreaId || admin.adminAreaId || admin.area?.id || admin.parking?.id || ''
      }));
      setAdmins(mappedAdmins);
    } catch (err) {
      console.error('Gagal fetch admins:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAdmins() }, []);

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const res = await parkingService.getAll();
        const list = res.data || res || [];
        setAreas(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error('Gagal fetch area parkir:', err);
      }
    };
    fetchAreas();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.areaId) {
      toast.warning('Area parkir wajib dipilih.');
      return;
    }
    setSaving(true);
    try {
      await adminService.create(form.name, form.email, form.password, form.areaId);
      setShowAdd(false);
      setForm({ name: '', email: '', password: '', areaId: '' });
      toast.success('Staff parkir berhasil ditambahkan!');
      fetchAdmins();
    } catch (err) { toast.error(err.message || 'Gagal menambahkan staff') }
    finally { setSaving(false) }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = { name: form.name, areaId: form.areaId };
      if (form.password) data.password = form.password;
      await adminService.update(showEdit.id, data);
      setShowEdit(null);
      setForm({ name: '', email: '', password: '', areaId: '' });
      toast.success('Staff parkir berhasil diperbarui!');
      fetchAdmins();
    } catch (err) { toast.error(err.message || 'Gagal memperbarui staff') }
    finally { setSaving(false) }
  };

  const handleDelete = async (adminId) => {
    if (!confirm('Yakin hapus admin ini?')) return;
    try {
      await adminService.delete(adminId);
      toast.success('Staff parkir berhasil dihapus!');
      fetchAdmins();
    } catch (err) { toast.error(err.message || 'Gagal menghapus staff') }
  };

  const getAdminAreaName = (admin) => {
    const directName = admin.areaName || admin.parkingName || admin.assignedAreaName || admin.area?.name || admin.parking?.name;
    if (directName) return directName;

    const adminAreaId = admin.areaId || admin.parkingId || admin.assignedAreaId || admin.adminAreaId || admin.area?.id || admin.parking?.id;
    if (!adminAreaId) return '—';

    const foundArea = areas.find(a => String(a.id) === String(adminAreaId));
    return foundArea ? foundArea.name : '—';
  };

  return (
    <>
      <div className="animate-fade-up">
        <div className="page-header" style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-ghost" onClick={fetchAdmins} style={{ height: 38, padding: '0 16px', borderRadius: 8 }}><RefreshCw size={14} style={{ marginRight: 6 }} /> Refresh</button>
            <button className="btn btn-primary" onClick={() => { setForm({ name: '', email: '', password: '', areaId: '' }); setShowAdd(true) }} style={{ height: 38, padding: '0 16px', borderRadius: 8 }}>
              <Plus size={14} style={{ marginRight: 6 }} /> Tambah Staff
            </button>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">Daftar Staff Parkir</span>
            <span className="badge badge-accent">{admins.length}</span>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            {loading ? (
              <div className="empty-state">
                <div style={{ width: 28, height: 28, border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              </div>
            ) : admins.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">👤</div>
                <p>Belum ada staff parkir</p>
              </div>
            ) : (
              <div className="table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Nama</th>
                      <th>Email</th>
                      <th>Area Parkir</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {admins.map(admin => (
                      <tr key={admin.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div className="avatar" style={{ width: 32, height: 32, fontSize: 13 }}>
                              {(admin.name || 'A').charAt(0).toUpperCase()}
                            </div>
                            <span style={{ fontWeight: 600, color: 'var(--text)' }}>{admin.name}</span>
                          </div>
                        </td>
                        <td>{admin.email}</td>
                        <td style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>
                          {getAdminAreaName(admin)}
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: 4 }}>
                            <button className="btn btn-ghost btn-sm" onClick={() => {
                              const adminAreaId = admin.areaId || admin.parkingId || admin.assignedAreaId || admin.adminAreaId || admin.area?.id || admin.parking?.id || '';
                              setForm({ name: admin.name, email: admin.email, password: '', areaId: adminAreaId });
                              setShowEdit(admin);
                            }}>
                              <Pencil size={12} /> Edit
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(admin.id)}>
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Modal */}
      {showAdd && (
        <Modal title="Tambah Staff Parkir" onClose={() => setShowAdd(false)}>
          <form onSubmit={handleAdd}>
            <FormField label="Nama" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} required />
            <FormField label="Email" value={form.email} onChange={v => setForm(f => ({ ...f, email: v }))} type="email" required />
            <FormField label="Password" value={form.password} onChange={v => setForm(f => ({ ...f, password: v }))} type="password" required />
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 6, fontSize: 12, fontWeight: 600, color: 'var(--text2)' }}>Area Parkir</label>
              <select
                className="input"
                value={form.areaId}
                onChange={e => setForm(f => ({ ...f, areaId: e.target.value }))}
                required
              >
                <option value="">Pilih area parkir</option>
                {areas.map((area) => (
                  <option key={area.id} value={area.id}>{area.name}</option>
                ))}
              </select>
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 20 }}>
              <button type="button" className="btn btn-ghost" onClick={() => setShowAdd(false)}>Batal</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Menyimpan...' : 'Simpan'}</button>
            </div>
          </form>
        </Modal>
      )}

      {/* Edit Modal */}
      {showEdit && (
        <Modal title="Edit Staff Parkir" onClose={() => setShowEdit(null)}>
          <form onSubmit={handleEdit}>
            <FormField label="Nama" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} required />
            <div style={{ marginBottom: 12, padding: '8px 12px', borderRadius: 8, background: 'var(--bg-hover)', fontSize: 12, color: 'var(--text3)' }}>
              Email: {form.email} (tidak bisa diubah)
            </div>
            <FormField label="Password Baru (kosongkan jika tidak diubah)" value={form.password} onChange={v => setForm(f => ({ ...f, password: v }))} type="password" />
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 6, fontSize: 12, fontWeight: 600, color: 'var(--text2)' }}>Area Parkir</label>
              <select
                className="input"
                value={form.areaId}
                onChange={e => setForm(f => ({ ...f, areaId: e.target.value }))}
                required
              >
                <option value="">Pilih area parkir</option>
                {areas.map((area) => (
                  <option key={area.id} value={area.id}>{area.name}</option>
                ))}
              </select>
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 20 }}>
              <button type="button" className="btn btn-ghost" onClick={() => setShowEdit(null)}>Batal</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Menyimpan...' : 'Simpan'}</button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
