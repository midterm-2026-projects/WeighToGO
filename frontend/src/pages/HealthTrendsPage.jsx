import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import LineChart from '../components/dashboard/lineChart';
import BarGraph from '../components/dashboard/barGraph';

const AGE_OPTIONS = [
  { label: 'All Ages', value: 'all' },
  { label: '0-11 Months', value: '0-11 Months' },
  { label: '12-23 Months', value: '12-23 Months' },
  { label: '24-59 Months', value: '24-59 Months' },
];

const STATUS_TYPE_OPTIONS = [
  { label: 'All Status', value: 'all' },
  { label: 'Weight-for-Age (WFA)', value: 'wfa' },
  { label: 'Height-for-Age (HFA)', value: 'hfa' },
  { label: 'Weight-for-Length/Height (WFH/L)', value: 'wfhl' },
];

export default function HealthTrendsPage() {
  const [barangays, setBarangays] = useState([{ label: 'All Barangays', value: 'all' }]);
  const [selectedBarangay, setSelectedBarangay] = useState('all');
  const [selectedAge, setSelectedAge] = useState('all');
  const [selectedStatusType, setSelectedStatusType] = useState('wfa');
  const [totals, setTotals] = useState({ total: 0, normal: 0, stunted: 0, obese: 0 });
  const [loading, setLoading] = useState(true);
  const [filterKey, setFilterKey] = useState(0);

  useEffect(() => {
    api.children.filters().then(res => {
      if (res.data?.barangays) {
        setBarangays(res.data.barangays);
      }
    }).catch(() => {});
  }, []);

  const fetchTotals = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedBarangay !== 'all') params.barangay = selectedBarangay;
      if (selectedAge !== 'all') params.ageGroup = selectedAge;
      const res = await api.children.totals(params);
      setTotals(res.data || { total: 0, normal: 0, stunted: 0, obese: 0 });
    } catch {
      setTotals({ total: 0, normal: 0, stunted: 0, obese: 0 });
    } finally {
      setLoading(false);
    }
  }, [selectedBarangay, selectedAge]);

  useEffect(() => { fetchTotals(); }, [fetchTotals]);

  const handleFilterChange = (setter) => (e) => {
    setter(e.target.value);
    setFilterKey(k => k + 1);
  };

  const kpiCards = [
    {
      label: 'Total Registered',
      value: totals.total,
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      icon: '👶',
    },
    {
      label: 'Normal',
      value: totals.normal,
      bg: 'bg-green-50',
      text: 'text-green-700',
      border: 'border-green-200',
      icon: '✅',
    },
    {
      label: 'Stunted',
      value: totals.stunted,
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200',
      icon: '⚠️',
    },
    {
      label: 'Obese',
      value: totals.obese,
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-200',
      icon: '🔴',
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Health Trends</h1>
        <p className="text-sm text-gray-500 mt-1">Monitor nutritional status across all barangays</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Barangay</label>
            <select
              value={selectedBarangay}
              onChange={handleFilterChange(setSelectedBarangay)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            >
              {barangays.map(b => (
                <option key={b.value} value={b.value}>{b.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Age Range</label>
            <select
              value={selectedAge}
              onChange={handleFilterChange(setSelectedAge)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            >
              {AGE_OPTIONS.map(a => (
                <option key={a.value} value={a.value}>{a.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Status Type</label>
            <select
              value={selectedStatusType}
              onChange={handleFilterChange(setSelectedStatusType)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            >
              {STATUS_TYPE_OPTIONS.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map(card => (
          <div key={card.label} className={`${card.bg} ${card.border} border rounded-xl p-5 transition-all duration-200 hover:shadow-md`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">{card.label}</span>
              <span className="text-lg">{card.icon}</span>
            </div>
            <p className={`text-3xl font-bold ${card.text}`}>
              {loading ? '...' : card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Line Chart */}
      <LineChart
        key={`line-${filterKey}`}
        barangay={selectedBarangay}
        ageGroup={selectedAge}
        statusType={selectedStatusType}
        total={totals.total}
      />

      {/* Bar Graph */}
      <BarGraph
        key={`bar-${filterKey}`}
        barangay={selectedBarangay}
        ageGroup={selectedAge}
      />
    </div>
  );
}
