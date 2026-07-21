import { useState, useEffect } from 'react';
import { api } from '../services/api';
import HeaderHealthReport from '../components/W2D2/HeaderHealthReport';
import TableHealthReport from '../components/W2D2/TableHealthReport';

export default function HealthReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBarangay, setSelectedBarangay] = useState('All Barangays');

  useEffect(() => {
    setLoading(true);
    api.reports.health()
      .then(res => {
        let data = res.data || [];
        if (selectedBarangay !== 'All Barangays') {
          data = data.filter(r => r.barangay === selectedBarangay);
        }
        setReports(data);
      })
      .catch(err => console.error('Failed to fetch health reports:', err))
      .finally(() => setLoading(false));
  }, [selectedBarangay]);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Health Reports</h1>
        <p className="text-sm text-gray-500 mt-1">Nutritional status reports by barangay</p>
      </div>
      <HeaderHealthReport
        selectedBarangay={selectedBarangay}
        setSelectedBarangay={setSelectedBarangay}
      />
      {loading ? (
        <p className="text-center text-gray-500 py-8">Loading...</p>
      ) : (
        <TableHealthReport reports={reports} />
      )}
    </div>
  );
}
