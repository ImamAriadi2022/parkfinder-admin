import { useEffect, useState } from 'react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import CustomTooltip from '../../../shared/components/CustomTooltip';
import { getOccupancyData, getPlatformData, getBookingStats, getScanStats } from '../services/monitoring.service';

const MONTHLY_DATA = [
  { name: 'Jan', bookings: 4200, users: 3100, scans: 3800 },
  { name: 'Feb', bookings: 4800, users: 3600, scans: 4400 },
  { name: 'Mar', bookings: 5200, users: 4100, scans: 4900 },
  { name: 'Apr', bookings: 6800, users: 5200, scans: 6300 },
  { name: 'Mei', bookings: 7900, users: 6400, scans: 7400 }
];

const SUCCESS_RATE_DATA = [
  { name: 'Sen', berhasil: 97, gagal: 3 },
  { name: 'Sel', berhasil: 98, gagal: 2 },
  { name: 'Rab', berhasil: 96, gagal: 4 },
  { name: 'Kam', berhasil: 99, gagal: 1 },
  { name: 'Jum', berhasil: 98, gagal: 2 },
  { name: 'Sab', berhasil: 97, gagal: 3 },
  { name: 'Min', berhasil: 99, gagal: 1 }
];

export default function AnalyticsPage() {
  const [occupancyData, setOccupancyData] = useState([]);
  const [platformData, setPlatformData] = useState([]);
  const [bookingChartData, setBookingChartData] = useState([]);
  const [scanHourlyData, setScanHourlyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalyticsData = async () => {
      try {
        const [
          occupancy,
          platform,
          bookingChart,
          scanHourly
        ] = await Promise.all([
          getOccupancyData(),
          getPlatformData(),
          getBookingStats(7),
          getScanStats()
        ]);

        setOccupancyData(occupancy);
        setPlatformData(platform);
        setBookingChartData(bookingChart);
        setScanHourlyData(scanHourly);
        setLoading(false);
      } catch (error) {
        console.error('Error loading analytics data:', error);
        setLoading(false);
      }
    };

    loadAnalyticsData();
  }, []);

  const safeOccupancy = occupancyData.length > 0 ? occupancyData : [];
  const safePlatform = platformData.length > 0 ? platformData : [];
  const safeBookingChart = bookingChartData.length > 0 ? bookingChartData : [];
  const safeScanHourly = scanHourlyData.length > 0 ? scanHourlyData : [];

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">📊 Analitik & Statistik</h1>
          <p className="page-sub">Insight mendalam performa sistem parkir ParkFinder</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <select className="input" style={{ width: 'auto' }}>
            <option>7 Hari Terakhir</option>
            <option>30 Hari Terakhir</option>
            <option>Bulan Ini</option>
          </select>
        </div>
      </div>

      {/* KPI Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px,1fr))',
        gap: 14,
        marginBottom: 24
      }}>
        {[
          { label: 'Rata-rata Booking/Hari', value: '353', change: '+8.2%', up: true, color: 'var(--accent)' },
          { label: 'Tingkat Keberhasilan Scan', value: '95.7%', change: '+1.1%', up: true, color: 'var(--green)' },
          { label: 'Rata-rata Durasi Parkir', value: '2j 14m', change: '-5m', up: false, color: 'var(--orange)' },
          { label: 'Total Swap Berhasil', value: '87', change: '+18%', up: true, color: 'var(--accent2)' }
        ].map((k, i) => (
          <div key={i} className="card" style={{ padding: '18px 20px' }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: k.color, marginBottom: 4 }}>{k.value}</div>
            <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 8 }}>{k.label}</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: k.up ? 'var(--green)' : 'var(--red)' }}>
              {k.up ? '↑' : '↓'} {k.change} dari minggu lalu
            </div>
          </div>
        ))}
      </div>

      {/* Booking Trend 7 Hari */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header">
          <span className="card-title">📈 Tren Booking & Scan 7 Hari Terakhir</span>
          <div style={{ display: 'flex', gap: 14, fontSize: 12 }}>
            <span style={{ color: 'var(--accent)' }}>● Booking</span>
            <span style={{ color: 'var(--green)' }}>● Scan</span>
            <span style={{ color: 'var(--accent2)' }}>● Swap</span>
          </div>
        </div>
        <div className="card-body">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={safeBookingChart}>
              <defs>
                <linearGradient id="bkGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="scGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--green)" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="var(--green)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fill: 'var(--text3)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text3)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="bookings" name="Booking" stroke="var(--accent)" strokeWidth={2.5} fill="url(#bkGrad)" />
              <Area type="monotone" dataKey="scans" name="Scan" stroke="var(--green)" strokeWidth={2} fill="url(#scGrad)" />
              <Line type="monotone" dataKey="swaps" name="Swap" stroke="var(--accent2)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts grid */}
      <div className="section-grid section-grid-2" style={{ marginBottom: 20 }}>
        {/* Occupancy bar */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">🏢 Perbandingan Okupansi Gedung</span>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={safeOccupancy} layout="vertical">
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} tick={{ fill: 'var(--text3)', fontSize: 12 }} axisLine={false} tickLine={false} unit="%" />
                <YAxis type="category" dataKey="name" tick={{ fill: 'var(--text3)', fontSize: 11 }} axisLine={false} tickLine={false} width={90} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" name="Okupansi %" radius={[0, 4, 4, 0]} maxBarSize={18}>
                  {safeOccupancy.map((entry, i) => (
                    <Cell key={i} fill={entry.value >= 90 ? 'var(--red)' : entry.value >= 75 ? 'var(--orange)' : 'var(--green)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly growth */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">📅 Pertumbuhan Bulanan</span>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={MONTHLY_DATA}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fill: 'var(--text3)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text3)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="bookings" name="Booking" stroke="var(--accent)" strokeWidth={2.5} dot={{ fill: 'var(--accent)', r: 4 }} />
                <Line type="monotone" dataKey="users" name="Pengguna Baru" stroke="var(--accent2)" strokeWidth={2} dot={{ fill: 'var(--accent2)', r: 4 }} strokeDasharray="5 5" />
                <Line type="monotone" dataKey="scans" name="Scan" stroke="var(--green)" strokeWidth={1.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Scan Success Rate + Platform */}
      <div className="section-grid section-grid-2" style={{ marginBottom: 20 }}>
        {/* Success rate */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">✅ Tingkat Keberhasilan Scan per Hari</span>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={SUCCESS_RATE_DATA} barGap={2}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fill: 'var(--text3)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: 'var(--text3)', fontSize: 12 }} axisLine={false} tickLine={false} unit="%" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="berhasil" name="Berhasil %" fill="var(--green)" radius={[3, 3, 0, 0]} maxBarSize={20} />
                <Bar dataKey="gagal" name="Gagal %" fill="var(--red)" radius={[3, 3, 0, 0]} maxBarSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hourly scan */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">⏱️ Pola Scan per Jam (Hari Ini)</span>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={safeScanHourly} barGap={2}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
                <XAxis dataKey="hour" tick={{ fill: 'var(--text3)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text3)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="masuk" name="Masuk" fill="var(--accent)" radius={[3, 3, 0, 0]} maxBarSize={16} />
                <Bar dataKey="keluar" name="Keluar" fill="var(--orange)" radius={[3, 3, 0, 0]} maxBarSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Platform + Performa Gedung */}
      <div className="section-grid section-grid-2" style={{ marginBottom: 20 }}>
        {/* Platform */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">📱 Distribusi Platform Pengguna</span>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={safePlatform} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={4} dataKey="value">
                  {safePlatform.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', gap: 32, marginTop: 8 }}>
              {safePlatform.map((p, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: p.color }}>{p.value}%</div>
                  <div style={{ fontSize: 12, color: 'var(--text3)' }}>{p.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Parkings */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">🏆 Aktivitas per Gedung (7hr)</span>
          </div>
          <div className="card-body">
            {[
              { name: 'Mall Boemi Kedaton', bookings: 892, scans: 845, swap: 34, pct: 94 },
              { name: 'Lampung City Mall', bookings: 745, scans: 712, swap: 28, pct: 96 },
              { name: 'Stasiun Tanjungkarang', bookings: 421, scans: 403, swap: 12, pct: 96 },
              { name: 'UNILA Teknik Elektro', bookings: 312, scans: 309, swap: 8, pct: 99 },
              { name: 'Pasar Bambu Kuning', bookings: 201, scans: 191, swap: 5, pct: 95 },
              { name: 'RSUD Abdul Moeloek', bookings: 178, scans: 162, swap: 2, pct: 91 }
            ].map((r, i) => (
              <div key={i} style={{ padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyStyle: 'space-between', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>
                    <span style={{ color: 'var(--text3)', marginRight: 8, fontSize: 11 }}>#{i + 1}</span>
                    {r.name}
                  </div>
                  <div style={{ display: 'flex', gap: 12, fontSize: 12 }}>
                    <span style={{ color: 'var(--accent)' }}>{r.bookings} booking</span>
                    <span style={{ color: 'var(--green)' }}>{r.scans} scan</span>
                  </div>
                </div>
                <div className="progress">
                  <div className="progress-bar progress-bar-accent" style={{ width: r.pct + '%' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
