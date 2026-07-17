import { Lock, Eye, EyeOff, Save } from 'lucide-react';

export default function PasswordCard({ pwForm, setPwForm, showPw, setShowPw, pwError, setPwError, pwSuccess, pwLoading, handlePasswordSubmit }) {
  const ToggleEye = ({ field }) => (
    <button type="button" onClick={() => setShowPw(p => ({ ...p, [field]: !p[field] }))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)', display: 'flex', padding: '0 6px' }}>
      {showPw[field] ? <EyeOff size={15} /> : <Eye size={15} />}
    </button>
  );

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">🔐 Ubah Password Admin</span>
        <span className="badge badge-orange">Keamanan</span>
      </div>
      <div className="card-body">
        {pwSuccess && <div style={{ padding: '12px 16px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 10, marginBottom: 20, fontSize: 13, color: 'var(--green)', display: 'flex', alignItems: 'center', gap: 8 }}>✅ Password berhasil diubah! Gunakan password baru untuk login berikutnya.</div>}
        <form onSubmit={handlePasswordSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text2)', marginBottom: 6 }}>Password Saat Ini *</label>
            <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
              <Lock size={14} style={{ marginLeft: 12, color: 'var(--text3)', flexShrink: 0 }} />
              <input type={showPw.current ? 'text' : 'password'} className="input" placeholder="Masukkan password saat ini" value={pwForm.current} onChange={e => { setPwForm(p => ({ ...p, current: e.target.value })); setPwError(''); }} style={{ border: 'none', boxShadow: 'none', flex: 1 }} />
              <ToggleEye field="current" />
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text2)', marginBottom: 6 }}>Password Baru * <span style={{ fontWeight: 400, color: 'var(--text3)' }}>(min. 6 karakter)</span></label>
            <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-input)', border: `1px solid ${pwForm.newPw && pwForm.newPw.length < 6 ? 'var(--red)' : 'var(--border)'}`, borderRadius: 'var(--radius)', overflow: 'hidden' }}>
              <Lock size={14} style={{ marginLeft: 12, color: 'var(--text3)', flexShrink: 0 }} />
              <input type={showPw.newPw ? 'text' : 'password'} className="input" placeholder="Password baru" value={pwForm.newPw} onChange={e => { setPwForm(p => ({ ...p, newPw: e.target.value })); setPwError(''); }} style={{ border: 'none', boxShadow: 'none', flex: 1 }} />
              <ToggleEye field="newPw" />
            </div>
            {pwForm.newPw && <div style={{ marginTop: 6 }}><div style={{ height: 4, background: 'var(--bg-hover)', borderRadius: 99, overflow: 'hidden' }}><div style={{ height: '100%', borderRadius: 99, transition: 'width .3s', width: pwForm.newPw.length >= 12 ? '100%' : pwForm.newPw.length >= 8 ? '66%' : pwForm.newPw.length >= 6 ? '33%' : '10%', background: pwForm.newPw.length >= 12 ? 'var(--green)' : pwForm.newPw.length >= 8 ? 'var(--orange)' : 'var(--red)' }} /></div><div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 3 }}>Kekuatan: {pwForm.newPw.length >= 12 ? '💪 Kuat' : pwForm.newPw.length >= 8 ? '👍 Sedang' : '⚠️ Lemah'}</div></div>}
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text2)', marginBottom: 6 }}>Konfirmasi Password Baru *</label>
            <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-input)', border: `1px solid ${pwForm.confirm && pwForm.confirm !== pwForm.newPw ? 'var(--red)' : 'var(--border)'}`, borderRadius: 'var(--radius)', overflow: 'hidden' }}>
              <Lock size={14} style={{ marginLeft: 12, color: 'var(--text3)', flexShrink: 0 }} />
              <input type={showPw.confirm ? 'text' : 'password'} className="input" placeholder="Ulangi password baru" value={pwForm.confirm} onChange={e => { setPwForm(p => ({ ...p, confirm: e.target.value })); setPwError(''); }} style={{ border: 'none', boxShadow: 'none', flex: 1 }} />
              <ToggleEye field="confirm" />
            </div>
            {pwForm.confirm && pwForm.confirm !== pwForm.newPw && <div style={{ fontSize: 11, color: 'var(--red)', marginTop: 4 }}>⚠ Password tidak cocok</div>}
          </div>
          {pwError && <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, marginBottom: 16, fontSize: 13, color: 'var(--red)' }}>⚠ {pwError}</div>}
          <button type="submit" className="btn btn-primary" disabled={pwLoading} style={{ width: '100%', justifyContent: 'center', padding: 12 }}>
            {pwLoading ? <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 15, height: 15, border: '2px solid rgba(0,0,0,0.25)', borderTopColor: '#000', borderRadius: '50%', animation: 'spin .7s linear infinite', display: 'inline-block' }} />Menyimpan...</span> : <><Save size={15} /> Simpan Password Baru</>}
          </button>
        </form>
      </div>
    </div>
  );
}
