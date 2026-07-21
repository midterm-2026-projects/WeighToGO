export function MasterlistTable({ records, onManageChild }) {
  const statusColor = (status) => {
    if (status === 'Normal') return 'bg-green-100 text-green-700 border-green-200';
    return 'bg-amber-100 text-amber-700 border-amber-200';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
          <thead className="bg-gray-50 text-gray-700 uppercase tracking-wider text-xs">
            <tr>
              <th className="px-4 py-3 font-semibold">Child Name</th>
              <th className="px-4 py-3 font-semibold">Parent / Guardian</th>
              <th className="px-4 py-3 font-semibold">Gender</th>
              <th className="px-4 py-3 font-semibold text-center">Age (mos)</th>
              <th className="px-4 py-3 font-semibold">Purok</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {records && records.length > 0 ? (
              records.map((child) => (
                <tr key={child.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-bold text-gray-800 uppercase text-xs">{child.name}</td>
                  <td className="px-4 py-3 font-medium text-gray-600 uppercase text-xs">{child.parent_name}</td>
                  <td className="px-4 py-3 text-xs">{child.gender}</td>
                  <td className="px-4 py-3 text-center">{child.age_months}</td>
                  <td className="px-4 py-3 text-xs">{child.purok}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 text-xs font-bold border rounded-full ${statusColor(child.classification)}`}>
                      {child.classification}
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
