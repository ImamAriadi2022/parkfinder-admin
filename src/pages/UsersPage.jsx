import { useEffect, useState } from 'react';
import UserDetailModal from '../components/pages/UsersPage/UserDetailModal';
import UsersFilter from '../components/pages/UsersPage/UsersFilter';
import UsersHeader from '../components/pages/UsersPage/UsersHeader';
import UsersInfoBox from '../components/pages/UsersPage/UsersInfoBox';
import UsersSummary from '../components/pages/UsersPage/UsersSummary';
import UsersTable from '../components/pages/UsersPage/UsersTable';
import * as dataService from '../services/dataService';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [platformFilter, setPlatform] = useState('all');
  const [statusFilter, setStatus] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await dataService.getUsers(true);
        setUsers(data);
        setLoading(false);
      } catch (error) {
        console.error('Error loading users:', error);
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  const guestCount = users.filter(u => u.platform === 'web').length;
  const activeCount = users.filter(u => u.status === 'active').length;
  const inactiveCount = users.filter(u => u.status !== 'active').length;
  const mobileCount = users.filter(u => u.platform === 'mobile').length;

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    const matchSearch = u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q) || u.phone?.includes(q) || u.plate?.toLowerCase().includes(q) || u.id?.toLowerCase().includes(q);
    const matchPlatform = platformFilter === 'all' || u.platform === platformFilter;
    const matchStatus = statusFilter === 'all' || u.status === statusFilter;
    return matchSearch && matchPlatform && matchStatus;
  });

  const isGuest = u => u.platform === 'web';

  return (
    <div>
      <UsersHeader />
      <UsersSummary 
        total={users.length} active={activeCount} inactive={inactiveCount} 
        mobile={mobileCount} guest={guestCount} 
      />
      <UsersInfoBox />
      <UsersFilter 
        search={search} setSearch={setSearch} 
        platformFilter={platformFilter} setPlatform={setPlatform} 
        statusFilter={statusFilter} setStatus={setStatus} 
      />
      <UsersTable filtered={filtered} isGuest={isGuest} setSelectedUser={setSelectedUser} />
      <UserDetailModal selectedUser={selectedUser} setSelectedUser={setSelectedUser} isGuest={isGuest} />
    </div>
  );
}