import { useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const pickerIcon = L.divIcon({
  className: '',
  html: `<div style="
    width:18px;height:18px;
    background:#22c55e;
    border:3px solid white;
    border-radius:50%;
    box-shadow:0 0 10px #22c55e88;
  "></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

// Sub-componente que escucha clics en el mapa
function ClickHandler({ onPick }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng);
    },
  });
  return null;
}

export default function LocationPicker({ latitud, longitud, onChange }) {
  const [position, setPosition] = useState(() => {
    const lat = parseFloat(latitud);
    const lng = parseFloat(longitud);
    return !isNaN(lat) && !isNaN(lng) ? { lat, lng } : null;
  });

  const handlePick = useCallback(
    (latlng) => {
      setPosition(latlng);
      onChange(latlng.lat, latlng.lng);
    },
    [onChange]
  );

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs text-gray-500">
        {position
          ? `Seleccionado: ${position.lat.toFixed(5)}, ${position.lng.toFixed(5)}`
          : 'Haz clic en el mapa para fijar la ubicación exacta'}
      </p>
      <div style={{ height: '220px', borderRadius: '0.75rem', overflow: 'hidden' }}>
        <MapContainer
          center={[4.5709, -74.2973]}
          zoom={6}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          <ClickHandler onPick={handlePick} />
          {position && <Marker position={position} icon={pickerIcon} />}
        </MapContainer>
      </div>
    </div>
  );
}
