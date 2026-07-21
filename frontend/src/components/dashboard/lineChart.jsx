import { useState, useEffect, useMemo } from 'react';
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

const STATUS_COLORS = {
  'Normal': '#10b981',
  'Underweight': '#f59e0b',
  'Severe Underweight': '#ef4444',
  'Overweight': '#3b82f6',
  'Obese': '#8b5cf6',
  'Stunted': '#f97316',
  'Severe Stunted': '#dc2626',
  'Wasted': '#eab308',
  'Severely Wasted': '#b91c1c',
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

  useEffect(() => {
    setLoading(true);
    const params = { barangay, ageGroup, statusType };
    api.analytics.trendline(params)
      .then(res => {
        const data = res.data;
        if (data?.categories && data?.series) {
          setChartData(data);
        }
      })
      .catch(() => setChartData(null))
      .finally(() => setLoading(false));
  }, [barangay, ageGroup, statusType]);

  const yAxis = useMemo(() => {
    if (!chartData?.series?.length) return { suggestedMax: total || 5, stepSize: 1 };
    return autoYAxis(total, chartData.series.map(s => s.data));
  }, [chartData, total]);

  const lineChartData = chartData ? {
    labels: chartData.categories,
    datasets: chartData.series.map(s => ({
      label: s.name,
      data: s.data,
      borderColor: STATUS_COLORS[s.name] || s.color || '#6b7280',
      backgroundColor: STATUS_COLORS[s.name] || s.color || '#6b7280',
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
      legend: {
        position: 'bottom',
        labels: { usePointStyle: true, padding: 20 }
      }
    }
  };

  const statusLabel = {
    wfa: 'Weight-for-Age (WFA)',
    hfa: 'Height-for-Age (HFA)',
    wfhl: 'Weight-for-Length/Height (WFH/L)',
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Monthly Cases Trend</h2>
        <p className="text-sm text-gray-500 mt-1">
          Cases per month — {statusLabel[statusType] || 'WFA'}
        </p>
      </div>
      <div className="h-80 w-full mt-4">
        {loading ? (
          <div className="flex items-center justify-center h-full text-gray-400">Loading chart...</div>
        ) : (
          <Line data={lineChartData} options={commonOptions} />
        )}
      </div>
    </div>
  );
}
