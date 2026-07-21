import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function AdminHome() {
  const [totals, setTotals] = useState({ normal: 0, stunted: 0, obese: 0 });
  const [childCount, setChildCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    api.children.totals().then(res => setTotals(res.data)).catch(() => {});
    api.children.list().then(res => setChildCount(res.data?.length || 0)).catch(() => {});
  }, []);

  const cards = [
    { label: 'Total Children', value: childCount, color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' },
    { label: 'Normal', value: totals.normal, color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200' },
    { label: 'Stunted', value: totals.stunted, color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
    { label: 'Obese', value: totals.obese, color: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map(card => (
          <div key={card.label} className={`${card.bg} ${card.border} border rounded-xl p-6 text-center hover:shadow-md transition-shadow`}>
            <p className="text-sm text-gray-600">{card.label}</p>
            <p className={`text-3xl font-bold ${card.color} mt-2`}>{card.value}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <button onClick={() => navigate('/health-trends')} className="bg-white border border-gray-200 rounded-xl p-6 text-left hover:shadow-md transition-shadow">
          <h3 className="font-semibold text-gray-800">Health Trends</h3>
          <p className="text-sm text-gray-500 mt-1">View charts, KPIs, and nutritional trends</p>
        </button>
        <button onClick={() => navigate('/masterlist')} className="bg-white border border-gray-200 rounded-xl p-6 text-left hover:shadow-md transition-shadow">
          <h3 className="font-semibold text-gray-800">Children Masterlist</h3>
          <p className="text-sm text-gray-500 mt-1">View and manage all registered children</p>
        </button>
        <button onClick={() => navigate('/health-reports')} className="bg-white border border-gray-200 rounded-xl p-6 text-left hover:shadow-md transition-shadow">
          <h3 className="font-semibold text-gray-800">Health Reports</h3>
          <p className="text-sm text-gray-500 mt-1">View nutritional status reports by barangay</p>
        </button>
        <button onClick={() => navigate('/barangay-map')} className="bg-white border border-gray-200 rounded-xl p-6 text-left hover:shadow-md transition-shadow">
          <h3 className="font-semibold text-gray-800">Barangay Map</h3>
          <p className="text-sm text-gray-500 mt-1">Interactive map with risk distribution</p>
        </button>
      </div>
    </div>
  );
}
