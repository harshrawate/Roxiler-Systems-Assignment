import { useEffect, useState, useCallback } from 'react';
import api from '../../api';
import Layout from '../../components/layout/Layout';
import StarRating from '../../components/common/StarRating';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { Search, MapPin, Mail, Star } from 'lucide-react';
import toast from 'react-hot-toast';

const UserStores = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState({ name: '', address: '' });
  const [ratingModal, setRatingModal] = useState(null); // { store, mode: 'submit'|'update' }
  const [pendingRating, setPendingRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const fetchStores = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/user/stores', { params: search });
      setStores(data.data);
    } catch { toast.error('Failed to load stores'); }
    finally { setLoading(false); }
  }, [search]);

  useEffect(() => { fetchStores(); }, [fetchStores]);

  const openRate = (store) => {
    setPendingRating(store.user_rating || 0);
    setRatingModal({ store, mode: store.user_rating_id ? 'update' : 'submit' });
  };

  const handleSubmitRating = async () => {
    if (!pendingRating) { toast.error('Please select a rating'); return; }
    setSubmitting(true);
    try {
      if (ratingModal.mode === 'submit') {
        await api.post('/user/ratings', { store_id: ratingModal.store.id, rating: pendingRating });
        toast.success('Rating submitted!');
      } else {
        await api.put(`/user/ratings/${ratingModal.store.user_rating_id}`, { rating: pendingRating });
        toast.success('Rating updated!');
      }
      setRatingModal(null);
      fetchStores();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save rating');
    } finally { setSubmitting(false); }
  };

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="page-header">Stores</h1>
        <p className="text-sm text-gray-500 mt-1">Browse and rate stores on the platform</p>
      </div>

      <div className="card p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-gray-400" />
            <input
              id="search-store-name"
              className="input-field pl-8 text-sm"
              placeholder="Search by store name..."
              value={search.name}
              onChange={(e) => setSearch(p => ({ ...p, name: e.target.value }))}
            />
          </div>
          <div className="relative">
            <MapPin className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-gray-400" />
            <input
              id="search-store-address"
              className="input-field pl-8 text-sm"
              placeholder="Search by address..."
              value={search.address}
              onChange={(e) => setSearch(p => ({ ...p, address: e.target.value }))}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="card p-5 h-40 animate-pulse bg-gray-100" />
          ))}
        </div>
      ) : stores.length === 0 ? (
        <div className="card p-12 text-center text-gray-400">No stores found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stores.map((store) => (
            <div key={store.id} className="card p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
              <div>
                <h2 className="font-semibold text-gray-900 text-sm leading-tight">{store.name}</h2>
                <div className="flex items-center gap-1 mt-0.5 text-xs text-gray-500">
                  <MapPin className="w-3 h-3" />
                  <span className="truncate">{store.address || 'No address'}</span>
                </div>
                <div className="flex items-center gap-1 mt-0.5 text-xs text-gray-500">
                  <Mail className="w-3 h-3" />
                  <span className="truncate">{store.email}</span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-3 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Overall Rating</span>
                  <div className="flex items-center gap-1">
                    <StarRating value={Math.round(store.avg_rating || 0)} readOnly size="sm" />
                    <span className="text-gray-600 font-medium">
                      {store.avg_rating ? parseFloat(store.avg_rating).toFixed(1) : 'N/A'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Your Rating</span>
                  {store.user_rating ? (
                    <div className="flex items-center gap-1">
                      <StarRating value={store.user_rating} readOnly size="sm" />
                      <span className="text-gray-600 font-medium">{store.user_rating}</span>
                    </div>
                  ) : (
                    <span className="text-gray-400 italic">Not rated</span>
                  )}
                </div>
              </div>

              <Button
                size="sm"
                variant={store.user_rating_id ? 'secondary' : 'primary'}
                onClick={() => openRate(store)}
                id={`btn-rate-store-${store.id}`}
                className="w-full mt-auto"
              >
                <Star className="w-3.5 h-3.5" />
                {store.user_rating_id ? 'Update Rating' : 'Rate Store'}
              </Button>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={!!ratingModal}
        onClose={() => setRatingModal(null)}
        title={ratingModal?.mode === 'update' ? 'Update Your Rating' : 'Rate This Store'}
      >
        {ratingModal && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              {ratingModal.store.name}
            </p>
            <div className="flex flex-col items-center gap-3 py-4">
              <StarRating value={pendingRating} onChange={setPendingRating} size="lg" />
              <p className="text-sm text-gray-500">
                {pendingRating ? `You selected ${pendingRating} star${pendingRating !== 1 ? 's' : ''}` : 'Click to select a rating'}
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setRatingModal(null)}>Cancel</Button>
              <Button onClick={handleSubmitRating} loading={submitting} id="btn-confirm-rating">
                {ratingModal.mode === 'update' ? 'Update' : 'Submit'} Rating
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </Layout>
  );
};

export default UserStores;
