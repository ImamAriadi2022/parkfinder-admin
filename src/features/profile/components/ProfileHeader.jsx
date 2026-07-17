import { LogOut } from 'lucide-react';

export default function ProfileHeader({ logout, navigate }) {
  return (
    <div className="page-header" style={{ marginBottom: 24 }}>
      <div>
        <h1 className="page-title">👤 Profil & Keamanan</h1>
        <p className="page-sub">Kelola foto profil dan keamanan akun admin</p>
      </div>
      <button className="btn btn-ghost" onClick={() => { logout(); navigate('/login'); }}>
        <LogOut size={14} /> Logout
      </button>
    </div>
  );
}
