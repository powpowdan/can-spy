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
  const layerControlRef = useRef(null);

  useEffect(() => {
    if (!mapInstance.current) {
      // Initialize map
      mapInstance.current = L.map(mapContainer.current).setView([45.4215, -75.6972], 10);
      const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstance.current);

      // Initialize layer groups
      const cityCameras = L.layerGroup().addTo(mapInstance.current);
      const mtoCameras = L.layerGroup().addTo(mapInstance.current);
      
      const overlayMaps = {
        "City of Ottawa": cityCameras,
        "MTO": mtoCameras
      };

      layerControlRef.current = L.control.layers(null, overlayMaps).addTo(mapInstance.current);

      fetchOttawaCameras(cityCameras);
      fetchMtoCameras(mtoCameras);
    }

    return () => {
        if (mapInstance.current) {
            mapInstance.current.remove();
            mapInstance.current = null;
        }
    };
  }, []);

const fetchOttawaCameras = async (layerGroup) => {
  try {
    const proxyUrl = "https://corsproxy.io/?";
    // Using HTTPS here also avoids that 301 redirect error we saw earlier
    const targetUrl = "https://traffic.ottawa.ca/map/service/camera";
    
    const response = await fetch(proxyUrl + encodeURIComponent(targetUrl));
    const data = await response.json();

    const cameraList = Array.isArray(data) ? data : (data.cameras || []);

    if (cameraList.length === 0) return;

    cameraList
      .filter(camera => camera.type === 'camera' || camera.camera_number < 2000)
      .forEach(camera => {
        const marker = L.marker([camera.latitude, camera.longitude]);
        
        // SWITCH FROM IFRAME TO IMG TAG
        const popupContent = `
          <div style="width: 300px;">
            <b style="font-size: 14px;">${camera.description || camera.name}</b><br/>
            <img 
              src="https://traffic.ottawa.ca/map/camera?id=${camera.camera_number}" 
              alt="Live Feed"
              style="width: 100%; border-radius: 4px; margin-top: 10px; display: block;"
              onerror="this.onerror=null; this.src='https://placehold.co/300x200?text=City+Camera+Offline';"
            />
          </div>
        `;
        
        marker.bindPopup(popupContent);
        layerGroup.addLayer(marker);
      });

  } catch (error) {
    console.error("Failed to fetch camera data:", error);
  }
};

  const fetchMtoCameras = async (layerGroup) => {
    try {
      const proxy = "https://corsproxy.io/?";
      const url = encodeURIComponent('https://511on.ca/api/v2/get/cameras');
      
      const response = await fetch(proxy + url);
      const cameras = await response.json();
      
      cameras.forEach(camera => {
        if (camera.Latitude && camera.Longitude && camera.Views?.length > 0) {
          const marker = L.marker([camera.Latitude, camera.Longitude]);
          const popupContent = `
            <div style="width: 300px;">
              <b style="font-size: 14px;">${camera.Location}</b><br/>
              <img 
                src="${camera.Views[0].Url}" 
                style="width: 100%; border-radius: 4px; margin-top: 10px;"
                onerror="this.src='https://placehold.co/300x200?text=Highway+Cam+Offline';"
              />
              <p style="font-size: 11px; color: #666;">Roadway: ${camera.Roadway}</p>
            </div>
          `;
          marker.bindPopup(popupContent);
          layerGroup.addLayer(marker);
        }
      });
    } catch (error) {
      console.error("Failed to fetch MTO data:", error);
    }
  };

  return (
    <div 
      ref={mapContainer} 
      style={{ height: '100vh', width: '100vw' }} 
    />
  );
}