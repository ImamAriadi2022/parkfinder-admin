import { useEffect, useState } from 'react';
import { useApp } from '../../../core/providers/AppProvider';
import UserDetailModal from '../components/UserDetailModal';
import UsersFilter from '../components/UsersFilter';
import UsersHeader from '../components/UsersHeader';
import UsersInfoBox from '../components/UsersInfoBox';
import UsersSummary from '../components/UsersSummary';
import UsersTable from '../components/UsersTable';
import { getUsers } from '../services/user.service';

export default function UsersPage() {
  const { search, setSearch } = useApp();
  const [users, setUsers] = useState([]);
  const [platformFilter, setPlatform] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 3; // Displays 3 items per page matching the screenshot

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
        setLoading(false);
      } catch (error) {
        console.error('Error loading users:', error);
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  // Reset pagination index when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [platformFilter, search]);

  const guestCount = users.filter(u => u.platform === 'web').length;
  const activeCount = users.filter(u => u.status === 'active').length;
  const inactiveCount = users.filter(u => u.status !== 'active').length;
  const mobileCount = users.filter(u => u.platform === 'mobile').length;

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    const matchSearch =
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.phone?.includes(q) ||
      u.plate?.toLowerCase().includes(q) ||
      u.id?.toLowerCase().includes(q);
    const matchPlatform = platformFilter === 'all' || u.platform === platformFilter;
    return matchSearch && matchPlatform;
  });

  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const isGuest = u => u.platform === 'web';

  return (
    <div>
      <UsersSummary 
        total={users.length} active={activeCount} inactive={inactiveCount} 
        mobile={mobileCount} guest={guestCount} 
      />
      <UsersInfoBox />
      <UsersFilter 
        search={search} setSearch={setSearch} 
        platformFilter={platformFilter} setPlatform={setPlatform} 
      />
      <UsersTable 
        filtered={paginated} 
        isGuest={isGuest} 
        setSelectedUser={setSelectedUser}
        totalCount={filtered.length}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        pageSize={pageSize}
      />
      <UserDetailModal selectedUser={selectedUser} setSelectedUser={setSelectedUser} isGuest={isGuest} />
    </div>
  );
}
