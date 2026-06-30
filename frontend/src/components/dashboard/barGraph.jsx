import React, { useState } from 'react';
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BARANGAYS = ['Barangay 1', 'Barangay 2', 'Barangay 3', 'Barangay 4', 'Barangay 5'];

const RAW_BAR_DATA = {
  dengue: [15, 20, 0, 5, 12],
  measles: [2, 0, 10, 5, 0]
};

export default function BarGraph() {
  const [barFilters, setBarFilters] = useState(['dengue']);

  const handleBarFilterChange = (e) => {
    const value = e.target.value;
    setBarFilters(prev => 
      prev.includes(value) ? prev.filter(f => f !== value) : [...prev, value]
    );
  };

  const barChartData = {
    labels: BARANGAYS,
    datasets: Object.keys(RAW_BAR_DATA)
      .filter(key => barFilters.includes(key))
      .map(key => ({
        label: key.charAt(0).toUpperCase() + key.slice(1),
        data: RAW_BAR_DATA[key],
        backgroundColor: key === 'dengue' ? '#f59e0b' : '#10b981',
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
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Health Issues by Barangay</h2>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500" 
              value="dengue"
              checked={barFilters.includes('dengue')}
              onChange={handleBarFilterChange}
            />
            <span className="text-sm font-medium text-gray-700">Dengue</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500" 
              value="measles"
              checked={barFilters.includes('measles')}
              onChange={handleBarFilterChange}
            />
            <span className="text-sm font-medium text-gray-700">Measles</span>
          </label>
        </div>
      </div>
      <div className="h-100 w-full mt-6">
        <Bar data={barChartData} options={commonOptions} />
      </div>
    </div>
  );
}