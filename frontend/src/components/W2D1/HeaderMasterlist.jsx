const BARANGAY_OPTIONS = [
  "Brgy. Caloocan", "Brgy. Lanatan", "Brgy. Uno", "Brgy. Ermita", 
  "Brgy. Gumamela", "Brgy. Navotas", "Brgy. Palikpikan", "Brgy. Sampaga", 
  "Brgy. Santol", "Brgy. Dilao", "Brgy. Dalig", "Brgy. Langgangan", 
  "Brgy. Canda", "Brgy. Pooc", "Brgy. Tanggoy"
];

const AGE_OPTIONS = ["0-11 Months", "12-23 Months", "24-59 Months"];
const STATUS_OPTIONS = ["Normal", "Malnourished", "Obese"];

export default function HeaderMasterlist({
  selectedBarangay,
  setSelectedBarangay,
  selectedAgeGroup,
  setSelectedAgeGroup,
  selectedStatus,
  setSelectedStatus,
  totalCount
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-emerald-950">Barangay Masterlist</h1>
          <p className="text-sm text-gray-500 mt-0.5">Detailed list of children, dimensions, and statuses.</p>
        </div>

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

      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex items-center justify-between border-l-4 border-l-blue-500">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-gray-400 tracking-wider uppercase">Total Registered</span>
          <div className="text-3xl font-extrabold text-blue-600">{totalCount}</div>
          <span className="text-xs text-gray-500 block">Filtered child masterlist view</span>
        </div>
        <div className="p-3 bg-blue-50 rounded-xl text-blue-500">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
      </div>
    </div>
  );
}