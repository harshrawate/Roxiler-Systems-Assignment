import { useEffect, useState } from 'react';
import api from '../../api';
import Layout from '../../components/layout/Layout';
import Table from '../../components/common/Table';
import StarRating from '../../components/common/StarRating';
import { Star, Users } from 'lucide-react';
import toast from 'react-hot-toast';

const OwnerDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/storeowner/dashboard')
      .then(r => setData(r.data.data))
      .catch(() => toast.error('Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    { key: 'name', label: 'User Name', sortable: false },
    { key: 'email', label: 'Email', sortable: false },
    {
      key: 'rating', label: 'Rating',
      render: (r) => (
        <div className="flex items-center gap-2">
          <StarRating value={r.rating} readOnly size="sm" />
          <span className="text-sm font-medium">{r.rating}</span>
        </div>
      ),
    },
    {
      key: 'updated_at', label: 'Date',
      render: (r) => new Date(r.updated_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    },
  ];

  if (loading) {
    return (
      <Layout>
        <div className="card p-8 text-center text-gray-400">Loading...</div>
      </Layout>
    );
  }

  if (!data?.store) {
    return (
      <Layout>
        <div className="card p-12 text-center">
          <Star className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No store has been assigned to your account yet.</p>
          <p className="text-gray-400 text-sm mt-1">Please contact the administrator.</p>
        </div>
      </Layout>
    );
  }

  const avgRating = data.avg_rating ? parseFloat(data.avg_rating) : 0;

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="page-header">{data.store.name}</h1>
        <p className="text-sm text-gray-500 mt-1">{data.store.address || 'No address'}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="card p-6">
          <p className="text-sm text-gray-500 mb-2">Average Rating</p>
          <div className="flex items-center gap-3">
            <StarRating value={Math.round(avgRating)} readOnly size="lg" />
            <span className="text-3xl font-bold text-gray-900">
              {avgRating ? avgRating.toFixed(1) : '—'}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-2">Based on {data.store.total_ratings} rating{data.store.total_ratings !== 1 ? 's' : ''}</p>
        </div>

        <div className="card p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Raters</p>
            <p className="text-3xl font-bold text-gray-900">{data.raters.length}</p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-gray-700 mb-3">User Ratings</h2>
        <Table columns={columns} data={data.raters} />
      </div>
    </Layout>
  );
};

export default OwnerDashboard;
