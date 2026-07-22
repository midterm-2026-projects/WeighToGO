import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
  { path: '/health-trends', label: 'Health Trends', icon: '📊', roles: ['Administrator (Admin)'] },
  { path: '/masterlist', label: 'Masterlist', icon: '📋', roles: ['Administrator (Admin)', 'Barangay Nutrition Scholar'] },
  { path: '/health-reports', label: 'Health Reports', icon: '📑', roles: ['Administrator (Admin)'] },
  { path: '/barangay-map', label: 'Barangay Map', icon: '🗺️', roles: ['Administrator (Admin)'] },
  { path: '/monthly-report', label: 'Monthly Report', icon: '📅', roles: ['Barangay Nutrition Scholar'] },
];

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const filteredNav = NAV_ITEMS.filter(item => item.roles.includes(user?.role));

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      <aside className="w-64 bg-white border-r border-gray-200 shadow-sm flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">W</span>
            </div>
            <h1 className="text-xl font-bold text-emerald-700">WeighToGO</h1>
          </div>
          <p className="text-xs text-gray-500 mt-2 ml-10">{user?.role}</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {filteredNav.map(item => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-3 ${
                location.pathname === item.path
                  ? 'bg-emerald-50 text-emerald-700 shadow-sm border border-emerald-100'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-3 px-2 truncate">{user?.email}</p>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2.5 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors border border-red-100"
          >
            Sign Out
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
