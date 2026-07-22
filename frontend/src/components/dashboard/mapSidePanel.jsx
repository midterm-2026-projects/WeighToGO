import React from 'react';

export default function MapSidePanel({ barangay, onClose }) {
  const isOpen = !!barangay;

  const getInsightMessage = (riskLevel, cases, registeredChildren, status) => {
    const caseRate = registeredChildren > 0 ? ((cases / registeredChildren) * 100).toFixed(1) : 0;
    switch(riskLevel) {
      case 'High Risk':
        return `Critical Alert! ${cases} nutritional case${cases !== 1 ? 's' : ''} recorded (${caseRate}% of registered children). Immediate action, targeted feeding programs, and individual medical assessments are highly required for this area.`;
      case 'Moderate Risk':
        return `Needs attention. ${cases} nutritional case${cases !== 1 ? 's' : ''} recorded (${caseRate}% of registered children). Early intervention and supplementary feeding programs are recommended.`;
      case 'Low Risk':
      default:
        return `Great job! Only ${cases} nutritional case${cases !== 1 ? 's' : ''} recorded (${caseRate}% of registered children). This barangay maintains a good nutritional status. Continue standard monitoring.`;
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
      {barangay && (
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
              style={{ backgroundColor: barangay.color || '#22c55e' }}
            >
              {barangay.riskLevel || 'Low Risk'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 text-center shadow-sm">
              <p className="text-xs text-gray-500 font-medium">Registered</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">{barangay.registeredChildren}</p>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 text-center shadow-sm">
              <p className="text-xs text-gray-500 font-medium">Cases</p>
              <p className="text-2xl font-bold text-red-500 mt-1">{barangay.cases}</p>
            </div>
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
            style={{ backgroundColor: lightenColor(barangay.color), borderColor: (barangay.color || '#22c55e') + '40' }}
          >
            <h3 className="text-sm font-bold text-gray-800 mb-2">Health Insight</h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              {getInsightMessage(barangay.riskLevel, barangay.cases, barangay.registeredChildren, barangay.status)}
            </p>
          </div>

        </div>
      )}
    </div>
  );
}