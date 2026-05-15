import { useEffect, useState, useCallback } from 'react';
import api from '../../api';
import Layout from '../../components/layout/Layout';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import StarRating from '../../components/common/StarRating';
import { Plus, Search, X } from 'lucide-react';
import toast from 'react-hot-toast';

const EMPTY_FORM = { name: '', email: '', address: '', owner_id: '' };

const AdminStores = () => {
  const [stores, setStores] = useState([]);
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ name: '', email: '', address: '' });
  const [sort, setSort] = useState({ sortBy: 'name', order: 'asc' });
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const fetchStores = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/stores', { params: { ...filters, ...sort } });
      setStores(data.data);
    } catch { toast.error('Failed to load stores'); }
    finally { setLoading(false); }
  }, [filters, sort]);

  useEffect(() => { fetchStores(); }, [fetchStores]);

  useEffect(() => {
    api.get('/admin/users', { params: { role: 'store_owner' } })
      .then(r => setOwners(r.data.data))
      .catch(() => {});
  }, []);

  const handleSort = (sortBy, order) => setSort({ sortBy, order });

  const validateForm = () => {
    const e = {};
    if (!form.name) e.name = 'Required';
    else if (form.name.length < 20) e.name = 'Min 20 characters';
    else if (form.name.length > 60) e.name = 'Max 60 characters';
    if (!form.email) e.email = 'Required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email';
    if (form.address && form.address.length > 400) e.address = 'Max 400 characters';
    return e;
  };

  const setField = (f) => (e) => {
    setForm(prev => ({ ...prev, [f]: e.target.value }));
    setFormErrors(prev => ({ ...prev, [f]: '' }));
  };

  const handleAddStore = async (e) => {
    e.preventDefault();
    const errs = validateForm();
    if (Object.keys(errs).length) { setFormErrors(errs); return; }
    setSubmitting(true);
    try {
      await api.post('/admin/stores', { ...form, owner_id: form.owner_id || null });
      toast.success('Store created successfully');
      setAddOpen(false);
      setForm(EMPTY_FORM);
      fetchStores();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create store');
    } finally { setSubmitting(false); }
  };

  const columns = [
    { key: 'name', label: 'Store Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'address', label: 'Address', sortable: true, render: (r) => r.address || '—' },
    { key: 'owner_name', label: 'Owner', render: (r) => r.owner_name || '—' },
    {
      key: 'avg_rating', label: 'Rating', sortable: true,
      render: (r) => r.avg_rating
        ? <span className="flex items-center gap-1"><span className="text-amber-500">★</span>{parseFloat(r.avg_rating).toFixed(1)}</span>
        : <span className="text-gray-400 text-xs">No ratings</span>
    },
  ];

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-header">Stores</h1>
          <p className="text-sm text-gray-500 mt-1">{stores.length} total</p>
        </div>
        <Button onClick={() => { setAddOpen(true); setForm(EMPTY_FORM); setFormErrors({}); }} id="btn-add-store">
          <Plus className="w-4 h-4" /> Add Store
        </Button>
      </div>

      <div className="card p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {['name', 'email', 'address'].map((f) => (
            <div key={f} className="relative">
              <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-gray-400" />
              <input
                id={`store-filter-${f}`}
                className="input-field pl-8 text-xs"
                placeholder={`Filter by ${f}`}
                value={filters[f]}
                onChange={(e) => setFilters(prev => ({ ...prev, [f]: e.target.value }))}
              />
            </div>
          ))}
        </div>
        {Object.values(filters).some(Boolean) && (
          <button
            className="mt-2 text-xs text-gray-500 hover:text-primary-600 flex items-center gap-1"
            onClick={() => setFilters({ name: '', email: '', address: '' })}
          >
            <X className="w-3 h-3" /> Clear filters
          </button>
        )}
      </div>

      {loading ? (
        <div className="card p-8 text-center text-gray-400">Loading...</div>
      ) : (
        <Table columns={columns} data={stores} onSort={handleSort} sortConfig={sort} />
      )}

      <Modal isOpen={addOpen} onClose={() => setAddOpen(false)} title="Add New Store">
        <form onSubmit={handleAddStore} className="space-y-4" noValidate>
          <Input id="store-name" label="Store Name" placeholder="Min 20 characters" value={form.name} onChange={setField('name')} error={formErrors.name} required />
          <Input id="store-email" label="Email" type="email" value={form.email} onChange={setField('email')} error={formErrors.email} required />
          <Input id="store-address" label="Address" value={form.address} onChange={setField('address')} error={formErrors.address} />
          <div>
            <label htmlFor="store-owner" className="label">Owner (optional)</label>
            <select id="store-owner" className="input-field" value={form.owner_id} onChange={setField('owner_id')}>
              <option value="">No owner assigned</option>
              {owners.map(o => (
                <option key={o.id} value={o.id}>{o.name} ({o.email})</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" type="button" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button type="submit" loading={submitting} id="btn-add-store-submit">Create Store</Button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
};

export default AdminStores;
