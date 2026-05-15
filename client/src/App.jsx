import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminStores from './pages/admin/Stores';

import UserStores from './pages/user/Stores';
import ChangePassword from './pages/user/ChangePassword';

import OwnerDashboard from './pages/storeowner/Dashboard';

const RootRedirect = () => {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  const map = { admin: '/admin/dashboard', user: '/user/stores', store_owner: '/owner/dashboard' };
  return <Navigate to={map[user?.role] || '/login'} replace />;
};

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: { fontSize: '14px', borderRadius: '10px', fontFamily: 'Inter, sans-serif' },
        }}
      />
      <Routes>
        
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<RootRedirect />} />

        <Route path="/admin/dashboard" element={
          <ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedRoute allowedRoles={['admin']}><AdminUsers /></ProtectedRoute>
        } />
        <Route path="/admin/stores" element={
          <ProtectedRoute allowedRoles={['admin']}><AdminStores /></ProtectedRoute>
        } />

        <Route path="/user/stores" element={
          <ProtectedRoute allowedRoles={['user']}><UserStores /></ProtectedRoute>
        } />
        <Route path="/user/change-password" element={
          <ProtectedRoute allowedRoles={['user']}><ChangePassword /></ProtectedRoute>
        } />

        <Route path="/owner/dashboard" element={
          <ProtectedRoute allowedRoles={['store_owner']}><OwnerDashboard /></ProtectedRoute>
        } />
        <Route path="/owner/change-password" element={
          <ProtectedRoute allowedRoles={['store_owner']}><ChangePassword /></ProtectedRoute>
        } />

        <Route path="/unauthorized" element={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900">403</h1>
              <p className="text-gray-500 mt-2">You don&apos;t have access to this page.</p>
              <a href="/login" className="mt-4 inline-block text-primary-600 hover:underline">Go to Login</a>
            </div>
          </div>
        } />
        <Route path="*" element={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900">404</h1>
              <p className="text-gray-500 mt-2">Page not found.</p>
              <a href="/" className="mt-4 inline-block text-primary-600 hover:underline">Go Home</a>
            </div>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;
