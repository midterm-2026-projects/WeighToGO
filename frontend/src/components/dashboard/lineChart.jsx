import React, { useState } from 'react';
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const RAW_LINE_DATA = {
  malnutrition: [120, 105, 90, 85, 110, 130, 0, 40, 50, 45, 60, 30],
  obesity: [40, 45, 50, 48, 55, 60, 65, 70, 72, 68, 60, 50]
};

export default function LineChart() {
  const [lineFilters, setLineFilters] = useState(['malnutrition']);

  const handleLineFilterChange = (e) => {
    const value = e.target.value;
    setLineFilters(prev => 
      prev.includes(value) ? prev.filter(f => f !== value) : [...prev, value]
    );
  };

  const lineChartData = {
    labels: MONTHS,
    datasets: Object.keys(RAW_LINE_DATA)
      .filter(key => lineFilters.includes(key))
      .map(key => ({
        label: key.charAt(0).toUpperCase() + key.slice(1),
        data: RAW_LINE_DATA[key],
        borderColor: key === 'malnutrition' ? '#ef4444' : '#3b82f6',
        backgroundColor: key === 'malnutrition' ? '#ef4444' : '#3b82f6',
        tension: 0.3
      }))
  };

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 10
        }
      }
    },
    plugins: {
      tooltip: {
        enabled: true,
        intersect: false,
        mode: 'index',
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Monthly Nutritional Cases</h2>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500" 
              value="malnutrition"
              checked={lineFilters.includes('malnutrition')}
              onChange={handleLineFilterChange}
            />
            <span className="text-sm font-medium text-gray-700">Malnutrition</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500" 
              value="obesity"
              checked={lineFilters.includes('obesity')}
              onChange={handleLineFilterChange}
            />
            <span className="text-sm font-medium text-gray-700">Obesity</span>
          </label>
        </div>
      </div>
      <div className="h-100 w-full mt-6">
        <Line data={lineChartData} options={commonOptions} />
      </div>
    </div>
  );
}