import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
 
import 'leaflet/dist/leaflet.css';

// 1. Import the actual image files from the leaflet package
import icon from 'leaflet/dist/images/marker-icon.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// 2. Create a fresh Default Icon object
let DefaultIcon = L.icon({
    iconUrl: icon,
    iconRetinaUrl: iconRetina,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41]
});

// 3. Set this as the global default for all markers
L.Marker.prototype.options.icon = DefaultIcon;

export default function App() {
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    if (mapInstance.current) {
      // Cleanup previous markers if any, though with the current structure it's not strictly necessary
    } else {
      // Initialize map
      mapInstance.current = L.map(mapContainer.current).setView([45.4215, -75.6972], 12);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstance.current);
    }

  const fetchCameras = async () => {
  try {
    const proxyUrl = "https://corsproxy.io/?";
    const targetUrl = "http://traffic.ottawa.ca/map/service/camera";
    
    const response = await fetch(proxyUrl + encodeURIComponent(targetUrl));
    const data = await response.json();

    // The "Safe Check": Some APIs return an array, others wrap it in an object
    const cameraList = Array.isArray(data) ? data : (data.cameras || []);

    if (cameraList.length === 0) {
      console.warn("No camera data found in response:", data);
      return;
    }

    cameraList
      .filter(camera => camera.type === 'camera' || camera.camera_number < 2000)
      .forEach(camera => {
        const marker = L.marker([camera.latitude, camera.longitude]).addTo(mapInstance.current);
        
        const popupContent = `
          <div style="width: 300px; min-height: 200px;">
            <b style="font-size: 14px;">${camera.description}</b><br/>
            <img 
              src="https://traffic.ottawa.ca/map/camera?id=${camera.camera_number}" 
              alt="Live Traffic Feed"
              style="width: 100%; border-radius: 4px; margin-top: 10px; display: block;"
              onerror="this.onerror=null; this.src='https://placehold.co/300x200?text=Camera+Offline';"
            />
            <p style="font-size: 11px; color: #666; margin-top: 5px;">
              Camera ID: ${camera.camera_number}
            </p>
          </div>
        `;
        marker.bindPopup(popupContent);
      });

  } catch (error) {
    console.error("Failed to fetch camera data:", error);
  }
};

    if (mapInstance.current) {
      fetchCameras();
    }

    return () => {
      if (mapInstance.current) {
        // Optional: clean up markers if the component unmounts
        // This logic would need to be more sophisticated if we re-fetch
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