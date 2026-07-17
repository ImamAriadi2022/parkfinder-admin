import { useState } from 'react';
import { X, Lock, Eye, EyeOff } from 'lucide-react';
import { staffService } from '../services/monitoring.service';

export default function ChangeStaffPasswordModal({ staff, onClose }) {
  const [newPw, setNewPw] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showCon, setShowCon] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    
    if (newPw.length < 6) {
      setError('Password minimal 6 karakter');
      return;
    }
    if (newPw !== confirm) {
      setError('Konfirmasi password tidak cocok');
      return;
    }
    
    setLoading(true);
    try {
      await staffService.changePassword(staff.id, newPw);
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Gagal mengubah password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1001,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
    }} onClick={onClose}>
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border2)', borderRadius: 'var(--radius-lg)',
        width: '100%', maxWidth: 420, animation: 'fadeUp .3s ease'
      }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{
          padding: '18px 22px', borderBottom: '1px solid var(--border)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 9,
              background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Lock size={15} color="var(--orange)" />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text)' }}>Ubah Password Staff</div>
              <div style={{ fontSize: 11, color: 'var(--text3)' }}>{staff.name} · {staff.email}</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)', display: 'flex' }}>
            <X size={17} />
          </button>
        </div>

        {success ? (
          <div style={{ padding: '40px 22px', textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔐</div>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--text)', marginBottom: 8 }}>Password Berhasil Diubah!</h3>
            <p style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 20 }}>
              Password <strong style={{ color: 'var(--accent)' }}>{staff.name}</strong> telah diperbarui.
            </p>
            <button className="btn btn-primary" onClick={onClose} style={{ width: '100%', justifyContent: 'center' }}>Tutup</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ padding: 22 }}>
            {/* New password */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text2)', marginBottom: 6 }}>Password Baru *</label>
              <div style={{
                display: 'flex', alignItems: 'center', background: 'var(--bg-input)',
                border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden'
              }}>
                <Lock size={13} style={{ marginLeft: 10, color: 'var(--text3)', flexShrink: 0 }} />
                <input type={showNew ? 'text' : 'password'} className="input" placeholder="Min. 6 karakter" value={newPw} onChange={e => {
                  setNewPw(e.target.value);
                  setError('');
                }} style={{ border: 'none', boxShadow: 'none', flex: 1 }} />
                <button type="button" onClick={() => setShowNew(p => !p)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)', display: 'flex', padding: '0 8px' }}>
                  {showNew ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
            {/* Confirm */}
            <div style={{ marginBottom: error ? 12 : 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text2)', marginBottom: 6 }}>Konfirmasi Password *</label>
              <div style={{
                display: 'flex', alignItems: 'center', background: 'var(--bg-input)',
                border: `1px solid ${confirm && confirm !== newPw ? 'var(--red)' : 'var(--border)'}`,
                borderRadius: 'var(--radius)', overflow: 'hidden'
              }}>
                <Lock size={13} style={{ marginLeft: 10, color: 'var(--text3)', flexShrink: 0 }} />
                <input type={showCon ? 'text' : 'password'} className="input" placeholder="Ulangi password" value={confirm} onChange={e => {
                  setConfirm(e.target.value);
                  setError('');
                }} style={{ border: 'none', boxShadow: 'none', flex: 1 }} />
                <button type="button" onClick={() => setShowCon(p => !p)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)', display: 'flex', padding: '0 8px' }}>
                  {showCon ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {confirm && confirm !== newPw && <div style={{ fontSize: 11, color: 'var(--red)', marginTop: 4 }}>⚠ Password tidak cocok</div>}
            </div>
            {error && <div style={{ padding: '9px 12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, fontSize: 12, color: 'var(--red)', marginBottom: 14 }}>⚠ {error}</div>}
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="button" className="btn btn-ghost" onClick={onClose} style={{ flex: 1, justifyContent: 'center' }}>Batal</button>
              <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 2, justifyContent: 'center' }}>
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{
                      width: 14, height: 14, border: '2px solid rgba(0,0,0,0.25)', borderTopColor: '#000',
                      borderRadius: '50%', animation: 'spin .7s linear infinite', display: 'inline-block'
                    }} />Menyimpan...
                  </span>
                ) : <><Lock size={13} /> Simpan Password</>}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
