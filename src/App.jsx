import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function App() {
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    // This prevents the map from loading twice and crashing
    if (mapInstance.current) return;

    // Create the map manually
    mapInstance.current = L.map(mapContainer.current).setView([45.4215, -75.6972], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(mapInstance.current);

    L.marker([45.4215, -75.6972]).addTo(mapInstance.current)
      .bindPopup('Ottawa Map: Stable Version')
      .openPopup();

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  return (
    <div 
      ref={mapContainer} 
      style={{ height: '100vh', width: '100vw' }} 
    />
  );
}