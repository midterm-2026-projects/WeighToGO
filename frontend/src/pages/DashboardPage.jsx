import { useState, useEffect } from 'react';
import { api } from '../services/api';
import BarangayMap from '../components/dashboard/barangayMap';
import LineChart from '../components/dashboard/lineChart';
import BarGraph from '../components/dashboard/barGraph';

export default function DashboardPage() {
  const [mapData, setMapData] = useState([]);
  const [totals, setTotals] = useState({ total: 0, normal: 0, stunted: 0, obese: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.analytics.map().catch(() => ({ data: [] })),
      api.children.totals().catch(() => ({ data: { normal: 0, stunted: 0, obese: 0 } })),
    ]).then(([mapRes, totalsRes]) => {
      setMapData(mapRes.data || []);
      setTotals(totalsRes.data || { normal: 0, stunted: 0, obese: 0 });
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading dashboard...</div>;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Nutritional monitoring overview</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-green-50 rounded-xl border border-green-200 p-5 hover:shadow-md transition-shadow">
          <p className="text-sm font-medium text-gray-600">Normal</p>
          <p className="text-3xl font-bold text-green-700 mt-2">{totals.normal}</p>
        </div>
        <div className="bg-amber-50 rounded-xl border border-amber-200 p-5 hover:shadow-md transition-shadow">
          <p className="text-sm font-medium text-gray-600">Stunted</p>
          <p className="text-3xl font-bold text-amber-700 mt-2">{totals.stunted}</p>
        </div>
        <div className="bg-rose-50 rounded-xl border border-rose-200 p-5 hover:shadow-md transition-shadow">
          <p className="text-sm font-medium text-gray-600">Obese</p>
          <p className="text-3xl font-bold text-rose-700 mt-2">{totals.obese}</p>
        </div>
      </div>

      <BarangayMap initialData={mapData} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChart />
        <BarGraph />
      </div>
    </div>
  );
}
