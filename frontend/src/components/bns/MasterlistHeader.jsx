export function MasterlistHeader({ onSearch, onPurokChange, onAddNewChild }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Children Masterlist</h1>
        <p className="text-sm text-gray-500 mt-1">Manage registered children in your barangay</p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="search"
          placeholder="Search child name..."
          onChange={(e) => onSearch(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
        />
        <select
          onChange={(e) => onPurokChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
        >
          <option value="">All Purok</option>
          <option value="Purok 1">Purok 1</option>
          <option value="Purok 2">Purok 2</option>
          <option value="Purok 3">Purok 3</option>
          <option value="Purok 4">Purok 4</option>
        </select>
        <button
          onClick={onAddNewChild}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
        >
          + Add New Child
        </button>
      </div>
    </div>
  );
}
