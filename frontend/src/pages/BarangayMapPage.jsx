import { useState, useEffect } from 'react';
import { api } from '../services/api';
import BarangayMap from '../components/dashboard/barangayMap';

export default function BarangayMapPage() {
  const [mapData, setMapData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.analytics.map()
      .then(res => setMapData(res.data || []))
      .catch(() => setMapData([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Barangay Map</h1>
        <p className="text-sm text-gray-500 mt-1">Interactive map showing nutritional risk levels by barangay</p>
      </div>
      {loading ? (
        <p className="text-center text-gray-500 py-8">Loading map data...</p>
      ) : (
        <BarangayMap initialData={mapData} />
      )}
    </div>
  );
}
