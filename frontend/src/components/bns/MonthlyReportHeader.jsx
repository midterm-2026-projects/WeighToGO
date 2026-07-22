export function MonthlyReportHeader({
  summary = { totalRegistered: 0, normal: 0, stunted: 0, obese: 0 },
  month,
  year,
  onMonthChange,
  onYearChange,
}) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  const kpiCards = [
    { label: 'Total Assessed', value: summary.totalRegistered, bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    { label: 'Normal', value: summary.normal, bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
    { label: 'Stunted', value: summary.stunted, bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    { label: 'Obese', value: summary.obese, bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Monthly Barangay Report</h1>
          <p className="text-sm text-gray-500 mt-1">Summary of nutritional cases for the selected month.</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={month}
            onChange={(e) => onMonthChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
          >
            {months.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <select
            value={year}
            onChange={(e) => onYearChange(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
          >
            {years.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map(card => (
          <div key={card.label} className={`${card.bg} ${card.border} border rounded-xl p-5 hover:shadow-md transition-shadow`}>
            <p className="text-sm font-medium text-gray-600">{card.label}</p>
            <p className={`text-3xl font-bold ${card.text} mt-2`}>{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
