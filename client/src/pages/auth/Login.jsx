import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { Star } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email format';
    if (!form.password) errs.password = 'Password is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`);
      const redirectMap = { admin: '/admin/dashboard', user: '/user/stores', store_owner: '/owner/dashboard' };
      navigate(redirectMap[user.role] || '/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
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
          <h1 className="text-2xl font-bold text-gray-900">RateMyStore</h1>
          <p className="text-sm text-gray-500 mt-1">Sign in to continue</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <Input
              id="login-email"
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => { setForm(f => ({ ...f, email: e.target.value })); setErrors(er => ({ ...er, email: '' })); }}
              error={errors.email}
              required
              autoComplete="email"
            />
            <Input
              id="login-password"
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={(e) => { setForm(f => ({ ...f, password: e.target.value })); setErrors(er => ({ ...er, password: '' })); }}
              error={errors.password}
              required
              autoComplete="current-password"
            />
            <Button type="submit" className="w-full" loading={loading} id="btn-login">
              Sign In
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-gray-500">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="font-medium text-primary-600 hover:text-primary-700">
              Sign up
            </Link>
          </p>
        </div>

        <p className="mt-4 text-center text-xs text-gray-400">
          Admin: admin@platform.com · Admin@1234
        </p>
      </div>
    </div>
  );
};

export default Login;
