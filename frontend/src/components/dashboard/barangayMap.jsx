import React, { useState } from 'react';


const MAP_DATA = [
  { 
    id: 1, name: 'Barangay 1', cases: 5, registeredChildren: 150, 
    status: { normal: 145, deficit: 3, excess: 2 }, 
    coordinates: { top: '20%', left: '30%' } 
  },
  { 
    id: 2, name: 'Barangay 2', cases: 25, registeredChildren: 200, 
    status: { normal: 175, deficit: 15, excess: 10 }, 
    coordinates: { top: '40%', left: '50%' } 
  },
  { 
    id: 3, name: 'Barangay 3', cases: 45, registeredChildren: 180, 
    status: { normal: 135, deficit: 30, excess: 15 }, 
    coordinates: { top: '60%', left: '70%' } 
  },
  { 
    id: 4, name: 'Barangay 4', cases: 8, registeredChildren: 120, 
    status: { normal: 112, deficit: 5, excess: 3 }, 
    coordinates: { top: '70%', left: '30%' } 
  },
  { 
    id: 5, name: 'Barangay 5', cases: 18, registeredChildren: 160, 
    status: { normal: 142, deficit: 10, excess: 8 }, 
    coordinates: { top: '30%', left: '80%' } 
  },
];

export default function BarangayMap() {
  const [hoveredBarangay, setHoveredBarangay] = useState(null);
  const [selectedBarangay, setSelectedBarangay] = useState(null);

  const getRiskDetails = (cases) => {
    if (cases >= 30) {
      return { level: 'High Risk', color: 'bg-red-500', ring: 'ring-red-500/30' };
    }
    if (cases >= 15) {
      return { level: 'Moderate Risk', color: 'bg-yellow-400', ring: 'ring-yellow-400/30' };
    }
    return { level: 'Low Risk', color: 'bg-green-500', ring: 'ring-green-500/30' };
  };

  const handleMarkerClick = (barangay) => {
    setSelectedBarangay(barangay);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Interactive Barangay Map</h2>
          <p className="text-sm text-gray-500">Balayan Nutritional Risk Distribution</p>
        </div>
        
        <div className="flex gap-4 mt-4 sm:mt-0">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
            <span className="text-xs text-gray-600">Low Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
            <span className="text-xs text-gray-600">Moderate</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            <span className="text-xs text-gray-600">High Risk</span>
          </div>
        </div>
      </div>

      <div className="relative w-full h-112.5 bg-slate-50 border border-slate-200 rounded-lg overflow-hidden flex">
        
        <div className="absolute inset-0 opacity-10" style={{ 
          backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', 
          backgroundSize: '20px 20px' 
        }}></div>

        {/* Map Markers */}
        {MAP_DATA.map((barangay) => {
          const risk = getRiskDetails(barangay.cases);
          
          return (
            <div
              key={barangay.id}
              className="absolute group z-10"
              style={{ top: barangay.coordinates.top, left: barangay.coordinates.left }}
              onMouseEnter={() => setHoveredBarangay(barangay)}
              onMouseLeave={() => setHoveredBarangay(null)}
              onClick={() => handleMarkerClick(barangay)}
              data-testid={`marker-${barangay.id}`}
              data-risk={risk.level}
            >
              <div className={`relative flex items-center justify-center w-6 h-6 rounded-full cursor-pointer hover:scale-125 transition-transform duration-200 ${risk.color} ring-4 ${risk.ring}`}>
                <div className="absolute w-2 h-2 bg-white rounded-full"></div>
              </div>

              {/* Tooltip on Hover */}
              {hoveredBarangay?.id === barangay.id && !selectedBarangay && (
                <div className="absolute z-20 w-48 p-3 mt-2 -ml-20 bg-white border border-gray-100 rounded-lg shadow-xl pointer-events-none">
                  <h3 className="font-semibold text-gray-800 text-sm">{barangay.name}</h3>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-500">Nutritional Cases:</span>
                    <span className="font-bold text-gray-800 text-sm">{barangay.cases}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${risk.color}`}></span>
                    <span className="text-xs font-medium text-gray-700">{risk.level}</span>
                  </div>
                  <div className="mt-2 text-[10px] text-gray-400 italic text-center border-t pt-1">
                    Click to view details
                  </div>
                </div>
              )}
            </div>
          );
        })}

        

      </div>
    </div>
  );
}