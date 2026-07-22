import { useState, useEffect } from 'react';
import { api } from '../services/api';

const BARANGAY_OPTIONS = [
  "Brgy. Caloocan", "Brgy. Lanatan", "Brgy. Uno", "Brgy. Ermita",
  "Brgy. Gumamela", "Brgy. Navotas", "Brgy. Palikpikan", "Brgy. Sampaga",
  "Brgy. Santol", "Brgy. Dilao", "Brgy. Dalig", "Brgy. Langgangan",
  "Brgy. Canda", "Brgy. Pooc", "Brgy. Tanggoy"
];

const AGE_OPTIONS = ["0-11 Months", "12-23 Months", "24-59 Months"];
const STATUS_OPTIONS = ["Normal", "Malnourished", "Obese"];
const ROWS_PER_PAGE = 10;

function StatusBadge({ status }) {
  const styles = {
    Normal: "bg-green-100 text-green-700 border-green-200",
    Underweight: "bg-amber-100 text-amber-700 border-amber-200",
    Overweight: "bg-amber-100 text-amber-700 border-amber-200",
    Obese: "bg-amber-100 text-amber-700 border-amber-200",
    Stunted: "bg-red-100 text-red-700 border-red-200",
    Wasted: "bg-red-100 text-red-700 border-red-200",
    'Severe Underweight': "bg-red-100 text-red-700 border-red-200",
    'Severe Stunted': "bg-red-100 text-red-700 border-red-200",
    'Severely Wasted': "bg-red-100 text-red-700 border-red-200",
  };
  return (
    <span className={`inline-block px-2 py-0.5 text-xs font-bold border rounded-full ${styles[status] || "bg-gray-100 text-gray-700 border-gray-200"}`}>
      {status}
    </span>
  );
}

export default function AdminMasterlistPage() {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBarangay, setSelectedBarangay] = useState('All');
  const [selectedAge, setSelectedAge] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedChild, setSelectedChild] = useState(null);
  const [page, setPage] = useState(0);

  const fetchChildren = async (params) => {
    setLoading(true);
    try {
      const res = await api.children.list({ ...params, checkupStatus: 'Checked Up' });
      setChildren(res.data || []);
    } catch (err) {
      console.error('Failed to fetch children:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchChildren(); }, []);

  useEffect(() => {
    setPage(0);
    const params = {};
    if (selectedBarangay !== 'All') params.barangay = selectedBarangay;
    if (selectedAge !== 'All') params.ageGroup = selectedAge;
    if (selectedStatus !== 'All') params.status = selectedStatus;
    fetchChildren(Object.keys(params).length > 0 ? params : undefined);
  }, [selectedBarangay, selectedAge, selectedStatus]);

  const totalPages = Math.ceil(children.length / ROWS_PER_PAGE);
  const paged = children.slice(page * ROWS_PER_PAGE, (page + 1) * ROWS_PER_PAGE);

  const formatBirthdate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${mm}-${dd}-${yyyy}`;
  };

  return (
    <div className="h-full flex flex-col p-6 overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Children Masterlist</h1>
          <p className="text-sm text-gray-500 mt-1">Detailed list of children, dimensions, and statuses.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedBarangay}
            onChange={(e) => setSelectedBarangay(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
          >
            <option value="All">All Barangays</option>
            {BARANGAY_OPTIONS.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
          <select
            value={selectedAge}
            onChange={(e) => setSelectedAge(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
          >
            <option value="All">All Ages</option>
            {AGE_OPTIONS.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
          >
            <option value="All">Overall Status</option>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-center justify-between border-l-4 border-l-emerald-500 mb-4 shrink-0">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-gray-400 tracking-wider uppercase">Total Registered</span>
          <div className="text-3xl font-extrabold text-emerald-600">{children.length}</div>
          <span className="text-xs text-gray-500 block">Filtered child masterlist view</span>
        </div>
        <div className="p-3 bg-emerald-50 rounded-xl text-emerald-500">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-gray-500 py-8">Loading...</p>
      ) : (
        <div className="flex-1 min-h-0 flex flex-col bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="flex-1 min-h-0 overflow-x-auto hide-scrollbar">
              <table className="w-full divide-y divide-gray-200 text-xs">
                <thead className="bg-gray-50 text-gray-700 uppercase tracking-wider sticky top-0">
                  <tr>
                    <th className="px-3 py-2.5 font-semibold text-left">Purok</th>
                    <th className="px-3 py-2.5 font-semibold text-left">Barangay</th>
                    <th className="px-3 py-2.5 font-semibold text-left">Parent</th>
                    <th className="px-3 py-2.5 font-semibold text-left">Child Name</th>
                    <th className="px-3 py-2.5 font-semibold text-left">Sex</th>
                    <th className="px-3 py-2.5 font-semibold text-center">Age</th>
                    <th className="px-3 py-2.5 font-semibold text-left">Birthdate</th>
                    <th className="px-3 py-2.5 font-semibold text-center">Wt</th>
                    <th className="px-3 py-2.5 font-semibold text-center">Ht</th>
                    <th className="px-3 py-2.5 font-semibold text-center">WFA</th>
                    <th className="px-3 py-2.5 font-semibold text-center">HFA</th>
                    <th className="px-3 py-2.5 font-semibold text-center">WFH/L</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paged.map((child) => (
                    <tr key={child.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => setSelectedChild(child)}>
                      <td className="px-3 py-2 text-left">{child.purok}</td>
                      <td className="px-3 py-2 text-left">{child.barangay}</td>
                      <td className="px-3 py-2 font-medium text-gray-600 uppercase text-left truncate max-w-[120px]">{child.parent_name}</td>
                      <td className="px-3 py-2 font-bold text-gray-800 uppercase text-left truncate max-w-[140px]">{child.name}</td>
                      <td className="px-3 py-2 text-left">{child.gender}</td>
                      <td className="px-3 py-2 text-center">{child.age_months}</td>
                      <td className="px-3 py-2 text-left">{formatBirthdate(child.birthdate)}</td>
                      <td className="px-3 py-2 text-center font-bold">{child.weight}</td>
                      <td className="px-3 py-2 text-center font-bold">{child.height}</td>
                      <td className="px-3 py-2 text-center"><StatusBadge status={child.wfa_status} /></td>
                      <td className="px-3 py-2 text-center"><StatusBadge status={child.hfa_status} /></td>
                      <td className="px-3 py-2 text-center"><StatusBadge status={child.wfhl_status} /></td>
                    </tr>
                  ))}
                  {paged.length === 0 && (
                    <tr>
                      <td colSpan="12" className="px-3 py-8 text-center text-gray-400">No matching child records found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50 shrink-0">
              <span className="text-xs text-gray-500">
                Showing {page * ROWS_PER_PAGE + 1}–{Math.min((page + 1) * ROWS_PER_PAGE, children.length)} of {children.length}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(p => p - 1)}
                  disabled={page === 0}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={page >= totalPages - 1}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {selectedChild && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-6 pb-4 border-b border-gray-100 flex items-start gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-full">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-emerald-900 uppercase truncate">{selectedChild.name}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{selectedChild.barangay} - {selectedChild.purok}</p>
              </div>
              <button
                onClick={() => setSelectedChild(null)}
                className="text-gray-400 hover:text-gray-600 rounded-lg p-1 hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4 bg-gray-50/50">
              <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Parent / Caregiver</span>
                <span className="text-sm font-semibold text-gray-700 uppercase">{selectedChild.parent_name}</span>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs grid grid-cols-2 gap-3">
                <div>
                  <span className="text-xs text-gray-500">Gender</span>
                  <p className="font-medium text-gray-800">{selectedChild.gender}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500">Age</span>
                  <p className="font-medium text-gray-800">{selectedChild.age_months} months</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500">Weight</span>
                  <p className="font-medium text-gray-800">{selectedChild.weight} kg</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500">Height</span>
                  <p className="font-medium text-gray-800">{selectedChild.height} cm</p>
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs space-y-2.5">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block border-b border-gray-100 pb-1.5">
                  Nutritional Status
                </span>
                <div className="text-sm text-gray-700 flex items-center justify-between">
                  <span><strong>WFA:</strong> {selectedChild.wfa_status}</span>
                  <StatusBadge status={selectedChild.wfa_status} />
                </div>
                <div className="text-sm text-gray-700 flex items-center justify-between">
                  <span><strong>HFA:</strong> {selectedChild.hfa_status}</span>
                  <StatusBadge status={selectedChild.hfa_status} />
                </div>
                <div className="text-sm text-gray-700 flex items-center justify-between">
                  <span><strong>WFH/L:</strong> {selectedChild.wfhl_status}</span>
                  <StatusBadge status={selectedChild.wfhl_status} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
