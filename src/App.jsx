import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';

import quebecMockData from './quebecMockData.json';
import torontoData from './torontoMockData.json';
import wildlifeData from './wildlifeData.json';

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
// Green for Toronto
const purpleIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const wildlifeIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const fetchWildlifeCameras = (layerGroup) => {
  wildlifeData.features.forEach(feature => {
    const [lng, lat] = feature.geometry.coordinates;
    const { name, location, youtubeId } = feature.properties;

    const marker = L.marker([lat, lng], { icon: wildlifeIcon });

    // We add live=1 to force the live edge
    // and t= timestamp to prevent caching issues
    const liveUrl = `https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&live=1&modestbranding=1&rel=0&t=${new Date().getTime()}`;

    const popupContent = `
      <div style="width: 320px;">
        <b style="font-size: 14px;">🌿 ${name}</b><br/>
        <i style="font-size: 11px; color: #666;">${location}</i>
        <div style="margin-top: 10px; position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 4px; background: #000;">
          <iframe 
            src="${liveUrl}" 
            style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen>
          </iframe>
        </div>
        <div style="font-size: 10px; color: #999; margin-top: 8px; text-align: center;">
          Note: If video appears delayed, click the "LIVE" button in the player.
        </div>
      </div>
    `;

    marker.bindPopup(popupContent, { maxWidth: 350 });
    layerGroup.addLayer(marker);
  });
};

const fetchTorontoCameras = (layerGroup) => {
  const cameras = torontoData.Data || [];

  cameras.forEach(cam => {
    const lat = parseFloat(cam.Latitude);
    const lng = parseFloat(cam.Longitude);
    const camNumber = cam.Number;
    const camName = cam.Name;

    if (!isNaN(lat) && !isNaN(lng) && camNumber) {
      const marker = L.marker([lat, lng], { icon: purpleIcon });
      
     marker.bindPopup((layer) => {
  const camNumber = cam.Number;
  const camName = cam.Name;
  const popupId = `popup-${camNumber}`;

  // We use a small script that runs as soon as the popup is added to the map
  setTimeout(() => {
    const interval = setInterval(() => {
      const img = document.getElementById(`img-${popupId}`);
      const timeSpan = document.getElementById(`time-${popupId}`);
      
      if (img) {
        // Update the image source with a new timestamp to force a refresh
        img.src = `https://opendata.toronto.ca/transportation/tmc/rescucameraimages/CameraImages/loc${camNumber}.jpg?t=${new Date().getTime()}`;
        if (timeSpan) timeSpan.innerText = new Date().toLocaleTimeString();
      } else {
        // If the user closed the popup, the image is gone, so stop the timer
        clearInterval(interval);
      }
    }, 15000); // Refresh every 15 seconds
  }, 100);

  return `
    <div style="width: 300px;">
      <b style="font-size: 14px;">${camName}</b><br/>
       <div style="display: flex; align-items: center; gap: 5px; margin-top: 5px; margin-bottom: 10px;">
        <span class="pulsing-dot"></span>
        <span style="color: red; font-weight: bold;">LIVE</span>
        <span style="font-size: 11px; color: #666; margin-left: auto;">
          <b id="time-${popupId}">${new Date().toLocaleTimeString()}</b>
        </span>
      </div>
      <img 
        id="img-${popupId}"
        src="https://opendata.toronto.ca/transportation/tmc/rescucameraimages/CameraImages/loc${camNumber}.jpg?t=${new Date().getTime()}" 
        style="width: 100%; border-radius: 4px;"
        onerror="this.src='https://placehold.co/300x200?text=Toronto+Feed+Offline';"
      />
    </div>
  `;
});

      layerGroup.addLayer(marker);
    }
  });
};
const fetchOttawaCameras = async (layerGroup) => {
  try {
    const proxyUrl = "https://corsproxy.io/?";
    const targetUrl = "https://traffic.ottawa.ca/map/service/camera";
    
    const response = await fetch(proxyUrl + encodeURIComponent(targetUrl));
    const data = await response.json();

    const cameraList = Array.isArray(data) ? data : (data.cameras || []);
    if (cameraList.length === 0) return;

    cameraList
      .filter(camera => camera.type === 'camera' || camera.camera_number < 2000)
      .forEach(camera => {
        const marker = L.marker([camera.latitude, camera.longitude], { icon: redIcon });
        
        // Create a unique ID for this specific Ottawa camera
        const camId = camera.camera_number;
        const popupId = `ottawa-${camId}`;
        const baseImageUrl = `https://traffic.ottawa.ca/map/camera?id=${camId}`;

        // DYNAMIC POPUP LOGIC
        marker.bindPopup((layer) => {
          // Start the 15s refresh timer while the popup is open
          setTimeout(() => {
            const interval = setInterval(() => {
              const img = document.getElementById(`img-${popupId}`);
              const timeSpan = document.getElementById(`time-${popupId}`);
              
              if (img) {
                // Force refresh with a timestamp
                img.src = `${baseImageUrl}&t=${new Date().getTime()}`;
                if (timeSpan) timeSpan.innerText = new Date().toLocaleTimeString();
              } else {
                // Stop the timer when the popup is closed
                clearInterval(interval);
              }
            }, 15000);
          }, 100);

          return `
            <div style="width: 300px;">
              <b style="font-size: 14px;">${camera.description || camera.name}</b><br/>
              <div style="display: flex; align-items: center; gap: 5px; margin-top: 5px;">
                <span class="pulsing-dot"></span>
                <span style="color: red; font-weight: bold;">LIVE</span>
                <span style="font-size: 11px; color: #666; margin-left: auto;">
                  Updated: <b id="time-${popupId}">${new Date().toLocaleTimeString()}</b>
                </span>
              </div>
              <img 
                id="img-${popupId}"
                src="${baseImageUrl}&t=${new Date().getTime()}" 
                alt="Live Feed"
                style="width: 100%; border-radius: 4px; margin-top: 10px; display: block;"
                onerror="this.onerror=null; this.src='https://placehold.co/300x200?text=City+Camera+Offline';"
              />
            </div>
          `;
        });
        
        layerGroup.addLayer(marker);
      });

  } catch (error) {
    console.error("Failed to fetch Ottawa camera data:", error);
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
        
        // Use a unique ID for this specific popup's elements
        const popupId = `mto-${camera.Id || Math.random().toString(36).substr(2, 9)}`;
        const baseImageUrl = camera.Views[0].Url;

        // BIND THE POPUP DYNAMICALLY
        marker.bindPopup((layer) => {
          // Every time the popup opens, we start a fresh 15s timer for JUST this image
          setTimeout(() => {
            const interval = setInterval(() => {
              const img = document.getElementById(`img-${popupId}`);
              const timeSpan = document.getElementById(`time-${popupId}`);
              if (img) {
                // Add a fresh timestamp to the URL to force the browser to actually download the new image
                img.src = `${baseImageUrl}?t=${new Date().getTime()}`;
                if (timeSpan) timeSpan.innerText = new Date().toLocaleTimeString();
              } else {
                clearInterval(interval);
              }
            }, 15000);
          }, 100);

          return `
            <div style="width: 300px;">
              <b style="font-size: 14px;">${camera.Location}</b><br/>
               <div style="display: flex; align-items: center; gap: 5px; margin-top: 5px;">
                <span class="pulsing-dot"></span>
                <span style="color: red; font-weight: bold;">LIVE</span>
                <span style="font-size: 11px; color: #666; margin-left: auto;">
                  Updated: <b id="time-${popupId}">${new Date().toLocaleTimeString()}</b>
                </span>
              </div>
              <img 
                id="img-${popupId}"
                src="${baseImageUrl}?t=${new Date().getTime()}" 
                style="width: 100%; border-radius: 4px; margin-top: 10px;"
                onerror="this.src='https://placehold.co/300x200?text=Highway+Cam+Offline';"
              />
              <p style="font-size: 11px; color: #666; margin-top: 8px;">Roadway: ${camera.Roadway}</p>
            </div>
          `;
        });

        layerGroup.addLayer(marker);
      }
    });
  } catch (error) {
    console.error("Failed to fetch MTO data:", error);
  }
};

// const fetchQuebecCameras = async (layerGroup) => {
//   try {
//     const proxy = "https://api.allorigins.win/get?url=";
//     //  removed the srsname parameter so the server responds instantly again
//     const targetUrl = 'https://ws.mapserver.transports.gouv.qc.ca/swtq?service=wfs&version=2.0.0&request=getfeature&typename=ms:infos_cameras&outputformat=geojson';
//     const url = encodeURIComponent(targetUrl);
    
//     const response = await fetch(proxy + url);
//     const wrapperData = await response.json(); 
    
//     if (!wrapperData || !wrapperData.contents) return;

//     let data;
//     try {
//       let rawText = wrapperData.contents;
//       if (rawText.startsWith('data:')) {
//         const base64String = rawText.split(',')[1];
//         rawText = decodeURIComponent(escape(atob(base64String))); 
//       }
//       data = JSON.parse(rawText);
//     } catch (parseError) {
//       console.error("Parse error:", parseError);
//       return;
//     }
    
//     if (!data || !Array.isArray(data.features)) {
//       console.error("Quebec data fetch failed or proxy timed out.");
//       const qcLabel = document.getElementById('qc-layer-label');
//       if (qcLabel) qcLabel.innerHTML = "<span style='color: #dc2626;'> (Proxy timeout - Please refresh)</span>";
//       return; 
//     }

//     console.log("✅ Successfully decoded Quebec data!");
//     console.log(`📸 Found ${data.features.length} cameras from Quebec API.`);
//     if (data.features.length > 0) {
//        console.log("🔍 First camera data:", data.features[0]);
//     } 

//     data.features.forEach(feature => {
//       if (feature.geometry && feature.geometry.coordinates) {
        
//         // --- Convert Web Mercator (meters) to Lat/Lng (degrees) ---
//         const x = feature.geometry.coordinates[0];
//         const y = feature.geometry.coordinates[1];
        
//         // Standard Spherical Mercator mathematical conversion
//         const earthRadius = 6378137;
//         const lng = (x / earthRadius) * (180 / Math.PI);
//         const lat = (2 * Math.atan(Math.exp(y / earthRadius)) - (Math.PI / 2)) * (180 / Math.PI);
//         // -------------------------------------------------------------------

//         const marker = L.marker([lat, lng], { icon: greenIcon });
        
//    // Construct the hidden raw MP4 endpoint
//         const videoUrl = `https://www.quebec511.info/Carte/Fenetres/camera.ashx?id=${feature.properties.IDEcamera}&format=mp4`;

//         const popupContent = `
//           <div style="width: 300px;">
//             <b style="font-size: 14px;">${feature.properties.DescriptionLocalisationEn || feature.properties.DescriptionLocalisationFr || 'Camera'}</b><br/>
//              <div style="display: flex; align-items: center; gap: 5px; margin-top: 5px; margin-bottom: 10px;">
//               <span class="pulsing-dot"></span>
//               <span style="color: red; font-weight: bold;">LIVE</span>
//               <span style="font-size: 11px; color: #666; margin-left: auto;">Updated: <span class="updated-timestamp">${new Date().toLocaleTimeString()}</span></span>
//             </div>
            
//             <video 
//               src="${videoUrl}" 
//               autoplay 
//               loop 
//               muted 
//               playsinline
//               style="width: 100%; border-radius: 4px; background-color: #222;"
//               onerror="this.outerHTML='<div style=\\'width:100%;height:160px;background:#222;color:#666;text-align:center;line-height:160px;border-radius:4px;\\'>Video Feed Offline</div>'"
//             ></video>

//           </div>
//         `;
//         marker.bindPopup(popupContent);
//         layerGroup.addLayer(marker);
//       }
//     });
//     const qcLabel = document.getElementById('qc-layer-label');
//     if (qcLabel) {
//       qcLabel.innerHTML = "Loaded <span style='font-size: 11px; color: #16a34a; margin-left: 5px;'>✓</span>";
//     }
//   } catch (error) {
//     console.error("Network or fetch error with Quebec 511:", error);
//     const qcLabel = document.getElementById('qc-layer-label');
//     if (qcLabel) {
//       qcLabel.innerHTML = "Québec 511 <span style='font-size: 11px; color: #dc2626; margin-left: 5px;'>(Failed to load)</span>";
//     }
//   }
// };

//MOCKDATA FUNC
const fetchQuebecCameras = async (layerGroup) => {
  try {
    // We instantly assign the imported mock data! No fetching required.
    const data = quebecMockData;

    if (!data || !Array.isArray(data.features)) {
      console.error("Mock data is missing features.");
      return; 
    }

    data.features.forEach(feature => {
      if (feature.geometry && feature.geometry.coordinates) {
        
        // Math to convert meters to GPS degrees
        const x = feature.geometry.coordinates[0];
        const y = feature.geometry.coordinates[1];
        const earthRadius = 6378137;
        const lng = (x / earthRadius) * (180 / Math.PI);
        const lat = (2 * Math.atan(Math.exp(y / earthRadius)) - (Math.PI / 2)) * (180 / Math.PI);

        const marker = L.marker([lat, lng], { icon: greenIcon });
        
        // Construct the hidden raw MP4 endpoint
        const videoUrl = `https://www.quebec511.info/Carte/Fenetres/camera.ashx?id=${feature.properties.IDEcamera}&format=mp4`;
        
        const popupContent = `
          <div style="width: 300px;">
            <b style="font-size: 14px;">${feature.properties.DescriptionLocalisationEn || feature.properties.DescriptionLocalisationFr || 'Camera'}</b><br/>
             <div style="display: flex; align-items: center; gap: 5px; margin-top: 5px; margin-bottom: 10px;">
              <span class="pulsing-dot"></span>
              <span style="color: red; font-weight: bold;">LIVE</span>
              <span style="font-size: 11px; color: #666; margin-left: auto;">Updated: <span class="updated-timestamp">${new Date().toLocaleTimeString()}</span></span>
            </div>
            
            <video 
              src="${videoUrl}" 
              autoplay 
              loop 
              muted 
              playsinline
              style="width: 100%; border-radius: 4px; background-color: #222;"
              onerror="this.outerHTML='<div style=\\'width:100%;height:160px;background:#222;color:#666;text-align:center;line-height:160px;border-radius:4px;\\'>Video Feed Offline</div>'"
            ></video>
          </div>
        `;
        marker.bindPopup(popupContent);
        layerGroup.addLayer(marker);
      }
    });

    // Remove the loading text instantly
    const qcLabel = document.getElementById('qc-layer-label');
    if (qcLabel) {
      qcLabel.innerHTML = ""; 
    }

  } catch (error) {
    console.error("Error processing mock Quebec data:", error);
  }
};



export default function App() {
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);
  const layerControlRef = useRef(null);
  const refreshIntervalIdRef = useRef(null);
  const activePopupRef = useRef(null);
  const [isLegendOpen, setIsLegendOpen] = useState(true);

  useEffect(() => {
    if (!mapInstance.current) {
      // Initialize map
      mapInstance.current = L.map(mapContainer.current).setView([45.4215, -75.6972], 10);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstance.current);
const clusterOptions = {
        maxClusterRadius: 65, // Default is 80. Lower number = less aggressive clustering
        disableClusteringAtZoom: 14 // Completely un-cluster everything 
      };
      // Initialize layer groups
const cityCameras = L.markerClusterGroup(clusterOptions).addTo(mapInstance.current);
      const mtoCameras = L.markerClusterGroup(clusterOptions).addTo(mapInstance.current);
      const quebecCameras = L.markerClusterGroup(clusterOptions).addTo(mapInstance.current);
      const torontoCameras = L.markerClusterGroup(clusterOptions).addTo(mapInstance.current);
      const wildlifeLayer = L.markerClusterGroup(clusterOptions).addTo(mapInstance.current);
      
     const overlayMaps = {
      "Wildlife Cams": wildlifeLayer,
        "City of Ottawa": cityCameras,
        "City of Toronto": torontoCameras,
        "MTO": mtoCameras, 
        "Québec 511 <span id='qc-layer-label' style='font-size: 11px; color: #d97706; font-style: italic; margin-left: 5px;'>(Loading 600+ live cams...) ⏳</span>": quebecCameras
      };

      layerControlRef.current = L.control.layers(null, overlayMaps).addTo(mapInstance.current);
      fetchWildlifeCameras(wildlifeLayer);  
      fetchOttawaCameras(cityCameras);
      fetchTorontoCameras(torontoCameras);
      fetchMtoCameras(mtoCameras);
      fetchQuebecCameras(quebecCameras);
  
    mapInstance.current.on('popupopen', (e) => {
        activePopupRef.current = e.popup;
        const popupElement = activePopupRef.current.getElement();
        if (!popupElement) return;

        // Look for either an image OR a video
        const img = popupElement.querySelector('img');
        const video = popupElement.querySelector('video'); 
        const timestampSpan = popupElement.querySelector('.updated-timestamp');

        if (img || video) {
          refreshIntervalIdRef.current = setInterval(() => {
            if (!activePopupRef.current) {
              clearInterval(refreshIntervalIdRef.current);
              return;
            }
            
            // Refresh Image (Ottawa & MTO)
            if (img) {
              const newSrc = img.src.split('&t=')[0] + '&t=' + Date.now();
              img.src = newSrc;
            }

            // Refresh Video (Québec 511)
            if (video) {
               // Grabbing a fresh 5-second MP4 clip
               const newSrc = video.src.split('&t=')[0] + '&t=' + Date.now();
               video.src = newSrc;
               video.play(); // Ensure it keeps playing after the source swap
            }

            if (timestampSpan) {
              timestampSpan.innerText = new Date().toLocaleTimeString();
            }
          }, 15000); // Refreshes every 15 seconds
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
 
  <div style={{ position: 'relative' }}>
    {/* This is your existing map container */}
    <div
      ref={mapContainer}
      style={{ height: '100vh', width: '100vw' }}
    />

    {/* PASTE THE LEGEND CODE HERE (Right where your red line was) */}
    <div style={{
      position: 'absolute',
      bottom: '30px',
      right: '20px',
      zIndex: 1000
    }}>
      <div className="map-legend">
        <div 
          className="legend-header"
          onClick={() => setIsLegendOpen(!isLegendOpen)}
          style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <span>SYSTEM: ONLINE</span>
          <span>{isLegendOpen ? '▼' : '▲'}</span>
        </div>
        
        {isLegendOpen && (
          <>
            <div className="legend-item">
              <span className="dot" style={{ backgroundColor: '#e81123' }}></span>
              <span>Ottawa Municipal</span>
            </div>
            
            <div className="legend-item">
              <span className="dot" style={{ backgroundColor: '#a020f0' }}></span>
              <span>Toronto Municipal</span>
            </div>
            
            <div className="legend-item">
              <span className="dot" style={{ backgroundColor: '#0078d7' }}></span>
              <span>Ontario 511 (MTO)</span>
            </div>
            
            <div className="legend-item">
              <span className="dot" style={{ backgroundColor: '#00cc00' }}></span>
              <span>Québec (live Video)</span>
            </div>

             <div className="legend-item">
              <span className="dot" style={{ backgroundColor: '#ff1493' }}></span>
              <span>Wildlife & Nature</span>
            </div>

            <div style={{ marginTop: '10px', fontSize: '10px', color: '#888', textAlign: 'center' }}>
              Auto-Refresh: 15s
            </div>
          </>
        )}
      </div>
    </div>
  </div>
  );
}