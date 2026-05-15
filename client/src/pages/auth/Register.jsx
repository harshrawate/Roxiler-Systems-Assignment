import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { Star } from 'lucide-react';
import toast from 'react-hot-toast';

const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[\w!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,16}$/;

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', address: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.name) errs.name = 'Name is required';
    else if (form.name.length < 20) errs.name = 'Name must be at least 20 characters';
    else if (form.name.length > 60) errs.name = 'Name must be at most 60 characters';

    if (!form.email) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email format';

    if (!form.password) errs.password = 'Password is required';
    else if (!PASSWORD_REGEX.test(form.password))
      errs.password = 'Must be 8–16 chars with 1 uppercase and 1 special character';

    if (form.address && form.address.length > 400)
      errs.address = 'Address must be at most 400 characters';

    return errs;
  };

  const setField = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }));
    setErrors(er => ({ ...er, [field]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await api.post('/auth/register', form);
      toast.success('Account created! Please sign in.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary-600 mb-4">
            <Star className="w-6 h-6 text-white fill-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
          <p className="text-sm text-gray-500 mt-1">Join RateMyStore today</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Input
              id="reg-name"
              label="Full Name"
              placeholder="At least 20 characters"
              value={form.name}
              onChange={setField('name')}
              error={errors.name}
              required
              autoComplete="name"
            />
            <Input
              id="reg-email"
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={setField('email')}
              error={errors.email}
              required
              autoComplete="email"
            />
            <Input
              id="reg-password"
              label="Password"
              type="password"
              placeholder="8–16 chars, 1 uppercase, 1 special"
              value={form.password}
              onChange={setField('password')}
              error={errors.password}
              required
              autoComplete="new-password"
            />
            <Input
              id="reg-address"
              label="Address"
              placeholder="Your address (optional)"
              value={form.address}
              onChange={setField('address')}
              error={errors.address}
              autoComplete="street-address"
            />
            <Button type="submit" className="w-full" loading={loading} id="btn-register">
              Create Account
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-700">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
