import { useEffect, useState, useCallback } from 'react';
import api from '../../api';
import Layout from '../../components/layout/Layout';
import Table from '../../components/common/Table';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import { Plus, Search, X, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[\w!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,16}$/;

const EMPTY_FORM = { name: '', email: '', password: '', address: '', role: 'user' };

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [sort, setSort] = useState({ sortBy: 'name', order: 'asc' });
  const [addOpen, setAddOpen] = useState(false);
  const [detailUser, setDetailUser] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = { ...filters, ...sort };
      const { data } = await api.get('/admin/users', { params });
      setUsers(data.data);
    } catch {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [filters, sort]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleSort = (sortBy, order) => setSort({ sortBy, order });

  const fetchDetail = async (id) => {
    try {
      const { data } = await api.get(`/admin/users/${id}`);
      setDetailUser(data.data);
    } catch { toast.error('Failed to load user details'); }
  };

  const validateForm = () => {
    const e = {};
    if (!form.name) e.name = 'Required';
    else if (form.name.length < 20) e.name = 'Min 20 characters';
    else if (form.name.length > 60) e.name = 'Max 60 characters';
    if (!form.email) e.email = 'Required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email';
    if (!form.password) e.password = 'Required';
    else if (!PASSWORD_REGEX.test(form.password)) e.password = '8–16 chars, 1 uppercase, 1 special';
    if (form.address && form.address.length > 400) e.address = 'Max 400 characters';
    if (!form.role) e.role = 'Required';
    return e;
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    const errs = validateForm();
    if (Object.keys(errs).length) { setFormErrors(errs); return; }
    setSubmitting(true);
    try {
      await api.post('/admin/users', form);
      toast.success('User created successfully');
      setAddOpen(false);
      setForm(EMPTY_FORM);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create user');
    } finally {
      setSubmitting(false);
    }
  };

  const setField = (f) => (e) => {
    setForm(prev => ({ ...prev, [f]: e.target.value }));
    setFormErrors(prev => ({ ...prev, [f]: '' }));
  };

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'address', label: 'Address', sortable: true, render: (r) => r.address || '—' },
    { key: 'role', label: 'Role', sortable: true, render: (r) => <Badge role={r.role} /> },
    {
      key: 'actions', label: '',
      render: (r) => (
        <button
          onClick={() => fetchDetail(r.id)}
          className="p-1.5 rounded-md text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
          aria-label={`View ${r.name}`}
          title="View details"
        >
          <Eye className="w-4 h-4" />
        </button>
      ),
    },
  ];

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-header">Users</h1>
          <p className="text-sm text-gray-500 mt-1">{users.length} total</p>
        </div>
        <Button onClick={() => { setAddOpen(true); setForm(EMPTY_FORM); setFormErrors({}); }} id="btn-add-user">
          <Plus className="w-4 h-4" /> Add User
        </Button>
      </div>

      <div className="card p-4 mb-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {['name', 'email', 'address'].map((f) => (
            <div key={f} className="relative">
              <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-gray-400" />
              <input
                id={`filter-${f}`}
                className="input-field pl-8 text-xs"
                placeholder={`Filter ${f}`}
                value={filters[f]}
                onChange={(e) => setFilters(prev => ({ ...prev, [f]: e.target.value }))}
              />
            </div>
          ))}
          <select
            id="filter-role"
            className="input-field text-xs"
            value={filters.role}
            onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value }))}
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
            <option value="store_owner">Store Owner</option>
          </select>
        </div>
        {Object.values(filters).some(Boolean) && (
          <button
            className="mt-2 text-xs text-gray-500 hover:text-primary-600 flex items-center gap-1"
            onClick={() => setFilters({ name: '', email: '', address: '', role: '' })}
          >
            <X className="w-3 h-3" /> Clear filters
          </button>
        )}
      </div>

      {loading ? (
        <div className="card p-8 text-center text-gray-400">Loading...</div>
      ) : (
        <Table columns={columns} data={users} onSort={handleSort} sortConfig={sort} />
      )}

      <Modal isOpen={addOpen} onClose={() => setAddOpen(false)} title="Add New User">
        <form onSubmit={handleAddUser} className="space-y-4" noValidate>
          <Input id="new-name" label="Full Name" placeholder="Min 20 characters" value={form.name} onChange={setField('name')} error={formErrors.name} required />
          <Input id="new-email" label="Email" type="email" value={form.email} onChange={setField('email')} error={formErrors.email} required />
          <Input id="new-password" label="Password" type="password" placeholder="8–16 chars, 1 uppercase, 1 special" value={form.password} onChange={setField('password')} error={formErrors.password} required />
          <Input id="new-address" label="Address" value={form.address} onChange={setField('address')} error={formErrors.address} />
          <div>
            <label htmlFor="new-role" className="label">Role <span className="text-red-500">*</span></label>
            <select id="new-role" className={`input-field ${formErrors.role ? 'input-error' : ''}`} value={form.role} onChange={setField('role')}>
              <option value="user">Normal User</option>
              <option value="admin">Admin</option>
              <option value="store_owner">Store Owner</option>
            </select>
            {formErrors.role && <p className="text-xs text-red-500 mt-0.5">{formErrors.role}</p>}
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" type="button" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button type="submit" loading={submitting} id="btn-add-user-submit">Create User</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!detailUser} onClose={() => setDetailUser(null)} title="User Details">
        {detailUser && (
          <div className="space-y-3 text-sm">
            <DetailRow label="Name" value={detailUser.name} />
            <DetailRow label="Email" value={detailUser.email} />
            <DetailRow label="Address" value={detailUser.address} />
            <DetailRow label="Role" value={<Badge role={detailUser.role} />} />
            {detailUser.role === 'store_owner' && detailUser.stores?.length > 0 && (
              <div>
                <p className="font-medium text-gray-500 mb-1">Stores & Ratings</p>
                {detailUser.stores.map(s => (
                  <div key={s.id} className="flex justify-between p-2 bg-gray-50 rounded-lg text-xs mt-1">
                    <span className="font-medium">{s.name}</span>
                    <span className="text-amber-600 font-semibold">★ {s.avg_rating ?? 'No ratings'}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Modal>
    </Layout>
  );
};

const DetailRow = ({ label, value }) => (
  <div className="flex gap-2">
    <span className="w-20 text-gray-400 shrink-0">{label}</span>
    <span className="text-gray-800 font-medium">{value || '—'}</span>
  </div>
);

export default AdminUsers;
