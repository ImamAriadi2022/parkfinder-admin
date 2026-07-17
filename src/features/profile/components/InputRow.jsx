export default function InputRow({ label, placeholder, defaultValue, type = 'text' }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text2)', display: 'block', marginBottom: 6 }}>
        {label}
      </label>
      <input className="input" type={type} defaultValue={defaultValue} placeholder={placeholder} />
    </div>
  );
}
