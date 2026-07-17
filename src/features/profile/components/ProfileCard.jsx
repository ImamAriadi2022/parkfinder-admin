import { Camera, Trash2, ShieldCheck } from 'lucide-react';
import Avatar from '../../../shared/components/Avatar';

export default function ProfileCard({ user, profilePhoto, photoLoading, photoMsg, fileRef, handlePhotoChange, handleRemovePhoto }) {
  return (
    <div className="card" style={{ marginBottom: 20 }}>
      <div className="card-header"><span className="card-title">🖼️ Foto Profil</span></div>
      <div className="card-body">
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            <Avatar size={96} fontSize={32} />
            <button onClick={() => fileRef.current?.click()} style={{ position: 'absolute', bottom: 0, right: 0, width: 30, height: 30, borderRadius: '50%', background: 'var(--accent)', border: '2px solid var(--bg-card)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000' }}>
              <Camera size={14} />
            </button>
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)', marginBottom: 4 }}>{user?.name || 'Admin'}</div>
            <div style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 12 }}>{user?.email}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <ShieldCheck size={14} color="var(--accent)" />
              <span style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 600 }}>Super Admin</span>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button className="btn btn-primary btn-sm" onClick={() => fileRef.current?.click()} disabled={photoLoading}>
                <Camera size={13} /> {photoLoading ? 'Mengupload...' : 'Upload Foto'}
              </button>
              {profilePhoto && (
                <button className="btn btn-ghost btn-sm" onClick={handleRemovePhoto} style={{ color: 'var(--red)', borderColor: 'rgba(239,68,68,0.2)' }}>
                  <Trash2 size={13} /> Hapus Foto
                </button>
              )}
            </div>
            {photoMsg && <div style={{ marginTop: 10, fontSize: 12, color: photoMsg.startsWith('✅') ? 'var(--green)' : 'var(--orange)' }}>{photoMsg}</div>}
          </div>
        </div>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoChange} />
        <div style={{ marginTop: 16, padding: '10px 14px', background: 'var(--bg-hover)', borderRadius: 10, fontSize: 12, color: 'var(--text3)' }}>
          💡 Format yang didukung: JPG, PNG, WebP · Ukuran maksimal: <strong>2MB</strong> · Rasio ideal: <strong>1:1 (persegi)</strong>
        </div>
      </div>
    </div>
  );
}
