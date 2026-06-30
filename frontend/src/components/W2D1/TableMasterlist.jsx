import { useState } from "react";

function StatusBadge({ status }) {
  const styles = {
    N: "bg-green-100 text-green-700 border-green-200",
    OW: "bg-amber-100 text-amber-700 border-amber-200",
    OB: "bg-amber-100 text-amber-700 border-amber-200",
    ST: "bg-red-100 text-red-700 border-red-200",
    W: "bg-red-100 text-red-700 border-red-200",
  };
  return (
    <span className={`inline-block px-2.5 py-0.5 text-xs font-bold border rounded-full ${styles[status] || "bg-gray-100 text-gray-700"}`}>
      {status}
    </span>
  );
}

export default function TableMasterlist({ records }) {
  const [activeModalChild, setActiveModalChild] = useState(null);

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 border-collapse text-sm text-left">
          <thead className="bg-gray-50 text-gray-700 font-semibold uppercase tracking-wider text-xs border-b border-gray-200">
            <tr>
              <th className="px-4 py-3.5">Address / Purok</th>
              <th className="px-4 py-3.5">Mother / Caregiver</th>
              <th className="px-4 py-3.5">Name of Child</th>
              <th className="px-4 py-3.5 text-center">IP Group</th>
              <th className="px-4 py-3.5 text-center">Sex</th>
              <th className="px-4 py-3.5">Date of Birth</th>
              <th className="px-4 py-3.5">Date Measured</th>
              <th className="px-4 py-3.5 text-center">Weight (kg)</th>
              <th className="px-4 py-3.5 text-center">Height (cm)</th>
              <th className="px-4 py-3.5 text-center">Age (mos)</th>
              <th className="px-4 py-3.5 text-center">WFA Status</th>
              <th className="px-4 py-3.5 text-center">HFA Status</th>
              <th className="px-4 py-3.5 text-center">WFL/H Status</th>
              <th className="px-4 py-3.5 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white text-gray-600">
            {records && records.length > 0 ? (
              records.map((child) => (
                <tr key={child.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-4 py-3 text-xs leading-relaxed max-w-[160px] truncate">{child.address}</td>
                  <td className="px-4 py-3 font-medium text-gray-500 uppercase text-xs">{child.caregiver}</td>
                  <td className="px-4 py-3 font-bold text-slate-800 uppercase text-xs">{child.name}</td>
                  <td className="px-4 py-3 text-center text-xs">{child.ip}</td>
                  <td className="px-4 py-3 text-center text-xs">{child.sex}</td>
                  <td className="px-4 py-3 text-xs whitespace-nowrap">{child.dob}</td>
                  <td className="px-4 py-3 text-xs whitespace-nowrap">{child.dateMeasured}</td>
                  <td className="px-4 py-3 text-center font-bold text-slate-800">{child.weight?.toFixed(1)}</td>
                  <td className="px-4 py-3 text-center font-bold text-slate-800">{child.height?.toFixed(1)}</td>
                  <td className="px-4 py-3 text-center">{child.ageMos}</td>
                  <td className="px-4 py-3 text-center"><StatusBadge status={child.wfa} /></td>
                  <td className="px-4 py-3 text-center"><StatusBadge status={child.hfa} /></td>
                  <td className="px-4 py-3 text-center"><StatusBadge status={child.wflh} /></td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => setActiveModalChild(child)}
                      className="bg-emerald-800 text-white font-medium text-xs px-3 py-1.5 rounded hover:bg-emerald-900 transition-colors"
                    >
                      Profile
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="14" className="px-4 py-12 text-center font-medium text-gray-400 bg-gray-50/50">
                  No matching child profile records discovered.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {activeModalChild && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4" data-testid="profile-modal">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-xl border border-gray-100 overflow-hidden relative">
            
            <div className="p-6 pb-4 border-b border-gray-100 flex items-start gap-4">
              <div className="p-3 bg-gray-100 text-gray-600 rounded-full">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-emerald-900 uppercase truncate">{activeModalChild.name}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{activeModalChild.address}</p>
              </div>
              <button
                onClick={() => setActiveModalChild(null)}
                className="text-gray-400 hover:text-gray-600 rounded-lg p-1 hover:bg-gray-100 transition-colors"
                aria-label="Close Modal"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-4 bg-gray-50/50">
              <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
                <span className="text-2xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Parents / Caregiver</span>
                <span className="text-sm font-semibold text-gray-700 uppercase">{activeModalChild.caregiver}</span>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs space-y-2.5">
                <span className="text-2xs font-bold text-gray-400 uppercase tracking-widest block border-b border-gray-100 pb-1.5">
                  Current Nutritional Breakdown
                </span>
                
                <div className="text-sm text-gray-700 flex items-center justify-between">
                  <span><strong>WFA (Weight for Age):</strong> Normal</span>
                  <StatusBadge status={activeModalChild.wfa} />
                </div>
                <div className="text-sm text-gray-700 flex items-center justify-between">
                  <span><strong>HFA (Height for Age):</strong> Normal</span>
                  <StatusBadge status={activeModalChild.hfa} />
                </div>
                <div className="text-sm text-gray-700 flex items-center justify-between">
                  <span><strong>WFL/H (Weight for Length/Height):</strong> Normal</span>
                  <StatusBadge status={activeModalChild.wflh} />
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}