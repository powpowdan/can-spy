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

// Green for Quebec 511
const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
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

const fetchQuebecCameras = async (layerGroup) => {
  try {
    const proxy = "https://api.allorigins.win/get?url=";
    //  removed the srsname parameter so the server responds instantly again
    const targetUrl = 'https://ws.mapserver.transports.gouv.qc.ca/swtq?service=wfs&version=2.0.0&request=getfeature&typename=ms:infos_cameras&outputformat=geojson';
    const url = encodeURIComponent(targetUrl);
    
    const response = await fetch(proxy + url);
    const wrapperData = await response.json(); 
    
    if (!wrapperData || !wrapperData.contents) return;

    let data;
    try {
      let rawText = wrapperData.contents;
      if (rawText.startsWith('data:')) {
        const base64String = rawText.split(',')[1];
        rawText = decodeURIComponent(escape(atob(base64String))); 
      }
      data = JSON.parse(rawText);
    } catch (parseError) {
      console.error("Parse error:", parseError);
      return;
    }
    
    if (!data || !data.features) return;

    console.log("✅ Successfully decoded Quebec data!");
    console.log(`📸 Found ${data.features.length} cameras from Quebec API.`);
    if (data.features.length > 0) {
       console.log("🔍 First camera data:", data.features[0]);
    } 

    data.features.forEach(feature => {
      if (feature.geometry && feature.geometry.coordinates) {
        
        // --- Convert Web Mercator (meters) to Lat/Lng (degrees) ---
        const x = feature.geometry.coordinates[0];
        const y = feature.geometry.coordinates[1];
        
        // Standard Spherical Mercator mathematical conversion
        const earthRadius = 6378137;
        const lng = (x / earthRadius) * (180 / Math.PI);
        const lat = (2 * Math.atan(Math.exp(y / earthRadius)) - (Math.PI / 2)) * (180 / Math.PI);
        // -------------------------------------------------------------------

        const marker = L.marker([lat, lng], { icon: greenIcon });
        
     const popupContent = `
          <div style="width: 300px;">
            <b style="font-size: 14px;">${feature.properties.DescriptionLocalisationEn || feature.properties.DescriptionLocalisationFr || 'Camera'}</b><br/>
             <div style="display: flex; align-items: center; gap: 5px; margin-top: 5px; margin-bottom: 10px;">
              <span class="pulsing-dot"></span>
              <span style="color: red; font-weight: bold;">LIVE</span>
              <span style="font-size: 11px; color: #666; margin-left: auto;">Updated: <span class="updated-timestamp">${new Date().toLocaleTimeString()}</span></span>
            </div>
            
            <div style="width: 100%; height: 160px; background-color: #222; border-radius: 4px; display: flex; flex-direction: column; align-items: center; justify-content: center; border: 1px solid #444;">
               <span style="font-size: 28px; margin-bottom: 8px;">🎥</span>
               <span style="color: #ccc; font-size: 11px; text-align: center; padding: 0 15px; margin-bottom: 12px;">
                 Feed secured by Québec 511
               </span>
               <a 
                 href="${feature.properties.URL_FLUX_DONNEE}" 
                 target="_blank" 
                 rel="noopener noreferrer" 
                 style="background-color: #28a745; color: white; padding: 8px 16px; border-radius: 4px; text-decoration: none; font-weight: bold; font-size: 12px; cursor: pointer;"
               >
                 View Live Stream ↗
               </a>
            </div>

          </div>
        `;
        marker.bindPopup(popupContent);
        layerGroup.addLayer(marker);
      }
    });
  } catch (error) {
    console.error("Network or fetch error with Quebec 511:", error);
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
      const quebecCameras = L.layerGroup().addTo(mapInstance.current);
      
      const overlayMaps = {
        "City of Ottawa": cityCameras,
        "MTO": mtoCameras,
        "Québec 511": quebecCameras
      };

      layerControlRef.current = L.control.layers(null, overlayMaps).addTo(mapInstance.current);

      fetchOttawaCameras(cityCameras);
      fetchMtoCameras(mtoCameras);
      fetchQuebecCameras(quebecCameras);
  
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