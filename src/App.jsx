import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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
          <div style="width: 300px;">
            <b style="font-size: 14px;">${camera.description || camera.name}</b><br/>
            <iframe 
              src="https://traffic.ottawa.ca/map/cameraWindow?id=${camera.camera_number}" 
              width="100%" 
              height="230px" 
              style="border:none; margin-top: 10px;"
            ></iframe>
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