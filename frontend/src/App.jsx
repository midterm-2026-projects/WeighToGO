import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthLayout from './components/layout/AuthLayout';
import AppLayout from './components/layout/AppLayout';
import LoginPage from './pages/LoginPage';
import HealthTrendsPage from './pages/HealthTrendsPage';
import MasterlistPage from './pages/MasterlistPage';
import MonthlyReportPage from './pages/MonthlyReportPage';
import HealthReportsPage from './pages/HealthReportsPage';
import BarangayMapPage from './pages/BarangayMapPage';
import AdminMasterlistPage from './pages/AdminMasterlistPage';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicRoute><AuthLayout /></PublicRoute>}>
        <Route path="/login" element={<LoginPage />} />
      </Route>
      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route path="/health-trends" element={<HealthTrendsPage />} />
        <Route path="/masterlist" element={<AdminMasterlistPage />} />
        <Route path="/health-reports" element={<HealthReportsPage />} />
        <Route path="/barangay-map" element={<BarangayMapPage />} />
        <Route path="/monthly-report" element={<MonthlyReportPage />} />
        <Route path="/bns/masterlist" element={<MasterlistPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
