import { useState, useRef } from 'react';
import { Camera, Trash2, Save, CheckCircle } from 'lucide-react';
import { useApp } from '../../../core/providers/AppProvider';
import Avatar from '../../../shared/components/Avatar';

export default function ProfilePage() {
  const { user, profilePhoto, updateProfilePhoto, removeProfilePhoto, updateAdminProfile, toast } = useApp();
  const fileRef = useRef();

  // Basic Info state
  const [basicInfo, setBasicInfo] = useState({
    name: user?.name || 'Administrator',
    email: user?.email || 'super@parkfinder.id'
  });

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
    updateAdminProfile(basicInfo.name, basicInfo.email);
    toast.success('Informasi profil berhasil disimpan!');
  };

  const toggleNotif = key => {
    setNotifs(prev => ({ ...prev, [key]: !prev[key] }));
    toast.success('Preferensi notifikasi diperbarui');
  };

  return (
    <div className="animate-fade-up">


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
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text2)', marginBottom: 6 }}>EMAIL</label>
                    <input
                      type="email"
                      className="input"
                      value={basicInfo.email}
                      onChange={e => setBasicInfo(p => ({ ...p, email: e.target.value }))}
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
