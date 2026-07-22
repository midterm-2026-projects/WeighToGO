export function MasterlistTable({ records, onManageChild }) {
  return (
    <div className="flex-1 min-h-0 flex flex-col bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="flex-1 min-h-0 overflow-x-auto hide-scrollbar">
        <table className="w-full divide-y divide-gray-200 text-xs">
          <thead className="bg-gray-50 text-gray-700 uppercase tracking-wider sticky top-0">
            <tr>
              <th className="px-4 py-3 font-semibold text-left">Child Name</th>
              <th className="px-4 py-3 font-semibold text-left">Parent</th>
              <th className="px-4 py-3 font-semibold text-left">Gender</th>
              <th className="px-4 py-3 font-semibold text-center">Age (mos)</th>
              <th className="px-4 py-3 font-semibold text-left">Purok</th>
              <th className="px-4 py-3 font-semibold text-center">Checkup Status</th>
              <th className="px-4 py-3 font-semibold text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {records && records.length > 0 ? (
              records.map((child) => (
                <tr key={child.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-bold text-gray-800 uppercase text-left truncate max-w-[180px]">{child.name}</td>
                  <td className="px-4 py-3 font-medium text-gray-600 uppercase text-left truncate max-w-[160px]">{child.parent_name}</td>
                  <td className="px-4 py-3 text-left">{child.gender}</td>
                  <td className="px-4 py-3 text-center">{child.age_months}</td>
                  <td className="px-4 py-3 text-left">{child.purok}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block px-2.5 py-1 text-xs font-bold border rounded-full ${
                      child.checkup_status === 'Checked Up'
                        ? 'bg-green-100 text-green-700 border-green-200'
                        : 'bg-amber-100 text-amber-700 border-amber-200'
                    }`}>
                      {child.checkup_status === 'Checked Up' ? 'Checked Up' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => onManageChild(child)}
                      className="bg-emerald-600 text-white font-medium text-xs px-3 py-1.5 rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-4 py-12 text-center font-medium text-gray-400 bg-gray-50/50">
                  No matching child records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
