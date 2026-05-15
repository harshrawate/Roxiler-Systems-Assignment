import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Users, Store, LogOut, KeyRound, Star
} from 'lucide-react';

const adminLinks = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/stores', label: 'Stores', icon: Store },
];

const userLinks = [
  { to: '/user/stores', label: 'Stores', icon: Store },
  { to: '/user/change-password', label: 'Change Password', icon: KeyRound },
];

const ownerLinks = [
  { to: '/owner/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/owner/change-password', label: 'Change Password', icon: KeyRound },
];

const linkMap = { admin: adminLinks, user: userLinks, store_owner: ownerLinks };

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const links = linkMap[user?.role] ?? [];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-60 shrink-0 bg-white border-r border-gray-200 flex flex-col min-h-screen">
      
      <div className="px-5 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
            <Star className="w-4 h-4 text-white fill-white" />
          </div>
          <span className="font-semibold text-gray-900 text-sm">RateMyStore</span>
        </div>
      </div>

      <div className="px-5 py-4 border-b border-gray-100">
        <p className="text-xs text-gray-400 uppercase font-medium tracking-wider mb-1">Signed in as</p>
        <p className="text-sm font-medium text-gray-800 truncate">{user?.name}</p>
        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`
            }
          >
            <Icon className="w-4 h-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
          id="btn-logout"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
