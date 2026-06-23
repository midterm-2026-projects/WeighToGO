import React from 'react';

export const KPI = ({ title, value }) => {
  const isTitleMissing = !title || (typeof title === 'string' && title.trim() === '');
  const displayTitle = isTitleMissing ? 'Missing Title' : title;
  const displayValue = (value !== undefined && value !== null && value !== '') ? value : '0';

  return (
    <div className="p-6 rounded-xl shadow-sm bg-white border border-gray-100 relative w-full">
      <div className="flex justify-between items-start">
        <div>
          <h3 
            data-testid="kpi-title" 
            className={`text-sm font-semibold uppercase tracking-wider ${isTitleMissing ? 'text-red-500' : 'text-gray-600'}`}
          >
            {displayTitle}
          </h3>
          <p data-testid="kpi-value" className="mt-2 text-4xl font-bold text-gray-900">
            {displayValue}
          </p>
        </div>
      </div>
    </div>
  );
};