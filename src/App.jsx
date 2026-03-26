import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster";

import quebecMockData from "./quebecMockData.json";
import torontoData from "./torontoMockData.json";
import wildlifeData from "./wildlifeData.json";
import bcMockData from "./bcMockData.json";
import londonData from "./londonData.json";
import californiaData from "./californiaData.json";

// Red for Ottawa City
const redIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Blue for MTO/Highway
const blueIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Green for Quebec 511
const greenIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Violet for Toronto
const purpleIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Orange for Alberta 511
const orangeIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const yellowIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// violet for london
const violetIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// gold for Wildlife
const wildlifeIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const fetchWildlifeCameras = (layerGroup) => {
  wildlifeData.features.forEach((feature) => {
    const [lng, lat] = feature.geometry.coordinates;
    const { name, location, youtubeId } = feature.properties;

    const marker = L.marker([lat, lng], { icon: wildlifeIcon });

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

  cameras.forEach((cam) => {
    const lat = parseFloat(cam.Latitude);
    const lng = parseFloat(cam.Longitude);
    const camNumber = cam.Number;
    const camName = cam.Name;

    if (!isNaN(lat) && !isNaN(lng) && camNumber) {
      const marker = L.marker([lat, lng], { icon: purpleIcon });

      marker.bindPopup(() => {
        const popupId = `popup-${camNumber}`;
        return `
          <div style="width: 300px;">
            <b style="font-size: 14px;">${camName}</b><br/>
             <div style="display: flex; align-items: center; gap: 5px; margin-top: 5px; margin-bottom: 10px;">
              <span class="pulsing-dot"></span>
              <span style="color: red; font-weight: bold;">LIVE</span>
              <span style="font-size: 11px; color: #666; margin-left: auto;">
                Updated: <b id="time-${popupId}" class="updated-timestamp">${new Date().toLocaleTimeString()}</b>
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
const fetchAlbertaCameras = async (layerGroup, setAlbertaCount) => {
  try {
    const proxy = "https://corsproxy.io/?";
    const url = encodeURIComponent("https://511.alberta.ca/api/v2/get/cameras");

    const response = await fetch(proxy + url);
    const cameras = await response.json();

    setAlbertaCount(cameras.length);

    cameras.forEach((camera) => {
      if (camera.Latitude && camera.Longitude && camera.Views?.length > 0) {
        const marker = L.marker([camera.Latitude, camera.Longitude], {
          icon: orangeIcon,
        });

        marker.bindPopup(() => {
          // Prepend "ab-" to ensure popup IDs never clash with Ontario MTO cameras
          const popupId = `ab-${camera.Id || Math.random().toString(36).substr(2, 9)}`;
          const baseImageUrl = camera.Views[0].Url;

          return `
            <div style="width: 300px;">
              <b style="font-size: 14px;">${camera.Location}</b><br/>
               <div style="display: flex; align-items: center; gap: 5px; margin-top: 5px;">
                <span class="pulsing-dot"></span>
                <span style="color: red; font-weight: bold;">LIVE</span>
                <span style="font-size: 11px; color: #666; margin-left: auto;">
                  Sync Time: <b id="time-${popupId}" class="updated-timestamp">${new Date().toLocaleTimeString()}</b>
                </span>
              </div>
              <img 
                id="img-${popupId}"
                src="${baseImageUrl}?t=${new Date().getTime()}" 
                style="width: 100%; border-radius: 4px; margin-top: 10px;"
                onerror="this.src='https://placehold.co/300x200?text=Alberta+Cam+Offline';"
              />
              <p style="font-size: 11px; color: #666; margin-top: 8px;">Roadway: ${camera.Roadway}</p>
            </div>
          `;
        });

        layerGroup.addLayer(marker);
      }
    });
  } catch (error) {
    console.error("Failed to fetch Alberta data:", error);
  }
};
const fetchOttawaCameras = async (layerGroup, setOttawaCount) => {
  try {
    const proxyUrl = "https://corsproxy.io/?";
    const targetUrl = "https://traffic.ottawa.ca/map/service/camera";

    const response = await fetch(proxyUrl + encodeURIComponent(targetUrl));
    const data = await response.json();

    const cameraList = Array.isArray(data) ? data : data.cameras || [];
    if (cameraList.length === 0) return;

    // UPDATE LEGEND COUNT
    setOttawaCount(cameraList.length);

    cameraList
      .filter(
        (camera) => camera.type === "camera" || camera.camera_number < 2000,
      )
      .forEach((camera) => {
        const marker = L.marker([camera.latitude, camera.longitude], {
          icon: redIcon,
        });

        marker.bindPopup(() => {
          const camId = camera.camera_number;
          const popupId = `ottawa-${camId}`;
          const baseImageUrl = `https://traffic.ottawa.ca/map/camera?id=${camId}`;

          return `
            <div style="width: 300px;">
              <b style="font-size: 14px;">${camera.description || camera.name}</b><br/>
              <div style="display: flex; align-items: center; gap: 5px; margin-top: 5px;">
                <span class="pulsing-dot"></span>
                <span style="color: red; font-weight: bold;">LIVE</span>
                <span style="font-size: 11px; color: #666; margin-left: auto;">
                  Updated: <b id="time-${popupId}" class="updated-timestamp">${new Date().toLocaleTimeString()}</b>
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

const fetchMtoCameras = async (layerGroup, setMtoCount) => {
  try {
    const proxy = "https://corsproxy.io/?";
    const url = encodeURIComponent("https://511on.ca/api/v2/get/cameras");

    const response = await fetch(proxy + url);
    const cameras = await response.json();

    // UPDATE LEGEND COUNT
    setMtoCount(cameras.length);

    cameras.forEach((camera) => {
      if (camera.Latitude && camera.Longitude && camera.Views?.length > 0) {
        const marker = L.marker([camera.Latitude, camera.Longitude], {
          icon: blueIcon,
        });

        marker.bindPopup(() => {
          const popupId = `mto-${camera.Id || Math.random().toString(36).substr(2, 9)}`;
          const baseImageUrl = camera.Views[0].Url;

          return `
            <div style="width: 300px;">
              <b style="font-size: 14px;">${camera.Location}</b><br/>
               <div style="display: flex; align-items: center; gap: 5px; margin-top: 5px;">
                <span class="pulsing-dot"></span>
                <span style="color: red; font-weight: bold;">LIVE</span>
                <span style="font-size: 11px; color: #666; margin-left: auto;">
                  Updated: <b id="time-${popupId}" class="updated-timestamp">${new Date().toLocaleTimeString()}</b>
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

const fetchQuebecCameras = async (layerGroup) => {
  try {
    const data = quebecMockData;

    if (!data || !Array.isArray(data.features)) {
      console.error("Mock data is missing features.");
      return;
    }

    data.features.forEach((feature) => {
      if (feature.geometry && feature.geometry.coordinates) {
        const x = feature.geometry.coordinates[0];
        const y = feature.geometry.coordinates[1];
        const earthRadius = 6378137;
        const lng = (x / earthRadius) * (180 / Math.PI);
        const lat =
          (2 * Math.atan(Math.exp(y / earthRadius)) - Math.PI / 2) *
          (180 / Math.PI);

        const marker = L.marker([lat, lng], { icon: greenIcon });

        marker.bindPopup(() => {
          const videoUrl = `https://www.quebec511.info/Carte/Fenetres/camera.ashx?id=${feature.properties.IDEcamera}&format=mp4`;

          return `
            <div style="width: 300px;">
              <b style="font-size: 14px;">${feature.properties.DescriptionLocalisationEn || feature.properties.DescriptionLocalisationFr || "Camera"}</b><br/>
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
        });

        layerGroup.addLayer(marker);
      }
    });

    const qcLabel = document.getElementById("qc-layer-label");
    if (qcLabel) {
      qcLabel.innerHTML = "";
    }
  } catch (error) {
    console.error("Error processing mock Quebec data:", error);
  }
};

const fetchBcCameras = (layerGroup, setBcCount) => {
  try {
    const cameras = bcMockData;
    if (!cameras || cameras.length === 0) return;

    let validCameras = 0;

    cameras.forEach((camera) => {
      const lat = parseFloat(camera.latitude);
      const lng = parseFloat(camera.longitude);
      const camName = camera.camName || "DriveBC Cam";
      const camId = camera.id;

      // BUILD THE NEW URL DIRECTLY USING THE ID
      const imgUrl = `https://www.drivebc.ca/images/${camId}.jpg`;

      // Make sure we have a valid ID and coordinates before plotting
      if (!isNaN(lat) && !isNaN(lng) && camId) {
        validCameras++;
        const marker = L.marker([lat, lng], { icon: yellowIcon });

        marker.bindPopup(() => {
          const popupId = `bc-${String(camId).replace(/[^a-zA-Z0-9]/g, "")}`;

          return `
            <div style="width: 300px;">
              <b style="font-size: 14px;">${camName}</b><br/>
               <div style="display: flex; align-items: center; gap: 5px; margin-top: 5px;">
                <span class="pulsing-dot"></span>
                <span style="color: red; font-weight: bold;">LIVE</span>
                <span style="font-size: 11px; color: #666; margin-left: auto;">
                  Sync Time: <b id="time-${popupId}" class="updated-timestamp">${new Date().toLocaleTimeString()}</b>
                </span>
              </div>
              <img 
                id="img-${popupId}"
                src="${imgUrl}?t=${new Date().getTime()}" 
                referrerpolicy="no-referrer"
                style="width: 100%; border-radius: 4px; margin-top: 10px;"
                onerror="this.onerror=null; this.src='https://placehold.co/300x200?text=DriveBC+Cam+Offline';"
              />
            </div>
          `;
        });
        layerGroup.addLayer(marker);
      }
    });

    setBcCount(validCameras);
  } catch (error) {
    console.error("Error processing BC JSON data:", error);
  }
};

const fetchLondonCameras = (layerGroup, setLondonCount) => {
  try {
    const cameras = londonData;
    if (!cameras || !Array.isArray(cameras)) return;

    let validCount = 0;

    cameras.forEach((camera) => {
      const lat = camera.lat;
      const lng = camera.lon;
      const camName = camera.commonName;

      // Find the specific 'videoUrl' inside the properties array
      const videoProp = camera.additionalProperties?.find(
        (p) => p.key === "videoUrl",
      );
      const videoUrl = videoProp ? videoProp.value : null;

      // Backup image if video fails
      const imageProp = camera.additionalProperties?.find(
        (p) => p.key === "imageUrl",
      );
      const imageUrl = imageProp ? imageProp.value : null;

      if (lat && lng && (videoUrl || imageUrl)) {
        validCount++;
        const marker = L.marker([lat, lng], { icon: violetIcon });

        marker.bindPopup(() => {
          return `
            <div style="width: 300px;">
              <b style="font-size: 14px;">🇬🇧 ${camName}</b><br/>
               <div style="display: flex; align-items: center; gap: 5px; margin-top: 5px; margin-bottom: 10px;">
                <span class="pulsing-dot"></span>
                <span style="color: red; font-weight: bold;">LIVE</span>
                <span style="font-size: 11px; color: #666; margin-left: auto;">
                  Sync: <b class="updated-timestamp">${new Date().toLocaleTimeString()}</b>
                </span>
              </div>
              ${
                videoUrl
                  ? `
                <video 
                  src="${videoUrl}" 
                  autoplay 
                  loop 
                  muted 
                  playsinline
                  style="width: 100%; border-radius: 4px; background-color: #000;"
                  onerror="this.style.display='none'; this.nextElementSibling.style.display='block';"
                ></video>
              `
                  : ""
              }
              <img 
                src="${imageUrl}" 
                style="width: 100%; border-radius: 4px; display: ${videoUrl ? "none" : "block"};" 
                onerror="this.src='https://placehold.co/300x200?text=London+Feed+Offline';"
              />
            </div>
          `;
        });
        layerGroup.addLayer(marker);
      }
    });
    setLondonCount(validCount);
  } catch (error) {
    console.error("Error processing London data:", error);
  }
};

const fetchCaliforniaCameras = (layerGroup, setCalCount) => {
  try {
    const cameras = californiaData.data || [];
    if (cameras.length === 0) return;

    let validCount = 0;

    cameras.forEach((item) => {
      const cctv = item.cctv;
      const loc = cctv?.location;
      const imgInfo = cctv?.imageData?.static;

      const lat = parseFloat(loc?.latitude);
      const lng = parseFloat(loc?.longitude);
      const camName = loc?.locationName || "California Highway Cam";
      const imgUrl = imgInfo?.currentImageURL || "";

      if (!isNaN(lat) && !isNaN(lng) && imgUrl && cctv.inService === "true") {
        validCount++;
        const marker = L.marker([lat, lng], { icon: orangeIcon });

        marker.bindPopup(() => {
          const popupId = `cal-${cctv.index}`;
          return `
            <div style="width: 300px;">
              <b style="font-size: 14px;">☀️ ${camName}</b><br/>
              <i style="font-size: 11px; color: #666;">${loc.nearbyPlace}, ${loc.county} County</i>
               <div style="display: flex; align-items: center; gap: 5px; margin-top: 5px;">
                <span class="pulsing-dot"></span>
                <span style="color: red; font-weight: bold;">LIVE</span>
                <span style="font-size: 11px; color: #666; margin-left: auto;">
                  Sync: <b class="updated-timestamp">${new Date().toLocaleTimeString()}</b>
                </span>
              </div>
              <img 
                id="img-${popupId}"
                src="${imgUrl}?t=${new Date().getTime()}" 
                referrerpolicy="no-referrer"
                style="width: 100%; height: 180px; object-fit: cover; border-radius: 4px; margin-top: 10px; background-color: #222; display: block;"
                onerror="this.src='https://placehold.co/300x180/222/666?text=Caltrans+Feed+Offline';"
              />
              <p style="font-size: 10px; color: #888; margin-top: 5px;">Route: ${loc.route} ${loc.direction}</p>
            </div>
          `;
        });
        layerGroup.addLayer(marker);
      }
    });

    setCalCount(validCount);
  } catch (error) {
    console.error("Error processing California data:", error);
  }
};

export default function App() {
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);
  const layerControlRef = useRef(null);
  const refreshIntervalIdRef = useRef(null);
  const activePopupRef = useRef(null);

  const [isLegendOpen, setIsLegendOpen] = useState(true);

  // Legend State Totals
  const [ottawaCount, setOttawaCount] = useState(0);
  const [mtoCount, setMtoCount] = useState(0);
  const [albertaCount, setAlbertaCount] = useState(0);
  const [bcCount, setBcCount] = useState(0);
  const [londonCount, setLondonCount] = useState(0);
  const [calCount, setCalCount] = useState(0);
  const torontoCount = torontoData.Data ? torontoData.Data.length : 0;
  const quebecCount = quebecMockData.features
    ? quebecMockData.features.length
    : 0;
  const wildlifeCount = wildlifeData.features
    ? wildlifeData.features.length
    : 0;
  const totalCameras =
    ottawaCount +
    mtoCount +
    albertaCount +
    torontoCount +
    quebecCount +
    bcCount +
    londonCount +
    calCount +
    wildlifeCount;

  useEffect(() => {
    if (!mapInstance.current) {
      // Initialize map
      mapInstance.current = L.map(mapContainer.current).setView([40, -40], 3);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(mapInstance.current);

      const clusterOptions = {
        maxClusterRadius: 65,
        disableClusteringAtZoom: 13,
      };

      // Initialize layer groups
      const cityCameras = L.markerClusterGroup(clusterOptions).addTo(
        mapInstance.current,
      );
      const mtoCameras = L.markerClusterGroup(clusterOptions).addTo(
        mapInstance.current,
      );
      const quebecCameras = L.markerClusterGroup(clusterOptions).addTo(
        mapInstance.current,
      );
      const torontoCameras = L.markerClusterGroup(clusterOptions).addTo(
        mapInstance.current,
      );
      const albertaCameras = L.markerClusterGroup(clusterOptions).addTo(
        mapInstance.current,
      );
      const wildlifeLayer = L.markerClusterGroup(clusterOptions).addTo(
        mapInstance.current,
      );
      const bcCameras = L.markerClusterGroup(clusterOptions).addTo(
        mapInstance.current,
      );
      const londonCameras = L.markerClusterGroup(clusterOptions).addTo(
        mapInstance.current,
      );
      const calCameras = L.markerClusterGroup(clusterOptions).addTo(
        mapInstance.current,
      );
      fetchCaliforniaCameras(calCameras, setCalCount);

      const overlayMaps = {
        "Wildlife Cams": wildlifeLayer,
        "City of Ottawa": cityCameras,
        "City of Toronto": torontoCameras,
        "Ontario 511": mtoCameras,
        "Alberta 511": albertaCameras,
        "British Columbia 511": bcCameras,
        California: calCameras,
        "Québec 511 <span id='qc-layer-label' style='font-size: 11px; color: #d97706; font-style: italic; margin-left: 5px;'>(Loading 600+ live cams...) ⏳</span>":
          quebecCameras,
        London: londonCameras,
      };

      layerControlRef.current = L.control
        .layers(null, overlayMaps)
        .addTo(mapInstance.current);

      // Pass state setters to dynamic fetches
      fetchWildlifeCameras(wildlifeLayer);
      fetchOttawaCameras(cityCameras, setOttawaCount);
      fetchTorontoCameras(torontoCameras);
      fetchMtoCameras(mtoCameras, setMtoCount);
      fetchQuebecCameras(quebecCameras);
      fetchAlbertaCameras(albertaCameras, setAlbertaCount);
      fetchBcCameras(bcCameras, setBcCount);
      fetchLondonCameras(londonCameras, setLondonCount);
      fetchCaliforniaCameras(calCameras, setCalCount);

      // GLOBAL POPUP WATCHER
      mapInstance.current.on("popupopen", (e) => {
        if (refreshIntervalIdRef.current)
          clearInterval(refreshIntervalIdRef.current);

        activePopupRef.current = e.popup;
        const popupElement = activePopupRef.current.getElement();
        if (!popupElement) return;

        const img = popupElement.querySelector("img");
        const video = popupElement.querySelector("video");
        const timestampSpan = popupElement.querySelector(".updated-timestamp");

        if (img || video) {
          refreshIntervalIdRef.current = setInterval(() => {
            if (!activePopupRef.current) {
              clearInterval(refreshIntervalIdRef.current);
              return;
            }

            // Image Refresh (Strips old timestamps safely for both format types)
            if (img) {
              let rawUrl = img.src;
              if (rawUrl.includes("?t=")) rawUrl = rawUrl.split("?t=")[0];
              else if (rawUrl.includes("&t=")) rawUrl = rawUrl.split("&t=")[0];

              const separator = rawUrl.includes("?") ? "&t=" : "?t=";
              img.src = `${rawUrl}${separator}${Date.now()}`;
            }

            // Video Refresh
            if (video) {
              // london fix: we reload the existing resource to get the freshest loop.
              video.load();
              video.play().catch(() => {});
            }

            if (timestampSpan) {
              timestampSpan.innerText = new Date().toLocaleTimeString();
            }
          }, 15000);
        }
      });

      mapInstance.current.on("popupclose", () => {
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
    <div style={{ position: "relative" }}>
      <div ref={mapContainer} style={{ height: "100vh", width: "100vw" }} />

      <div
        style={{
          position: "absolute",
          bottom: "30px",
          right: "20px",
          zIndex: 1000,
        }}
      >
        <div className="map-legend">
          <div
            className="legend-header"
            onClick={() => setIsLegendOpen(!isLegendOpen)}
            style={{
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: isLegendOpen ? "8px" : "0px",
            }}
          >
            <span>CAMERAS: ONLINE</span>
            <span style={{ marginLeft: "10px" }}>
              {isLegendOpen ? "▼" : "▲"}
            </span>
          </div>

          {isLegendOpen && (
            <>
              <div className="legend-item">
                <span
                  className="dot"
                  style={{ backgroundColor: "#e81123" }}
                ></span>
                <span>Ottawa Municipal</span>
                <span className="count-badge">{ottawaCount}</span>
              </div>

              <div className="legend-item">
                <span
                  className="dot"
                  style={{ backgroundColor: "#a020f0" }}
                ></span>
                <span>Toronto Municipal</span>
                <span className="count-badge">{torontoCount}</span>
              </div>

              <div className="legend-item">
                <span
                  className="dot"
                  style={{ backgroundColor: "#0078d7" }}
                ></span>
                <span>Ontario 511 (MTO)</span>
                <span className="count-badge">{mtoCount}</span>
              </div>

              <div className="legend-item">
                <span
                  className="dot"
                  style={{ backgroundColor: "#00cc00" }}
                ></span>
                <span>Québec (Live Video)</span>
                <span className="count-badge">{quebecCount}</span>
              </div>

              <div className="legend-item">
                <span
                  className="dot"
                  style={{ backgroundColor: "#ff8c00" }}
                ></span>
                <span>Alberta 511</span>
                <span className="count-badge">{albertaCount}</span>
              </div>
              <div className="legend-item">
                <span
                  className="dot"
                  style={{ backgroundColor: "#ffea00" }}
                ></span>
                <span>DriveBC</span>
                <span className="count-badge">{bcCount}</span>
              </div>
              <div className="legend-item">
                <span
                  className="dot"
                  style={{ backgroundColor: "#ff1493" }}
                ></span>
                <span>London (Live Video)</span>
                <span className="count-badge">{londonCount}</span>
              </div>
              <div className="legend-item">
                <span
                  className="dot"
                  style={{ backgroundColor: "#ff8c00" }}
                ></span>
                <span>California DOT</span>
                <span className="count-badge">{calCount}</span>
              </div>
              <div className="legend-item">
                <span
                  className="dot"
                  style={{ backgroundColor: "#f0f70d" }}
                ></span>
                <span>Wildlife & Nature</span>
                <span className="count-badge">{wildlifeCount}</span>
              </div>

              <div
                style={{
                  marginTop: "12px",
                  paddingTop: "8px",
                  borderTop: "1px solid #333",
                  fontSize: "11px",
                  color: "#00ff00",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span>TOTAL FEEDS:</span>
                <span>{totalCameras}</span>
              </div>

              <div
                style={{
                  marginTop: "10px",
                  fontSize: "10px",
                  color: "#888",
                  textAlign: "center",
                }}
              >
                Auto-Refresh: 15s
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
