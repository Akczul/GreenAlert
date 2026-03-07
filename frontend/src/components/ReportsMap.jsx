import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const createIcon = (color) =>
  L.divIcon({
    className: '',
    html: `<div style="
      width:14px;height:14px;
      background:${color};
      border:2px solid rgba(255,255,255,0.8);
      border-radius:50%;
      box-shadow:0 0 6px ${color}99;
    "></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
    popupAnchor: [0, -10],
  });

const severityColors = {
  Alta:  '#f87171',
  Media: '#fb923c',
  Baja:  '#4ade80',
};

function FitBounds({ points }) {
  const map = useMap();
  if (points.length > 0) {
    const bounds = L.latLngBounds(points.map((p) => [p.lat, p.lng]));
    map.fitBounds(bounds, { padding: [40, 40] });
  }
  return null;
}

export default function ReportsMap({ reports = [] }) {
  return (
    <MapContainer
      center={[4.5709, -74.2973]}
      zoom={6}
      style={{ height: '100%', width: '100%', borderRadius: '0.75rem' }}
      className="z-0"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />

      <FitBounds points={reports} />

      {reports.map((r) => (
        <Marker
          key={r.id}
          position={[r.lat, r.lng]}
          icon={createIcon(severityColors[r.severity] || '#94a3b8')}
        >
          <Popup>
            <div className="text-sm">
              <p className="font-semibold text-gray-900">{r.title}</p>
              <p className="text-gray-500 mt-0.5">{r.type}</p>
              <p className="text-gray-400 text-xs mt-1">📍 {r.location}</p>
              <span
                style={{
                  display: 'inline-block',
                  marginTop: '6px',
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  fontSize: '11px',
                  fontWeight: 600,
                  background: r.severity === 'Alta' ? '#fee2e2' : r.severity === 'Media' ? '#ffedd5' : '#dcfce7',
                  color:      r.severity === 'Alta' ? '#dc2626' : r.severity === 'Media' ? '#ea580c' : '#16a34a',
                }}
              >
                {r.severity}
              </span>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
