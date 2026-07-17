import { Edit2, Plus, UserPlus, X } from 'lucide-react';
import { useState } from 'react';

const SHIFT_OPTIONS = ['Pagi (06:00–14:00)', 'Siang (14:00–22:00)', 'Malam (22:00–06:00)'];

const Field = ({ label, id, error, children }) => (
  <div style={{ marginBottom: 14 }}>
    <label htmlFor={id} style={{
      display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text2)', marginBottom: 6
    }}>{label}</label>
    {children}
    {error && <div style={{ fontSize: 12, color: 'var(--red)', marginTop: 4 }}>⚠ {error}</div>}
  </div>
);

export default function StaffFormModal({ editData, onClose, onSave, areas = [] }) {
  const isEdit = !!editData;
  const [form, setForm] = useState({
    name: editData?.name || '',
    email: editData?.email || '',
    phone: editData?.phone || '',
    parkingId: editData?.parkingId || '',
    shifts: editData?.shifts || SHIFT_OPTIONS[0],
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: null }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Nama wajib diisi';
    if (!form.email.trim()) e.email = 'Email wajib diisi';
    if (!form.phone.trim()) e.phone = 'No. telepon wajib diisi';
    if (!form.parkingId) e.parkingId = 'Pilih gedung parkir';
    if (!isEdit && !form.password) e.password = 'Password wajib diisi untuk staff baru';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async e => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    const pkg = areas.find(p => p.id === Number(form.parkingId));
    onSave({
      id: editData?.id || 'staff-' + Date.now(),
      password: form.password || undefined,
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      parkingId: Number(form.parkingId),
      parkingName: pkg?.name || '—',
      shifts: form.shifts,
      joinDate: editData?.joinDate || new Date().toISOString().slice(0, 10),
      status: editData?.status || 'active'
    });
    setLoading(false);
    setSuccess(true);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
    }} onClick={onClose}>
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border2)', borderRadius: 'var(--radius-lg)',
        width: '100%', maxWidth: 500, maxHeight: '92vh', overflow: 'auto',
        animation: 'fadeUp .35s ease both'
      }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{
          padding: '20px 24px', borderBottom: '1px solid var(--border)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'var(--accent-glow)', border: '1px solid var(--border2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <UserPlus size={18} color="var(--accent)" />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text)' }}>
                {isEdit ? 'Edit Data Staff' : 'Tambah Staff Baru'}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text3)' }}>
                {isEdit ? `Mengubah data ${editData.name}` : 'Isi data petugas gedung parkir'}
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)', display: 'flex' }}>
            <X size={18} />
          </button>
        </div>

        {success ? (
          <div style={{ padding: '48px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: 52, marginBottom: 14 }}>✅</div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)', marginBottom: 8 }}>
              {isEdit ? 'Data Berhasil Diperbarui!' : 'Staff Berhasil Ditambahkan!'}
            </h3>
            <p style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 24 }}>
              <strong style={{ color: 'var(--accent)' }}>{form.name}</strong> telah berhasil {isEdit ? 'diperbarui' : 'ditambahkan ke sistem'}.
            </p>
            <button className="btn btn-primary" onClick={onClose} style={{ width: '100%', justifyContent: 'center', padding: 11 }}>Tutup</button>
          </div>
        ) : (
          <form onSubmit={handleSave} style={{ padding: 24 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <Field label="Nama Lengkap *" id="name" error={errors.name}>
                <input id="name" className="input" placeholder="Nama petugas" value={form.name} onChange={e => set('name', e.target.value)} style={{ borderColor: errors.name ? 'var(--red)' : undefined }} />
              </Field>
              <Field label="No. Telepon *" id="phone" error={errors.phone}>
                <input id="phone" className="input" placeholder="0812-xxxx-xxxx" value={form.phone} onChange={e => set('phone', e.target.value)} style={{ borderColor: errors.phone ? 'var(--red)' : undefined }} />
              </Field>
            </div>

            <Field label="Email Login *" id="email" error={errors.email}>
              <input id="email" className="input" type="email" placeholder="staff.nama@parkfinder.id" value={form.email} onChange={e => set('email', e.target.value)} style={{ borderColor: errors.email ? 'var(--red)' : undefined }} />
            </Field>

            {!isEdit && (
              <Field label="Password *" id="password" error={errors.password}>
                <input id="password" className="input" type="password" placeholder="Min. 6 karakter" value={form.password} onChange={e => set('password', e.target.value)} style={{ borderColor: errors.password ? 'var(--red)' : undefined }} />
              </Field>
            )}

            <Field label="Gedung Parkir Ditugaskan *" id="parkingId" error={errors.parkingId}>
              <select id="parkingId" className="input" value={form.parkingId} onChange={e => set('parkingId', e.target.value)} style={{ cursor: 'pointer', borderColor: errors.parkingId ? 'var(--red)' : undefined }}>
                <option value="">-- Pilih gedung --</option>
                {areas.map(p => <option key={p.id} value={p.id}>🏢 {p.name}</option>)}
              </select>
            </Field>

            <Field label="Shift Kerja" id="shifts" error={null}>
              <select id="shifts" className="input" value={form.shifts} onChange={e => set('shifts', e.target.value)} style={{ cursor: 'pointer' }}>
                {SHIFT_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>

            {/* Preview */}
            {(form.name || form.parkingId) && (
              <div style={{ background: 'var(--accent-glow)', border: '1px solid var(--border2)', borderRadius: 10, padding: '12px 14px', marginBottom: 20 }}>
                <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 6, fontWeight: 600 }}>Preview Data</div>
                {form.name && <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>👤 {form.name}</div>}
                {form.parkingId && <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>🏢 {areas.find(p => p.id === Number(form.parkingId))?.name}</div>}
                {form.shifts && <div style={{ fontSize: 12, color: 'var(--accent)', marginTop: 2 }}>🕐 {form.shifts}</div>}
              </div>
            )}

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16, display: 'flex', gap: 10 }}>
              <button type="button" className="btn btn-ghost" onClick={onClose} style={{ flex: 1, justifyContent: 'center' }}>Batal</button>
              <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 2, justifyContent: 'center', padding: 11 }}>
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{
                      width: 15, height: 15, border: '2px solid rgba(0,0,0,0.25)', borderTopColor: '#000',
                      borderRadius: '50%', animation: 'spin .7s linear infinite', display: 'inline-block'
                    }} />Menyimpan...
                  </span>
                ) : isEdit ? <><Edit2 size={14} /> Simpan Perubahan</> : <><Plus size={14} /> Tambah Staff</>}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
