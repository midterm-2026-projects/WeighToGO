import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { api } from '../../services/api';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const STATUS_DEFS = {
  Normal: { label: 'Normal', value: 'Normal', color: '#10b981' },
  Underweight: { label: 'UW', value: 'Underweight', color: '#f59e0b' },
  'Severe Underweight': { label: 'SUW', value: 'Severe Underweight', color: '#ef4444' },
  Stunted: { label: 'ST', value: 'Stunted', color: '#f97316' },
  'Severe Stunted': { label: 'SST', value: 'Severe Stunted', color: '#dc2626' },
  Wasted: { label: 'MW', value: 'Wasted', color: '#eab308' },
  'Severely Wasted': { label: 'SW', value: 'Severely Wasted', color: '#b91c1c' },
  Overweight: { label: 'Ow', value: 'Overweight', color: '#3b82f6' },
  Obese: { label: 'OB', value: 'Obese', color: '#8b5cf6' },
};

const DEFAULT_STATUSES_BY_TYPE = {
  all: ['Normal', 'Underweight', 'Severe Underweight', 'Stunted', 'Severe Stunted', 'Wasted', 'Severely Wasted', 'Overweight', 'Obese'],
  wfa: ['Normal', 'Underweight', 'Overweight', 'Obese'],
  hfa: ['Normal', 'Stunted'],
  wfhl: ['Normal', 'Wasted', 'Overweight', 'Obese'],
};

function autoYAxis(total, data) {
  const all = data.flat();
  const max = all.length ? Math.max(...all) : (total || 0);

  let stepSize;
  let suggestedMax;

  if (max <= 10) {
    stepSize = 1;
    suggestedMax = max <= 5 ? 5 : 10;
  } else if (max <= 20) {
    stepSize = 5;
    suggestedMax = Math.ceil(max / 5) * 5;
  } else if (max <= 50) {
    stepSize = 10;
    suggestedMax = Math.ceil(max / 10) * 10;
  } else if (max <= 100) {
    stepSize = 20;
    suggestedMax = Math.ceil(max / 20) * 20;
  } else if (max <= 300) {
    stepSize = 50;
    suggestedMax = Math.ceil(max / 50) * 50;
  } else if (max <= 500) {
    stepSize = 100;
    suggestedMax = Math.ceil(max / 100) * 100;
  } else {
    stepSize = Math.ceil(max / 100) * 50;
    suggestedMax = Math.ceil(max / stepSize) * stepSize;
  }

  if (suggestedMax === max) suggestedMax += stepSize;

  return { suggestedMax, stepSize };
}

export default function LineChart({ barangay = 'all', ageGroup = 'all', statusType = 'wfa', total = 0 }) {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedStatuses, setSelectedStatuses] = useState(DEFAULT_STATUSES_BY_TYPE[statusType] || ['Normal']);

  const statusFilters = Object.values(STATUS_DEFS);

  useEffect(() => {
    setSelectedStatuses(DEFAULT_STATUSES_BY_TYPE[statusType] || ['Normal']);
  }, [statusType]);

  const toggleStatus = useCallback((value) => {
    setSelectedStatuses(prev => {
      if (prev.includes(value)) {
        const next = prev.filter(s => s !== value);
        return next.length > 0 ? next : [prev[0]];
      }
      return [...prev, value];
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = { barangay, ageGroup, statusType, statuses: selectedStatuses.join(',') };
    api.analytics.trendline(params)
      .then(res => {
        const data = res.data;
        if (data?.categories && data?.series) {
          setChartData(data);
        }
      })
      .catch(() => setChartData(null))
      .finally(() => setLoading(false));
  }, [barangay, ageGroup, statusType, selectedStatuses]);

  const yAxis = useMemo(() => {
    if (!chartData?.series?.length) return { suggestedMax: total || 5, stepSize: 1 };
    return autoYAxis(total, chartData.series.map(s => s.data));
  }, [chartData, total]);

  const lineChartData = chartData ? {
    labels: chartData.categories,
    datasets: chartData.series.map(s => ({
      label: s.name,
      data: s.data,
      borderColor: s.color || '#6b7280',
      backgroundColor: s.color || '#6b7280',
      tension: 0.3,
      pointRadius: 4,
      pointHoverRadius: 6,
    }))
  } : {
    labels: MONTHS,
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
        grid: { display: false }
      }
    },
    plugins: {
      tooltip: { enabled: true, intersect: false, mode: 'index' },
      legend: { display: false }
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Monthly Cases Trend</h2>
        <p className="text-sm text-gray-500 mt-1">Toggle nutritional statuses to compare</p>
      </div>

      <div className="h-80 w-full mt-4">
        {loading ? (
          <div className="flex items-center justify-center h-full text-gray-400">Loading chart...</div>
        ) : (
          <Line data={lineChartData} options={commonOptions} />
        )}
      </div>

      <div className="flex flex-wrap gap-2 mt-6 justify-center">
        {statusFilters.map(filter => {
          const isActive = selectedStatuses.includes(filter.value);
          return (
            <button
              key={filter.value}
              onClick={() => toggleStatus(filter.value)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-full border-2 transition-all duration-150 ${
                isActive
                  ? 'text-white shadow-sm'
                  : 'bg-white text-gray-400 border-gray-200 hover:border-gray-300 hover:text-gray-600'
              }`}
              style={isActive ? { backgroundColor: filter.color, borderColor: filter.color } : {}}
            >
              {filter.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
