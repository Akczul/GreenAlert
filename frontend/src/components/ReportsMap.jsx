import { useEffect } from 'react';
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
  critico: '#fb7185',
  alto:    '#ef4444',
  medio:   '#fb923c',
  bajo:    '#4ade80',
};

const severityLabel = { bajo: 'Baja', medio: 'Media', alto: 'Alta', critico: 'Crítico' };

const typeLabel = {
  agua: 'Agua', aire: 'Aire', suelo: 'Suelo', ruido: 'Ruido',
  residuos: 'Residuos', luminica: 'Lumínica', otro: 'Otro',
};

function FitBounds({ points }) {
  const map = useMap();
  useEffect(() => {
    if (points.length > 0) {
      const bounds = L.latLngBounds(points.map((p) => [parseFloat(p.latitud), parseFloat(p.longitud)]));
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 14 });
    }
  }, [points, map]);
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

      <FitBounds points={reports.filter(r => r.latitud && r.longitud)} />

      {reports
        .filter((r) => r.latitud && r.longitud)
        .map((r) => (
        <Marker
          key={r.id_reporte}
          position={[parseFloat(r.latitud), parseFloat(r.longitud)]}
          icon={createIcon(severityColors[r.nivel_severidad] || '#94a3b8')}
        >
          <Popup>
            <div className="text-sm">
              <p className="font-semibold text-gray-900">{r.titulo}</p>
              <p className="text-gray-500 mt-0.5">{typeLabel[r.tipo_contaminacion] ?? r.tipo_contaminacion}</p>
              <p className="text-gray-400 text-xs mt-1">
                {[r.municipio, r.departamento].filter(Boolean).join(', ') || r.direccion}
              </p>
              <span
                style={{
                  display: 'inline-block',
                  marginTop: '6px',
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  fontSize: '11px',
                  fontWeight: 600,
                  background: r.nivel_severidad === 'critico' ? '#4c0519' :
                              r.nivel_severidad === 'alto'    ? '#fee2e2' :
                              r.nivel_severidad === 'medio'   ? '#ffedd5' : '#dcfce7',
                  color:      r.nivel_severidad === 'critico' ? '#fda4af' :
                              r.nivel_severidad === 'alto'    ? '#dc2626' :
                              r.nivel_severidad === 'medio'   ? '#ea580c' : '#16a34a',
                }}
              >
                {severityLabel[r.nivel_severidad] ?? r.nivel_severidad}
              </span>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
