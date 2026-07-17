import { Edit2, LayoutGrid } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useApp } from '../../../core/providers/AppProvider';
import { getParkings } from '../../parking-area/services/parking.service';
import { getBookings, getScans, getSwaps, getScanStats } from '../../monitoring/services/monitoring.service';

export default function StaffDashboard() {
  const { user } = useApp();
  const [tab, setTab] = useState('scan');
  const [search, setSearch] = useState('');
  const [showEdit, setShowEdit] = useState(false);
  const [showSlots, setShowSlots] = useState(false);
  const [parkings, setParkings] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [scans, setScans] = useState([]);
  const [swaps, setSwaps] = useState([]);
  const [scanHourlyData, setScanHourlyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    const loadStaffData = async () => {
      setLoading(true);
      setApiError(null);
      try {
        const [
          parkingsData,
          bookingsData,
          scansData,
          swapsData,
          hourlyData
        ] = await Promise.all([
          getParkings(),
          getBookings(),
          getScans(),
          getSwaps(),
          getScanStats()
        ]);

        setParkings(parkingsData || []);
        setBookings(bookingsData || []);
        setScans(scansData || []);
        setSwaps(swapsData || []);
        setScanHourlyData(hourlyData || []);
      } catch (error) {
        console.warn('API fetch failed, falling back to mock data:', error);
        setApiError(error.message || String(error));
        try {
          const [
            parkingsData,
            bookingsData,
            scansData,
            swapsData,
            hourlyData
          ] = await Promise.all([
            getParkings(),
            getBookings(),
            getScans(),
            getSwaps(),
            getScanStats()
          ]);

          setParkings(parkingsData || []);
          setBookings(bookingsData || []);
          setScans(scansData || []);
          setSwaps(swapsData || []);
          setScanHourlyData(hourlyData || []);
        } catch (fallbackErr) {
          console.error('Fallback data load failed:', fallbackErr);
        }
      } finally {
        setLoading(false);
      }
    };

    loadStaffData();
  }, []);

  // Data gedung – bisa diupdate via edit modal
  const baseParkings = parkings;
  const [localParking, setLocalParking] = useState(() => baseParkings.find(p => p.id === user?.parkingId) || baseParkings[0] || {});
  const parking = localParking || (baseParkings[0] || { name: '—', occupancy: 0, totalSlots: 0, usedSlots: 0, floors: [] });

  useEffect(() => {
    if (baseParkings.length > 0 && !parking.id) {
      setLocalParking(baseParkings.find(p => p.id === user?.parkingId) || baseParkings[0]);
    }
  }, [baseParkings, user?.parkingId]);

  const filteredBookings = bookings.filter(b => b.parkingName === parking.name);
  const filteredScans = scans.filter(s => s.parking === parking.name);
  const filteredSwaps = swaps.filter(s => s.fromParking === parking.name || s.toParking === parking.name);

  // Stats - use filtered data
  const available = (parking.totalSlots || 0) - (parking.usedSlots || 0);
  const successScans = filteredScans.filter(s => s.status === 'success').length;
  const failedScans = filteredScans.filter(s => s.status === 'failed').length;
  const activeBook = filteredBookings.filter(b => b.status === 'active').length;

  // Stats cards configuration
  const stats = [
    { label: 'Kapasitas Total', value: parking.totalSlots, color: 'var(--text)', suffix: ' slot', icon: '🅿️' },
    { label: 'Slot Terisi', value: parking.usedSlots, color: 'var(--red)', suffix: ' slot', icon: '🔴' },
    { label: 'Slot Tersedia', value: available, color: 'var(--green)', suffix: ' slot', icon: '🟢' },
    { label: 'Booking Aktif', value: activeBook, color: 'var(--accent)', suffix: '', icon: '📋' },
    { label: 'Scan Berhasil', value: successScans, color: 'var(--green)', suffix: '', icon: '✅' },
    { label: 'Scan Gagal', value: failedScans, color: failedScans > 0 ? 'var(--red)' : 'var(--text3)', suffix: '', icon: '❌' }
  ];

  return (
    <div>
      {/* Header */}
      <div style={{
        marginBottom: 24,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: 12
      }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)', marginBottom: 4 }}>
            👋 Halo, <span style={{ color: 'var(--accent)' }}>{user?.name}</span>
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text2)' }}>
            Monitoring gedung <strong style={{ color: 'var(--text)' }}>{parking.name}</strong> · Real-time
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className="status-dot status-dot-green" />
            <span style={{ fontSize: 13, color: 'var(--green)', fontWeight: 600 }}>Sistem Online</span>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => setShowSlots(true)} style={{
            color: 'var(--accent)',
            borderColor: 'rgba(0,210,255,0.2)',
            background: 'rgba(0,210,255,0.06)'
          }}>
            <LayoutGrid size={13} /> Kelola Slot
          </button>
          <button className="btn btn-ghost btn-sm" onClick={() => setShowEdit(true)} style={{
            color: 'var(--orange)',
            borderColor: 'rgba(245,158,11,0.25)',
            background: 'rgba(245,158,11,0.06)'
          }}>
            <Edit2 size={13} /> Edit Gedung
          </button>
        </div>
      </div>

      {apiError && <div style={{ marginBottom: 12 }}><div className="alert alert-warning">Terjadi masalah koneksi API: {apiError}</div></div>}

      {/* KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px,1fr))',
        gap: 16,
        marginBottom: 24
      }}>
        {stats.map((k, i) => (
          <div key={i} className="stat-card" style={{ padding: '18px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <span style={{ fontSize: 20 }}>{k.icon}</span>
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: k.color, lineHeight: 1 }}>
              {k.value}<span style={{ fontSize: 14 }}>{k.suffix}</span>
            </div>
            <div style={{ fontSize: 13, color: 'var(--text2)', marginTop: 6 }}>{k.label}</div>
          </div>
        ))}
      </div>
      
      {/* Short description / system state */}
      <div className="card" style={{ padding: 20 }}>
        <p style={{ color: 'var(--text2)', fontSize: 14 }}>Mode monitoring aktif. Silakan gunakan menu di atas atau sidebar untuk mengelola slot dan informasi gedung parkir.</p>
      </div>
    </div>
  );
}
