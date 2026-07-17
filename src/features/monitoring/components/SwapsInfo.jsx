export default function SwapsInfo() {
  return (
    <div className="card" style={{ marginTop: 20 }}>
      <div className="card-header"><span className="card-title">ℹ️ Cara Kerja Tukar Slot</span></div>
      <div className="card-body">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
          {[
            { step: '01', title: 'Pengguna Memilih Slot Baru', desc: 'Dari halaman booking aktif, pengguna memilih slot tujuan baru di gedung yang sama.' },
            { step: '02', title: 'Konfirmasi Tukar', desc: 'Pengguna mengkonfirmasi perubahan slot. Sistem memvalidasi ketersediaan slot tujuan.' },
            { step: '03', title: 'Tiket Baru Diterbitkan', desc: 'Slot lama dilepas, tiket baru dengan kode PKF-SW-* otomatis diterbitkan.' },
            { step: '04', title: 'Masuk ke Slot Baru', desc: 'Pengguna scan tiket baru di gerbang parkir untuk aktivasi sesi.' }
          ].map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--accent-glow)', border: '1px solid var(--border2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: 'var(--accent)', flexShrink: 0 }}>{s.step}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>{s.title}</div>
                <div style={{ fontSize: 12, color: 'var(--text3)', lineHeight: 1.5 }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
