import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Fix Leaflet default icon issue
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl,
  shadowUrl: iconShadow,
});

L.Marker.prototype.options.icon = DefaultIcon;

const VenueMap = ({ venues }) => {
  if (!venues.length) return null;

  // Hardcoded geolocation for demo (replace with real API or embed)
  const locationMap = {
    "MG Road, Delhi": [28.6448, 77.216721],
    "Bandra, Mumbai": [19.0606, 72.8365],
    "Koramangala, Bangalore": [12.9352, 77.6245],
  };

  const center = locationMap[venues[0].address] || [20.5937, 78.9629]; // Default: center of India

  return (
    <div className="w-full h-[500px] mt-10 rounded-lg overflow-hidden shadow">
      <MapContainer center={center} zoom={5} className="w-full h-full z-10">
        <TileLayer
          attribution='© OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {venues.map((venue, index) => {
          const coords = locationMap[venue.address] || [20.5937, 78.9629]; // fallback
          return (
            <Marker key={index} position={coords}>
              <Popup>
                <strong>{venue.name}</strong><br />
                {venue.address}<br />
                ₹{venue.price_per_head}/head<br />
                Capacity: {venue.capacity}
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default VenueMap;
