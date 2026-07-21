export default function HeaderHealthReport({ selectedBarangay, setSelectedBarangay }) {
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
            <option value="All Barangays">All Barangays</option>
            <option value="Brgy. Caloocan">Brgy. Caloocan</option>
            <option value="Brgy. Lanatan">Brgy. Lanatan</option>
            <option value="Brgy. Dilao">Brgy. Dilao</option>
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
