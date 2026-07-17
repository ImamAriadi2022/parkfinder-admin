import { useEffect, useState } from 'react';
import SwapsFilter from '../components/SwapsFilter';
import SwapsHeader from '../components/SwapsHeader';
import SwapsInfo from '../components/SwapsInfo';
import SwapsSummary from '../components/SwapsSummary';
import SwapsTable from '../components/SwapsTable';
import { getSwaps } from '../services/monitoring.service';

const MORE_SWAPS = [
  { id: 'SWP-004', ticketOld: 'PKF-B7E3A2C1', ticketNew: 'PKF-SW-ABCD04', userName: 'Siti Rahayu', plate: 'BE 5678 CD', fromParking: 'Mall Boemi Kedaton', fromSlot: 'B1/B1-04', toParking: 'Mall Boemi Kedaton', toSlot: 'L1/A05', swapTime: '2026-05-08T09:30:00Z', status: 'success' },
  { id: 'SWP-005', ticketOld: 'PKF-E4B6E5G4', ticketNew: null, userName: 'Eko Prasetyo', plate: 'BE 7890 IJ', fromParking: 'Stasiun Tanjungkarang', fromSlot: 'L1/A08', toParking: 'Stasiun Tanjungkarang', toSlot: 'L1/A03', swapTime: '2026-05-08T10:10:00Z', status: 'pending' }
];

export default function SwapsPage() {
  const [swaps, setSwaps] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSwaps = async () => {
      try {
        const data = await getSwaps();
        const allSwaps = [...data, ...MORE_SWAPS].sort((a, b) => new Date(b.swapTime) - new Date(a.swapTime));
        setSwaps(allSwaps);
        setLoading(false);
      } catch (error) {
        console.error('Error loading swaps:', error);
        setLoading(false);
      }
    };
    loadSwaps();
  }, []);

  const filtered = swaps.filter(s => {
    const matchSearch = s.userName.toLowerCase().includes(search.toLowerCase()) || s.ticketOld.toLowerCase().includes(search.toLowerCase()) || s.plate.toLowerCase().includes(search.toLowerCase()) || s.fromParking.toLowerCase().includes(search.toLowerCase()) || s.toParking.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div>
      <SwapsHeader />
      <SwapsSummary 
        total={swaps.length} 
        success={swaps.filter(s => s.status === 'success').length} 
        failed={swaps.filter(s => s.status === 'failed').length} 
        pending={swaps.filter(s => s.status === 'pending').length} 
      />
      <SwapsFilter search={search} setSearch={setSearch} statusFilter={statusFilter} setStatusFilter={setStatusFilter} />
      <SwapsTable filtered={filtered} />
      <SwapsInfo />
    </div>
  );
}
