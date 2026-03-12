import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Red for Ottawa City
const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Blue for MTO/Highway
const blueIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
 
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
        const marker = L.marker([camera.latitude, camera.longitude], { icon: redIcon });
        
        // SWITCH FROM IFRAME TO IMG TAG
        const popupContent = `
          <div style="width: 300px;">
            <b style="font-size: 14px;">${camera.description || camera.name}</b><br/>
            <div style="display: flex; align-items: center; gap: 5px; margin-top: 5px;">
              <span class="pulsing-dot"></span>
              <span style="color: red; font-weight: bold;">LIVE</span>
              <span style="font-size: 11px; color: #666; margin-left: auto;">Updated: <span class="updated-timestamp">${new Date().toLocaleTimeString()}</span></span>
            </div>
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
        const marker = L.marker([camera.Latitude, camera.Longitude], { icon: blueIcon });
        const popupContent = `
          <div style="width: 300px;">
            <b style="font-size: 14px;">${camera.Location}</b><br/>
             <div style="display: flex; align-items: center; gap: 5px; margin-top: 5px;">
              <span class="pulsing-dot"></span>
              <span style="color: red; font-weight: bold;">LIVE</span>
              <span style="font-size: 11px; color: #666; margin-left: auto;">Updated: <span class="updated-timestamp">${new Date().toLocaleTimeString()}</span></span>
            </div>
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

export default function App() {
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);
  const layerControlRef = useRef(null);
  const refreshIntervalIdRef = useRef(null);
  const activePopupRef = useRef(null);

  useEffect(() => {
    if (!mapInstance.current) {
      // Initialize map
      mapInstance.current = L.map(mapContainer.current).setView([45.4215, -75.6972], 10);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
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
  
      mapInstance.current.on('popupopen', (e) => {
        activePopupRef.current = e.popup;
        const popupElement = activePopupRef.current.getElement();
        if (!popupElement) return;

        const img = popupElement.querySelector('img');
        const timestampSpan = popupElement.querySelector('.updated-timestamp');

        if (img) {
          refreshIntervalIdRef.current = setInterval(() => {
            if (!activePopupRef.current) {
              clearInterval(refreshIntervalIdRef.current);
              return;
            }
            const newSrc = img.src.split('&t=')[0] + '&t=' + Date.now();
            img.src = newSrc;
            if (timestampSpan) {
              timestampSpan.innerText = new Date().toLocaleTimeString();
            }
          }, 15000);
        }
      });

      mapInstance.current.on('popupclose', () => {
        if (refreshIntervalIdRef.current) {
          clearInterval(refreshIntervalIdRef.current);
          refreshIntervalIdRef.current = null;
        }
        activePopupRef.current = null;
      });
    }

    return () => {
        if (refreshIntervalIdRef.current) {
            clearInterval(refreshIntervalIdRef.current);
        }
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