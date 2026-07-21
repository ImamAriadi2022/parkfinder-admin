import { useState, useRef } from 'react';
import { Camera, Trash2, ShieldCheck, Lock, Eye, EyeOff, Save, Bell, CheckCircle } from 'lucide-react';
import { useApp } from '../../../core/providers/AppProvider';
import Avatar from '../../../shared/components/Avatar';

export default function ProfilePage() {
  const { user, profilePhoto, updateProfilePhoto, removeProfilePhoto, changeAdminPassword, toast } = useApp();
  const fileRef = useRef();

  // Basic Info state
  const [basicInfo, setBasicInfo] = useState({
    name: user?.name || 'Administrator',
    username: user?.username || 'admin.central',
    email: user?.email || 'super@parkfinder.id',
    phone: user?.phone || '+62 812 3456 7890'
  });

  // Password state
  const [pwForm, setPwForm] = useState({ current: '', newPw: '', confirm: '' });
  const [showPw, setShowPw] = useState({ current: false, newPw: false, confirm: false });
  const [pwLoading, setPwLoading] = useState(false);

  // Notification Preferences state
  const [notifs, setNotifs] = useState({
    emailNotifs: true,
    systemAlerts: true,
    shiftReminders: false,
    weeklyReports: true
  });

  const [photoLoading, setPhotoLoading] = useState(false);

  const handlePhotoChange = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.warning('Ukuran file maksimal adalah 2MB');
      return;
    }
    if (!file.type.startsWith('image/')) {
      toast.warning('File harus berupa format gambar');
      return;
    }
    setPhotoLoading(true);
    const reader = new FileReader();
    reader.onload = ev => {
      updateProfilePhoto(ev.target.result);
      setPhotoLoading(false);
      toast.success('Foto profil berhasil diperbarui!');
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    removeProfilePhoto();
    toast.success('Foto profil berhasil dihapus');
  };

  const handleBasicInfoSubmit = e => {
    e.preventDefault();
    toast.success('Informasi profil berhasil disimpan!');
  };

  const handlePasswordSubmit = async e => {
    e.preventDefault();
    if (!pwForm.current) {
      toast.warning('Masukkan password saat ini');
      return;
    }
    if (pwForm.newPw.length < 6) {
      toast.warning('Password baru minimal 6 karakter');
      return;
    }
    if (pwForm.newPw !== pwForm.confirm) {
      toast.warning('Konfirmasi password baru tidak cocok');
      return;
    }
    setPwLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const result = changeAdminPassword(pwForm.current, pwForm.newPw);
    setPwLoading(false);
    if (!result.ok) {
      toast.error(result.msg || 'Gagal memperbarui password');
      return;
    }
    toast.success('Password berhasil diperbarui!');
    setPwForm({ current: '', newPw: '', confirm: '' });
  };

  const toggleNotif = key => {
    setNotifs(prev => ({ ...prev, [key]: !prev[key] }));
    toast.success('Preferensi notifikasi diperbarui');
  };

  const ToggleEye = ({ field }) => (
    <button type="button" onClick={() => setShowPw(p => ({ ...p, [field]: !p[field] }))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)', display: 'flex', padding: '0 8px' }}>
      {showPw[field] ? <EyeOff size={15} /> : <Eye size={15} />}
    </button>
  );

  // Calculate password strength rating (0-5)
  const getPasswordStrength = () => {
    const pw = pwForm.newPw;
    if (!pw) return 0;
    let strength = 0;
    if (pw.length >= 6) strength += 1;
    if (pw.length >= 8) strength += 1;
    if (/[A-Z]/.test(pw)) strength += 1;
    if (/[0-9]/.test(pw)) strength += 1;
    if (/[^A-Za-z0-9]/.test(pw)) strength += 1;
    return strength;
  };

  const pwStrength = getPasswordStrength();
  const strengthLabels = ['Sangat Lemah', 'Lemah', 'Sedang', 'Kuat', 'Sangat Kuat'];
  const strengthColors = ['var(--red)', 'var(--red)', 'var(--orange)', 'var(--green)', 'var(--green)'];

  return (
    <div className="animate-fade-up">
      {/* Page Title */}
      <div className="page-header" style={{ marginBottom: 24 }}>
        <div>
          <h1 className="page-title">Edit Profile & Settings</h1>
          <p className="page-sub">Sunting profil admin, kelola keamanan akun, dan atur preferensi sistem.</p>
        </div>
      </div>

      {/* Grid Layout (Screenshot 5 Style) */}
      <div className="section-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 20, alignItems: 'flex-start' }}>
        {/* Left Column (Photos & Status) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Profile Photo Card */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Foto Profil</span>
            </div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: 24 }}>
              <div style={{ position: 'relative', marginBottom: 20 }}>
                <Avatar size={110} fontSize={36} />
                {photoLoading && (
                  <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', fontSize: 12 }}>
                    Uploader...
                  </div>
                )}
              </div>

              {/* Dotted Upload Box */}
              <div
                onClick={() => fileRef.current?.click()}
                style={{
                  border: '2px dashed var(--border)',
                  borderRadius: 10,
                  width: '100%',
                  padding: '16px 8px',
                  cursor: 'pointer',
                  background: 'var(--bg-hover)',
                  transition: 'border-color 0.2s',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 6
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                <Camera size={18} style={{ color: 'var(--text2)' }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>
                  {photoLoading ? 'Mengunggah...' : 'Upload Foto Baru'}
                </span>
                <span style={{ fontSize: 10, color: 'var(--text3)' }}>Maksimal 2MB (JPG/PNG)</span>
              </div>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoChange} />

              {profilePhoto && (
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={handleRemovePhoto}
                  style={{ color: 'var(--red)', borderColor: 'rgba(239,68,68,0.2)', width: '100%', marginTop: 12, justifyContent: 'center' }}
                >
                  <Trash2 size={13} /> Hapus Foto Profil
                </button>
              )}
            </div>
          </div>

          {/* Account Status Card */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Status Akun</span>
            </div>
            <div className="card-body" style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: 'var(--text2)' }}>Status</span>
                <span className="badge badge-green" style={{ borderRadius: 6, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <CheckCircle size={10} /> Active
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: 'var(--text2)' }}>Admin ID</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>PF-ADM-001</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: 'var(--text2)' }}>Dibuat</span>
                <span style={{ fontSize: 12, color: 'var(--text2)' }}>10 Jan 2026</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: 'var(--text2)' }}>Login Terakhir</span>
                <span style={{ fontSize: 11, color: 'var(--text3)' }}>21 Jul 2026 09:30</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Basic Info, Change Password, Notification Config) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Basic Information Card */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Informasi Dasar</span>
            </div>
            <div className="card-body" style={{ padding: 24 }}>
              <form onSubmit={handleBasicInfoSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text2)', marginBottom: 6 }}>NAMA LENGKAP</label>
                    <input
                      type="text"
                      className="input"
                      value={basicInfo.name}
                      onChange={e => setBasicInfo(p => ({ ...p, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text2)', marginBottom: 6 }}>USERNAME</label>
                    <input
                      type="text"
                      className="input"
                      value={basicInfo.username}
                      onChange={e => setBasicInfo(p => ({ ...p, username: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text2)', marginBottom: 6 }}>EMAIL ADDRESS</label>
                    <input
                      type="email"
                      className="input"
                      value={basicInfo.email}
                      onChange={e => setBasicInfo(p => ({ ...p, email: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text2)', marginBottom: 6 }}>NOMOR TELEPON</label>
                    <input
                      type="text"
                      className="input"
                      value={basicInfo.phone}
                      onChange={e => setBasicInfo(p => ({ ...p, phone: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-end', minWidth: 150, justifyContent: 'center' }}>
                  <Save size={14} /> Simpan Perubahan
                </button>
              </form>
            </div>
          </div>

          {/* Change Password Card */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">🔐 Ubah Password</span>
            </div>
            <div className="card-body" style={{ padding: 24 }}>
              <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text2)', marginBottom: 6 }}>PASSWORD SAAT INI</label>
                  <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-base)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
                    <Lock size={14} style={{ marginLeft: 12, color: 'var(--text3)', flexShrink: 0 }} />
                    <input
                      type={showPw.current ? 'text' : 'password'}
                      className="input"
                      placeholder="Masukkan password saat ini"
                      value={pwForm.current}
                      onChange={e => setPwForm(p => ({ ...p, current: e.target.value }))}
                      style={{ border: 'none', boxShadow: 'none', flex: 1 }}
                      required
                    />
                    <ToggleEye field="current" />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text2)', marginBottom: 6 }}>PASSWORD BARU</label>
                  <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-base)', border: `1px solid ${pwForm.newPw && pwForm.newPw.length < 6 ? 'var(--red)' : 'var(--border)'}`, borderRadius: 'var(--radius)', overflow: 'hidden' }}>
                    <Lock size={14} style={{ marginLeft: 12, color: 'var(--text3)', flexShrink: 0 }} />
                    <input
                      type={showPw.newPw ? 'text' : 'password'}
                      className="input"
                      placeholder="Password baru (min. 6 karakter)"
                      value={pwForm.newPw}
                      onChange={e => setPwForm(p => ({ ...p, newPw: e.target.value }))}
                      style={{ border: 'none', boxShadow: 'none', flex: 1 }}
                      required
                    />
                    <ToggleEye field="newPw" />
                  </div>

                  {/* Password Strength Meter - 5 Bars */}
                  {pwForm.newPw && (
                    <div style={{ marginTop: 10 }}>
                      <div style={{ display: 'flex', gap: 4, height: 4, width: '100%', marginBottom: 6 }}>
                        {[1, 2, 3, 4, 5].map(index => (
                          <div
                            key={index}
                            style={{
                              flex: 1,
                              height: '100%',
                              borderRadius: 2,
                              background: index <= pwStrength ? strengthColors[pwStrength - 1] : 'var(--border)'
                            }}
                          />
                        ))}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text3)' }}>
                        Kekuatan Sandi: <strong style={{ color: strengthColors[pwStrength - 1] }}>{strengthLabels[pwStrength - 1] || 'Sangat Lemah'}</strong>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text2)', marginBottom: 6 }}>KONFIRMASI PASSWORD BARU</label>
                  <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-base)', border: `1px solid ${pwForm.confirm && pwForm.confirm !== pwForm.newPw ? 'var(--red)' : 'var(--border)'}`, borderRadius: 'var(--radius)', overflow: 'hidden' }}>
                    <Lock size={14} style={{ marginLeft: 12, color: 'var(--text3)', flexShrink: 0 }} />
                    <input
                      type={showPw.confirm ? 'text' : 'password'}
                      className="input"
                      placeholder="Ulangi password baru"
                      value={pwForm.confirm}
                      onChange={e => setPwForm(p => ({ ...p, confirm: e.target.value }))}
                      style={{ border: 'none', boxShadow: 'none', flex: 1 }}
                      required
                    />
                    <ToggleEye field="confirm" />
                  </div>
                  {pwForm.confirm && pwForm.confirm !== pwForm.newPw && (
                    <div style={{ fontSize: 11, color: 'var(--red)', marginTop: 4 }}>⚠ Password tidak cocok</div>
                  )}
                </div>

                <button type="submit" className="btn btn-primary" disabled={pwLoading} style={{ alignSelf: 'flex-end', minWidth: 150, justifyContent: 'center' }}>
                  {pwLoading ? 'Menyimpan...' : 'Ganti Password'}
                </button>
              </form>
            </div>
          </div>

          {/* Notification Preferences Card */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">🔔 Preferensi Notifikasi</span>
            </div>
            <div className="card-body" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { key: 'emailNotifs', label: 'Email Notifications', desc: 'Dapatkan rekap berkala ke email terdaftar Anda.' },
                { key: 'systemAlerts', label: 'System Alerts', desc: 'Dapatkan pemberitahuan kegagalan scan tiketing atau penuhnya kapasitas.' },
                { key: 'shiftReminders', label: 'Shift Reminders', desc: 'Ingatkan jadwal pergantian shift sebelum waktu mulai bertugas.' },
                { key: 'weeklyReports', label: 'Weekly Reports', desc: 'Kirimkan laporan statistik okupansi setiap akhir pekan.' }
              ].map(item => (
                <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginRight: 16 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{item.label}</span>
                    <span style={{ fontSize: 11, color: 'var(--text3)' }}>{item.desc}</span>
                  </div>
                  {/* Custom Toggle Switch */}
                  <div
                    onClick={() => toggleNotif(item.key)}
                    style={{
                      width: 44,
                      height: 22,
                      borderRadius: 12,
                      background: notifs[item.key] ? 'var(--accent)' : 'var(--border)',
                      position: 'relative',
                      cursor: 'pointer',
                      transition: 'background 0.2s'
                    }}
                  >
                    <div style={{
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      background: '#FFF',
                      position: 'absolute',
                      top: 3,
                      left: notifs[item.key] ? 25 : 3,
                      transition: 'left 0.2s'
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
