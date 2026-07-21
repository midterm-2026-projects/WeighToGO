import { useState, useEffect, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { api } from '../../services/api';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const CLASSIFICATION_COLORS = {
  normal: '#10b981',
  stunted: '#f59e0b',
  obese: '#ef4444',
};

const ALL_MONTHS = [
  { label: 'All Months', value: 'All' },
  { label: 'January', value: 'Jan' },
  { label: 'February', value: 'Feb' },
  { label: 'March', value: 'Mar' },
  { label: 'April', value: 'Apr' },
  { label: 'May', value: 'May' },
  { label: 'June', value: 'Jun' },
  { label: 'July', value: 'Jul' },
  { label: 'August', value: 'Aug' },
  { label: 'September', value: 'Sep' },
  { label: 'October', value: 'Oct' },
  { label: 'November', value: 'Nov' },
  { label: 'December', value: 'Dec' },
];

const CLASSIFICATIONS = [
  { label: 'Normal', value: 'normal' },
  { label: 'Stunted', value: 'stunted' },
  { label: 'Obese', value: 'obese' },
];

function autoYAxis(data) {
  const all = data.flat();
  const max = all.length ? Math.max(...all) : 0;

  let stepSize;
  let suggestedMax;

  if (max <= 5) {
    stepSize = 1;
    suggestedMax = 5;
  } else if (max <= 10) {
    stepSize = 2;
    suggestedMax = 10;
  } else if (max <= 20) {
    stepSize = 5;
    suggestedMax = Math.ceil(max / 5) * 5;
  } else if (max <= 50) {
    stepSize = 10;
    suggestedMax = Math.ceil(max / 10) * 10;
  } else if (max <= 100) {
    stepSize = 20;
    suggestedMax = Math.ceil(max / 20) * 20;
  } else if (max <= 500) {
    stepSize = 50;
    suggestedMax = Math.ceil(max / 50) * 50;
  } else {
    stepSize = Math.ceil(max / 100) * 10;
    suggestedMax = Math.ceil(max / stepSize) * stepSize;
  }

  if (suggestedMax === max) suggestedMax += stepSize;

  return { suggestedMax, stepSize };
}

export default function BarGraph({ barangay = 'all', ageGroup = 'all' }) {
  const [selectedMonth, setSelectedMonth] = useState('All');
  const [selectedClassifications, setSelectedClassifications] = useState(['normal', 'stunted', 'obese']);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = {
      month: selectedMonth,
      classifications: selectedClassifications.join(','),
      barangay,
      ageGroup,
    };
    api.analytics.barGraph(params)
      .then(res => {
        const data = res.data;
        if (data?.categories && data?.series) {
          setChartData(data);
        }
      })
      .catch(() => setChartData(null))
      .finally(() => setLoading(false));
  }, [selectedMonth, selectedClassifications, barangay, ageGroup]);

  const yAxis = useMemo(() => {
    if (!chartData?.series?.length) return { suggestedMax: 5, stepSize: 1 };
    return autoYAxis(chartData.series.map(s => s.data));
  }, [chartData]);

  const toggleClassification = (cls) => {
    setSelectedClassifications(prev =>
      prev.includes(cls) ? prev.filter(c => c !== cls) : [...prev, cls]
    );
  };

  const barChartData = chartData ? {
    labels: chartData.categories,
    datasets: chartData.series.map(s => ({
      label: s.name,
      data: s.data,
      backgroundColor: CLASSIFICATION_COLORS[s.name.toLowerCase()] || '#6b7280',
      borderRadius: 4,
    }))
  } : {
    labels: [],
    datasets: []
  };

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        min: 0,
        max: yAxis.suggestedMax,
        ticks: { stepSize: yAxis.stepSize },
        grid: { color: '#f3f4f6' }
      },
      x: {
        grid: { display: false },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          font: { size: 11 }
        }
      }
    },
    plugins: {
      tooltip: { enabled: true, intersect: false, mode: 'index' },
      legend: {
        position: 'bottom',
        labels: { usePointStyle: true, padding: 20 }
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Cases by Barangay</h2>
        <p className="text-sm text-gray-500 mt-1">Comparison of nutritional cases across all barangays</p>
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Month</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
          >
            {ALL_MONTHS.map(m => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Classification</label>
          <div className="flex gap-2">
            {CLASSIFICATIONS.map(cls => (
              <button
                key={cls.value}
                onClick={() => toggleClassification(cls.value)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
                  selectedClassifications.includes(cls.value)
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                }`}
              >
                {cls.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="h-80 w-full mt-4">
        {loading ? (
          <div className="flex items-center justify-center h-full text-gray-400">Loading chart...</div>
        ) : (
          <Bar data={barChartData} options={commonOptions} />
        )}
      </div>
    </div>
  );
}
