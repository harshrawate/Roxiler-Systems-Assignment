import { useEffect, useState } from 'react';
import api from '../../api';
import Layout from '../../components/layout/Layout';
import { Users, Store, Star } from 'lucide-react';

const StatCard = ({ label, value, icon: Icon, color }) => (
  <div className="card p-6 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value ?? '—'}</p>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard')
      .then(r => setStats(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="page-header">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Platform overview</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="card p-6 h-24 animate-pulse bg-gray-100" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label="Total Users" value={stats?.totalUsers} icon={Users} color="bg-blue-500" />
          <StatCard label="Total Stores" value={stats?.totalStores} icon={Store} color="bg-emerald-500" />
          <StatCard label="Total Ratings" value={stats?.totalRatings} icon={Star} color="bg-amber-500" />
        </div>
      )}
    </Layout>
  );
};

export default AdminDashboard;
