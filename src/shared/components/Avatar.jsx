import { useApp } from '../../core/providers/AppProvider';

export default function Avatar({ size = 34, fontSize = 14, style = {} }) {
  const { user, profilePhoto } = useApp();
  const initial = user?.name?.[0]?.toUpperCase() || 'A';

  if (profilePhoto) {
    return (
      <img
        src={profilePhoto}
        alt="Profil"
        style={{
          width: size, height: size, borderRadius: '50%',
          objectFit: 'cover', border: '2px solid var(--border2)',
          flexShrink: 0, ...style,
        }}
      />
    );
  }

  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: 'linear-gradient(135deg, var(--accent), #7B61FF)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize, fontWeight: 800, color: '#000', flexShrink: 0,
      border: '2px solid var(--border2)', userSelect: 'none', ...style,
    }}>
      {initial}
    </div>
  );
}
