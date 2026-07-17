import { useEffect, useState } from 'react';
import ScansFilter from '../components/ScansFilter';
import ScansHeader from '../components/ScansHeader';
import ScansLiveIndicator from '../components/ScansLiveIndicator';
import ScansSummary from '../components/ScansSummary';
import ScansTable from '../components/ScansTable';
import { getScans } from '../services/monitoring.service';

const EXTRA_SCANS = [
  { id: 'SCN-007', ticketCode: 'PKF-H1F9H8J7', userName: 'Hana Putri', plate: 'BE 6789 OP', parking: 'RSUD Abdul Moeloek', scanTime: '2026-05-08T11:10:00Z', action: 'masuk', status: 'success' },
  { id: 'SCN-008', ticketCode: 'PKF-F3A7F6H5', userName: 'Farah Amelia', plate: 'BG 2345 KL', parking: 'UNILA Teknik', scanTime: '2026-05-08T07:10:00Z', action: 'masuk', status: 'success' },
  { id: 'SCN-009', ticketCode: 'PKF-INVALID02', userName: '—', plate: '—', parking: 'Mall Boemi Kedaton', scanTime: '2026-05-08T10:30:00Z', action: 'masuk', status: 'failed' },
  { id: 'SCN-010', ticketCode: 'PKF-G2E8G7I6', userName: 'Gunawan Halim', plate: 'BE 4567 MN', parking: 'Mall Boemi Kedaton', scanTime: '2026-05-07T16:30:00Z', action: 'keluar', status: 'success' }
];

export default function ScansPage() {
  const [scans, setScans] = useState([]);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadScans = async () => {
      try {
        const data = await getScans();
        const allScans = [...data, ...EXTRA_SCANS].sort((a, b) => new Date(b.scanTime) - new Date(a.scanTime));
        setScans(allScans);
        setLoading(false);
      } catch (error) {
        console.error('Error loading scans:', error);
        setLoading(false);
      }
    };
    loadScans();
  }, []);

  const filtered = scans.filter(s => {
    const matchSearch = s.ticketCode.toLowerCase().includes(search.toLowerCase()) || s.userName.toLowerCase().includes(search.toLowerCase()) || s.parking.toLowerCase().includes(search.toLowerCase()) || s.plate.toLowerCase().includes(search.toLowerCase());
    const matchAction = actionFilter === 'all' || s.action === actionFilter;
    const matchStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchSearch && matchAction && matchStatus;
  });

  return (
    <div>
      <ScansHeader />
      <ScansSummary 
        total={scans.length} 
        success={scans.filter(s => s.status === 'success').length} 
        failed={scans.filter(s => s.status === 'failed').length} 
        masuk={scans.filter(s => s.action === 'masuk').length} 
        keluar={scans.filter(s => s.action === 'keluar').length} 
      />
      <ScansLiveIndicator />
      <ScansFilter 
        search={search} setSearch={setSearch} 
        actionFilter={actionFilter} setActionFilter={setActionFilter} 
        statusFilter={statusFilter} setStatusFilter={setStatusFilter} 
      />
      <ScansTable filtered={filtered} />
    </div>
  );
}
