import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { MonthlyReportHeader } from '../components/bns/MonthlyReportHeader';
import { MonthlyReportTable } from '../components/bns/MonthlyReportTable';

export default function MonthlyReportPage() {
  const [report, setReport] = useState({ summary: { totalRegistered: 0, normal: 0, stunted: 0, obese: 0 }, records: [] });
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(new Date().toLocaleString('en-US', { month: 'short' }));
  const [year, setYear] = useState(new Date().getFullYear());

  const fetchReport = async (m, y) => {
    setLoading(true);
    try {
      const res = await api.reports.monthly(m, y);
      setReport(res.data || { summary: { totalRegistered: 0, normal: 0, stunted: 0, obese: 0 }, records: [] });
    } catch (err) {
      console.error('Failed to fetch report:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReport(month, year); }, [month, year]);

  return (
    <div className="p-6">
      <MonthlyReportHeader
        summary={report.summary}
        month={month}
        year={year}
        onMonthChange={setMonth}
        onYearChange={setYear}
      />
      {loading ? (
        <p className="text-center text-gray-500 py-8">Loading...</p>
      ) : (
        <div className="mt-6">
          <MonthlyReportTable records={report.records} />
        </div>
      )}
    </div>
  );
}
