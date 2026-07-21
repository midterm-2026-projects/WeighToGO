export default function HeaderHealthReport({ selectedBarangay, setSelectedBarangay, barangays = [] }) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-sm text-gray-500 mt-1">Operation Timbang (OPT) Summary matrix. Filter by Barangay to view Purok breakdown.</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedBarangay}
            onChange={(e) => setSelectedBarangay(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
          >
            {barangays.map(b => (
              <option key={b.value} value={b.value}>{b.label}</option>
            ))}
          </select>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
          >
            Print Report
          </button>
        </div>
      </div>
    </div>
  );
}
