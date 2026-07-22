import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import MapSidePanel from './mapSidePanel';
import { api } from '../../services/api';

const DEFAULT_CENTER = [13.9475, 120.7370];
const DEFAULT_ZOOM = 14;

function createColoredIcon(color, name) {
  const shortName = name.replace('Brgy. ', '').replace('Barangay ', 'Bgy. ');
  return L.divIcon({
    className: 'custom-marker-icon',
    html: `<div style="display:flex;flex-direction:column;align-items:center;">
      <div style="width:16px;height:16px;background:${color};border:2px solid white;border-radius:50%;box-shadow:0 1px 4px rgba(0,0,0,0.35);"></div>
      <span style="margin-top:2px;font-size:10px;font-weight:600;color:#1f2937;background:rgba(255,255,255,0.85);padding:1px 4px;border-radius:3px;white-space:nowrap;box-shadow:0 1px 2px rgba(0,0,0,0.15);line-height:1.3;">${shortName}</span>
    </div>`,
    iconSize: [80, 36],
    iconAnchor: [40, 36],
    popupAnchor: [0, -20]
  });
}

function FitBounds({ data }) {
  const map = useMap();
  const fitted = useRef(false);
  useEffect(() => {
    if (data.length > 0 && !fitted.current) {
      const bounds = L.latLngBounds(data.map(d => [Number(d.coordinates.lat), Number(d.coordinates.lng)]));
      map.fitBounds(bounds, { padding: [50, 50] });
      fitted.current = true;
    }
  }, [data, map]);
  return null;
}

export default function BarangayMap({ initialData }) {
  const [mapData, setMapData] = useState(initialData || []);
  const [selectedBarangay, setSelectedBarangay] = useState(null);

  useEffect(() => {
    if (initialData && initialData.length > 0) {
      setMapData(initialData);
    } else {
      api.analytics.map()
        .then(res => setMapData(res.data || []))
        .catch(() => setMapData([]));
    }
  }, [initialData]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Interactive Barangay Map</h2>
          <p className="text-sm text-gray-500">Balayan Nutritional Risk Distribution</p>
        </div>
        <div className="flex gap-4 mt-4 sm:mt-0">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#22c55e' }}></span>
            <span className="text-xs text-gray-600">Low Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#eab308' }}></span>
            <span className="text-xs text-gray-600">Moderate</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#ef4444' }}></span>
            <span className="text-xs text-gray-600">High Risk</span>
          </div>
        </div>
      </div>

      <div className="relative w-full h-[500px] rounded-lg overflow-hidden">
        <MapContainer
          center={DEFAULT_CENTER}
          zoom={DEFAULT_ZOOM}
          className="w-full h-full"
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <FitBounds data={mapData} />
          {mapData.map((barangay) => {
            const lat = Number(barangay.coordinates.lat);
            const lng = Number(barangay.coordinates.lng);
            if (!lat || !lng) return null;
            const markerColor = barangay.color || '#22c55e';
            const riskLabel = barangay.riskLevel || 'Low Risk';
            return (
              <Marker
                key={barangay.id}
                position={[lat, lng]}
                icon={createColoredIcon(markerColor, barangay.name)}
                eventHandlers={{
                  click: () => setSelectedBarangay(barangay)
                }}
              >
                <Popup>
                  <div className="text-center min-w-[140px]">
                    <h3 className="font-semibold text-sm">{barangay.name}</h3>
                    <div className="text-xs text-gray-500 mt-1">
                      Cases: <span className="font-bold text-gray-800">{barangay.cases}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Registered: <span className="font-bold text-gray-800">{barangay.registeredChildren}</span>
                    </div>
                    <div className="mt-1">
                      <span className="text-xs font-medium" style={{ color: markerColor }}>
                        {riskLabel}
                      </span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        <MapSidePanel
          barangay={selectedBarangay}
          onClose={() => setSelectedBarangay(null)}
        />
      </div>
    </div>
  );
}