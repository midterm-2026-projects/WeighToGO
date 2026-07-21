import React from 'react';

export default function MapSidePanel({ barangay, onClose, getRiskDetails }) {
  const isOpen = !!barangay;
  const risk = barangay ? getRiskDetails(barangay.cases) : null;

  const getInsightMessage = (level) => {
    switch(level) {
      case 'Low Risk':
        return 'Great job! This barangay maintains a normal nutritional status with very few recorded cases. Continue standard monitoring.';
      case 'Moderate Risk':
        return 'Needs attention. There is a noticeable number of nutritional cases. Early intervention and supplementary feeding programs are recommended.';
      case 'High Risk':
        return 'Critical Alert! Immediate action, targeted feeding programs, and individual medical assessments are highly required for this area.';
      default:
        return '';
    }
  };

  const lightenColor = (hex) => {
    if (!hex) return '#f0fdf4';
    const r = parseInt(hex.slice(1,2), 16) * 17;
    const g = parseInt(hex.slice(2,3), 16) * 17;
    const b = parseInt(hex.slice(3,4), 16) * 17;
    return `rgb(${Math.min(255, r + 200)},${Math.min(255, g + 200)},${Math.min(255, b + 200)})`;
  };

  return (
    <div 
      className={`absolute top-0 right-0 h-full w-full sm:w-80 bg-white shadow-[0_0_15px_rgba(0,0,0,0.1)] border-l border-gray-200 transform transition-transform duration-300 ease-in-out z-[1000] overflow-y-auto ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
    >
      {barangay && risk && (
        <div className="p-5 flex flex-col h-full">
          
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">{barangay.name}</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="mb-6">
            <span 
              className="px-3 py-1 text-xs font-semibold text-white rounded-full"
              style={{ backgroundColor: risk.color }}
            >
              {risk.level}
            </span>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-lg p-4 mb-6 text-center shadow-sm">
            <p className="text-sm text-gray-500 font-medium">Registered Children</p>
            <p className="text-3xl font-bold text-blue-600 mt-1">{barangay.registeredChildren}</p>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 border-b pb-2">Nutritional Status Breakdown</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#22c55e' }}></span> Normal
                </span>
                <span className="font-semibold text-gray-800">{barangay.status.normal}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#f97316' }}></span> Stunted
                </span>
                <span className="font-semibold text-gray-800">{barangay.status.stunted}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#a855f7' }}></span> Obese
                </span>
                <span className="font-semibold text-gray-800">{barangay.status.obese}</span>
              </div>
            </div>
          </div>

          <div 
            className="mt-auto p-4 rounded-lg border"
            style={{ backgroundColor: lightenColor(risk.color), borderColor: risk.color + '40' }}
          >
            <h3 className="text-sm font-bold text-gray-800 mb-2">Health Insight</h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              {getInsightMessage(risk.level)}
            </p>
          </div>

        </div>
      )}
    </div>
  );
}