import { useState } from 'react';
import Layout from '../../components/layout/Layout';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import api from '../../api';
import toast from 'react-hot-toast';
import { KeyRound } from 'lucide-react';

const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[\w!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,16}$/;

const ChangePassword = () => {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.currentPassword) e.currentPassword = 'Current password is required';
    if (!form.newPassword) e.newPassword = 'New password is required';
    else if (!PASSWORD_REGEX.test(form.newPassword))
      e.newPassword = 'Must be 8–16 chars with 1 uppercase and 1 special character';
    if (form.newPassword === form.currentPassword)
      e.newPassword = 'New password must differ from current password';
    return e;
  };

  const setField = (f) => (e) => {
    setForm(p => ({ ...p, [f]: e.target.value }));
    setErrors(er => ({ ...er, [f]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await api.post('/auth/change-password', form);
      toast.success('Password changed successfully');
      setForm({ currentPassword: '', newPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-md">
        <div className="mb-6 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary-100 flex items-center justify-center">
            <KeyRound className="w-4 h-4 text-primary-600" />
          </div>
          <div>
            <h1 className="page-header">Change Password</h1>
            <p className="text-sm text-gray-500">Update your account password</p>
          </div>
        </div>

        <div className="card p-6">
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Input
              id="current-password"
              label="Current Password"
              type="password"
              value={form.currentPassword}
              onChange={setField('currentPassword')}
              error={errors.currentPassword}
              required
              autoComplete="current-password"
            />
            <Input
              id="new-password"
              label="New Password"
              type="password"
              placeholder="8–16 chars, 1 uppercase, 1 special"
              value={form.newPassword}
              onChange={setField('newPassword')}
              error={errors.newPassword}
              required
              autoComplete="new-password"
            />
            <Button type="submit" loading={loading} id="btn-change-password">
              Update Password
            </Button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default ChangePassword;
