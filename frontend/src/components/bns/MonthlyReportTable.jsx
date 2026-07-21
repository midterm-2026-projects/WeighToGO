export function MonthlyReportTable({ records = [] }) {
  const data = records.length > 0 ? records : [
    { child_name: "GOMEZ, JAMES ANDREI", parent_name: "BAUTISTA, ANGELIQUE", barangay: "Brgy. Navotas", gender: "Male", birthdate: "2026-01-01", age_months: 6, weight: 7.5, height: 65.0, wfa_status: "Normal", hfa_status: "Normal", wfhl_status: "Normal" },
    { child_name: "CASTROMERO, RAYVIN", parent_name: "CASTROMERO, RICHARD", barangay: "Brgy. Navotas", gender: "Male", birthdate: "2025-07-01", age_months: 12, weight: 9.2, height: 72.0, wfa_status: "Normal", hfa_status: "Normal", wfhl_status: "Normal" },
  ];

  const statusColor = (status) => {
    if (status === 'Normal') return 'bg-green-100 text-green-700 border-green-200';
    if (status === 'Overweight' || status === 'Obese') return 'bg-amber-100 text-amber-700 border-amber-200';
    return 'bg-red-100 text-red-700 border-red-200';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
          <thead className="bg-gray-50 text-gray-700 uppercase tracking-wider text-xs">
            <tr>
              <th className="px-4 py-3 font-semibold">Caregiver</th>
              <th className="px-4 py-3 font-semibold">Child Name</th>
              <th className="px-4 py-3 font-semibold">Barangay</th>
              <th className="px-4 py-3 font-semibold">Sex</th>
              <th className="px-4 py-3 font-semibold">Birthdate</th>
              <th className="px-4 py-3 font-semibold text-center">Age (mos)</th>
              <th className="px-4 py-3 font-semibold text-center">Weight (kg)</th>
              <th className="px-4 py-3 font-semibold text-center">Height (cm)</th>
              <th className="px-4 py-3 font-semibold text-center">WFA</th>
              <th className="px-4 py-3 font-semibold text-center">HFA</th>
              <th className="px-4 py-3 font-semibold text-center">WFH/L</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-600 uppercase text-xs">{row.parent_name}</td>
                <td className="px-4 py-3 font-bold text-gray-800 uppercase text-xs">{row.child_name}</td>
                <td className="px-4 py-3 text-xs">{row.barangay}</td>
                <td className="px-4 py-3 text-xs">{row.gender}</td>
                <td className="px-4 py-3 text-xs">{row.birthdate}</td>
                <td className="px-4 py-3 text-center">{row.age_months}</td>
                <td className="px-4 py-3 text-center font-bold">{row.weight}</td>
                <td className="px-4 py-3 text-center font-bold">{row.height}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-block px-2 py-0.5 text-xs font-bold border rounded-full ${statusColor(row.wfa_status)}`}>
                    {row.wfa_status === 'Normal' ? 'N' : row.wfa_status === 'Overweight' ? 'OW' : row.wfa_status === 'Obese' ? 'OB' : row.wfa_status === 'Underweight' ? 'UW' : 'SUW'}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-block px-2 py-0.5 text-xs font-bold border rounded-full ${statusColor(row.hfa_status)}`}>
                    {row.hfa_status === 'Normal' ? 'N' : row.hfa_status === 'Stunted' ? 'ST' : 'SST'}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-block px-2 py-0.5 text-xs font-bold border rounded-full ${statusColor(row.wfhl_status)}`}>
                    {row.wfhl_status === 'Normal' ? 'N' : row.wfhl_status === 'Wasted' ? 'MW' : row.wfhl_status === 'Overweight' ? 'OW' : row.wfhl_status === 'Obese' ? 'OB' : 'SW'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
