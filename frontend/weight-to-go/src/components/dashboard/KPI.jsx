import React from 'react';

export const KPI = ({ title, value, trend, trendDirection, icon }) => {
  return (
    <div className="p-6 rounded-xl shadow-sm bg-white border border-gray-100 relative w-full">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">{title}</h3>
          <p className="mt-2 text-4xl font-bold text-gray-900">{value}</p>
        </div>
        {icon && (
          <div className="p-3 bg-blue-50 rounded-full text-blue-600">
            {icon}
          </div>
        )}
      </div>
      {trend && (
        <div className="mt-4 flex items-center text-sm">
          <span className={`font-semibold ${trendDirection === 'up' ? 'text-green-500' : trendDirection === 'down' ? 'text-red-500' : 'text-gray-400'}`}>
            {trendDirection === 'up' ? '↑' : trendDirection === 'down' ? '↓' : ''} {trend}
          </span>
          <span className="ml-2 text-gray-400 text-xs">Since last period</span>
        </div>
      )}
    </div>
  );
};