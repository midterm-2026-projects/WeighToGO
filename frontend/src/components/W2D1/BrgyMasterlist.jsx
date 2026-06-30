import { useState } from "react";

const BARANGAY_OPTIONS = [
  "Brgy. Caloocan", "Brgy. Lanatan", "Brgy. Uno", "Brgy. Ermita", 
  "Brgy. Gumamela", "Brgy. Navotas", "Brgy. Palikpikan", "Brgy. Sampaga", 
  "Brgy. Santol", "Brgy. Gimalas", "Brgy. Dalig", "Brgy. Langgangan", 
  "Brgy. Canda", "Brgy. Pooc", "Brgy. Tanggoy"
];

const AGE_OPTIONS = ["0-11 Months", "12-23 Months", "24-59 Months"];
const STATUS_OPTIONS = ["Normal", "Malnourished", "Obese"];

const MOCK_CHILDREN = [
  { id: 1, address: "Brgy. Caloocan, PUROK 1", caregiver: "MERCADO, MATEO", name: "RAMOS, DIEGO", ip: "NO", sex: "M", dob: "Jun-16-2024", dateMeasured: "Jun-28-2026", weight: 9.5, height: 79.6, ageMos: 24, wfa: "N", hfa: "N", wflh: "N" },
  { id: 2, address: "Brgy. Caloocan, PUROK 2", caregiver: "TORRES, JOSE", name: "OCAMPO, TERESA", ip: "NO", sex: "M", dob: "Dec-16-2025", dateMeasured: "Jun-05-2026", weight: 6.5, height: 65.2, ageMos: 6, wfa: "N", hfa: "N", wflh: "N" },
  { id: 3, address: "Brgy. Caloocan, PUROK 4", caregiver: "BAUTISTA, MIGUEL", name: "VILLANUEVA, LUZ", ip: "NO", sex: "M", dob: "Jan-16-2024", dateMeasured: "Jun-21-2026", weight: 10.5, height: 82.5, ageMos: 29, wfa: "N", hfa: "N", wflh: "N" },
  { id: 4, address: "Brgy. Caloocan, PUROK 5", caregiver: "TORRES, LUIS", name: "BAUTISTA, CARLOS", ip: "NO", sex: "M", dob: "Oct-16-2021", dateMeasured: "Jun-05-2026", weight: 20.5, height: 104.8, ageMos: 56, wfa: "OW", hfa: "N", wflh: "OB" },
  { id: 5, address: "Brgy. Lanatan, PUROK 3", caregiver: "TORRES, SOFIA", name: "MERCADO, LUIS", ip: "NO", sex: "F", dob: "Apr-16-2022", dateMeasured: "Jun-17-2026", weight: 14.3, height: 96.0, ageMos: 50, wfa: "N", hfa: "ST", wflh: "N" }
];

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

export default function BrgyMasterlist() {
  const [selectedBarangay, setSelectedBarangay] = useState("All");
  const [selectedAgeGroup, setSelectedAgeGroup] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [activeModalChild, setActiveModalChild] = useState(null);

  const filteredRecords = MOCK_CHILDREN.filter((child) => {
    if (selectedBarangay !== "All" && !child.address.includes(selectedBarangay)) return false;

    if (selectedAgeGroup !== "All") {
      if (selectedAgeGroup === "0-11 Months" && (child.ageMos < 0 || child.ageMos > 11)) return false;
      if (selectedAgeGroup === "12-23 Months" && (child.ageMos < 12 || child.ageMos > 23)) return false;
      if (selectedAgeGroup === "24-59 Months" && (child.ageMos < 24 || child.ageMos > 59)) return false;
    }

    if (selectedStatus !== "All") {
      const isMalnourished = child.wfa === "SU" || child.wfa === "U" || child.hfa === "ST" || child.wflh === "W";
      const isObese = child.wfa === "OW" || child.wflh === "OB";
      const isNormal = child.wfa === "N" && child.hfa === "N" && child.wflh === "N";

      if (selectedStatus === "Normal" && !isNormal) return false;
      if (selectedStatus === "Malnourished" && !isMalnourished) return false;
      if (selectedStatus === "Obese" && !isObese) return false;
    }

    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-emerald-950">Barangay Masterlist</h1>
          <p className="text-sm text-gray-500 mt-0.5">Detailed list of children, dimensions, and statuses.</p>
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label htmlFor="filter-barangay" className="sr-only">Barangay</label>
            <select
              id="filter-barangay"
              value={selectedBarangay}
              onChange={(e) => setSelectedBarangay(e.target.value)}
              className="bg-white border border-gray-300 rounded-md shadow-sm text-sm p-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none font-medium text-gray-700"
            >
              <option value="All">All Barangays</option>
              {BARANGAY_OPTIONS.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          <div>
            <label htmlFor="filter-age" className="sr-only">Age Group</label>
            <select
              id="filter-age"
              value={selectedAgeGroup}
              onChange={(e) => setSelectedAgeGroup(e.target.value)}
              className="bg-white border border-gray-300 rounded-md shadow-sm text-sm p-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none font-medium text-gray-700"
            >
              <option value="All">All Ages</option>
              {AGE_OPTIONS.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>

          <div>
            <label htmlFor="filter-status" className="sr-only">Overall Status</label>
            <select
              id="filter-status"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-white border border-gray-300 rounded-md shadow-sm text-sm p-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none font-medium text-gray-700"
            >
              <option value="All">Overall Status</option>
              {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* KPI Stats Panel */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex items-center justify-between border-l-4 border-l-blue-500">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-gray-400 tracking-wider uppercase">Total Registered</span>
          <div className="text-3xl font-extrabold text-blue-600">{filteredRecords.length}</div>
          <span className="text-xs text-gray-500 block">Filtered child masterlist view</span>
        </div>
        <div className="p-3 bg-blue-50 rounded-xl text-blue-500">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
      </div>

      {/* Masterlist Data Table */}
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
                <th className="px-4 py-3.5 text-center">WFA</th>
                <th className="px-4 py-3.5 text-center">HFA</th>
                <th className="px-4 py-3.5 text-center">WFL/H</th>
                <th className="px-4 py-3.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white text-gray-600">
              {filteredRecords.length > 0 ? (
                filteredRecords.map((child) => (
                  <tr key={child.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-4 py-3 text-xs leading-relaxed max-w-[160px] truncate">{child.address}</td>
                    <td className="px-4 py-3 font-medium text-gray-500 uppercase text-xs">{child.caregiver}</td>
                    <td className="px-4 py-3 font-bold text-slate-800 uppercase text-xs">{child.name}</td>
                    <td className="px-4 py-3 text-center text-xs">{child.ip}</td>
                    <td className="px-4 py-3 text-center text-xs">{child.sex}</td>
                    <td className="px-4 py-3 text-xs whitespace-nowrap">{child.dob}</td>
                    <td className="px-4 py-3 text-xs whitespace-nowrap">{child.dateMeasured}</td>
                    <td className="px-4 py-3 text-center font-bold text-slate-800">{child.weight.toFixed(1)}</td>
                    <td className="px-4 py-3 text-center font-bold text-slate-800">{child.height.toFixed(1)}</td>
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
      </div>

      {/* Profile Modal Summary Pop-up */}
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