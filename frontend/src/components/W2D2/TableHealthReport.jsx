export default function TableHealthReport({ reports = [] }) {
  const rows = reports.length > 0 ? reports : [
    { barangay: "Brgy. Caloocan", totalRegistered: 40, normal: 31, underweight: 3, stunted: 3, wasted: 2, obese: 6 },
    { barangay: "Brgy. Lanatan", totalRegistered: 40, normal: 34, underweight: 2, stunted: 2, wasted: 2, obese: 4 }
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm text-center">
          <thead>
            <tr className="bg-gray-50 text-gray-700 uppercase tracking-wider text-xs">
              <th rowSpan="2" className="px-4 py-3 font-semibold border-r border-gray-200">Barangay</th>
              <th rowSpan="2" className="px-4 py-3 font-semibold border-r border-gray-200">Total Registered</th>
              <th colSpan="4" className="px-4 py-3 font-semibold bg-emerald-50 text-emerald-700 border-r border-gray-200">Weight-for-Age (WFA)</th>
              <th colSpan="4" className="px-4 py-3 font-semibold bg-amber-50 text-amber-700 border-r border-gray-200">Height-for-Age (HFA)</th>
              <th colSpan="4" className="px-4 py-3 font-semibold bg-rose-50 text-rose-700">Weight-for-Length/Height (WFH/L)</th>
            </tr>
            <tr className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
              <th className="px-3 py-2 font-medium">Normal</th>
              <th className="px-3 py-2 font-medium">UW</th>
              <th className="px-3 py-2 font-medium">SUW</th>
              <th className="px-3 py-2 font-medium border-r border-gray-200">OW</th>
              <th className="px-3 py-2 font-medium">Normal</th>
              <th className="px-3 py-2 font-medium">ST</th>
              <th className="px-3 py-2 font-medium">SST</th>
              <th className="px-3 py-2 font-medium border-r border-gray-200">T</th>
              <th className="px-3 py-2 font-medium">Normal</th>
              <th className="px-3 py-2 font-medium">MW</th>
              <th className="px-3 py-2 font-medium">SW</th>
              <th className="px-3 py-2 font-medium">OB</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {rows.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-800 border-r border-gray-200">{row.barangay || row.name}</td>
                <td className="px-4 py-3 font-bold text-emerald-700 border-r border-gray-200">{row.totalRegistered || row.total}</td>
                <td className="px-3 py-3">{row.normal || 0}</td>
                <td className="px-3 py-3">{row.underweight || row.uw || 0}</td>
                <td className="px-3 py-3">{row.suw || 0}</td>
                <td className="px-3 py-3 border-r border-gray-200">{row.ow || 0}</td>
                <td className="px-3 py-3">{row.normal || 0}</td>
                <td className="px-3 py-3">{row.stunted || row.st || 0}</td>
                <td className="px-3 py-3">{row.sst || 0}</td>
                <td className="px-3 py-3 border-r border-gray-200">{row.t || 0}</td>
                <td className="px-3 py-3">{row.normal || 0}</td>
                <td className="px-3 py-3">{row.wasted || row.mw || 0}</td>
                <td className="px-3 py-3">{row.sw || 0}</td>
                <td className="px-3 py-3">{row.obese || row.ob || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
