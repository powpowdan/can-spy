import L from "leaflet";

import quebecMockData from "./quebecMockData.json";
import torontoData from "./torontoMockData.json";
import wildlifeData from "./wildlifeData.json";
import bcMockData from "./bcMockData.json";
import londonData from "./londonData.json";
import californiaData from "./californiaData.json";
import sydneyData from "./sydneyData.json";
import chicagoData from "./chicagoData.json";
import ottawaData from "./ottawaData.json";
import ontarioData from "./ontarioData.json";
import albertaData from "./albertaData.json";
import yorkData from "./yorkData.json";
import alertWestData from "./alertWestData.json";
import finlandData from "./finlandData.json";
import nztaData from "./nztaData.json";
import wsdotData from "./wsdotData.json";
import iowaData from "./iowaData.json";
import austinData from "./austinData.json";
import oregonData from "./oregonData.json";
import newfoundlandData from "./newfoundlandData.json";
import floridaData from "./floridaData.json";
import michiganData from "./michiganData.json";
import salemData from "./salemData.json";
import hawaiiData from "./hawaiiData.json";
import seattleData from "./seattleData.json";
import utahData from "./utahData.json";
import geonetVolcanoData from "./geonetVolcanoData.json";
import arlingtonData from "./arlingtonData.json";

const icon = (color) =>
  new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

const redIcon = icon("red");
const blueIcon = icon("blue");
const greenIcon = icon("green");
const purpleIcon = icon("violet");
const orangeIcon = icon("orange");
const yellowIcon = icon("yellow");
const violetIcon = icon("violet");
const wildlifeIcon = icon("gold");

export const cameraSourceCatalog = [
  {
    id: "ottawa",
    label: "Ottawa Municipal",
    shortLabel: "Ottawa",
    group: "North America",
    category: "traffic",
    accent: "#e45d6f",
    icon: redIcon,
  },
  {
    id: "toronto",
    label: "Toronto Municipal",
    shortLabel: "Toronto",
    group: "North America",
    category: "traffic",
    accent: "#8a6fe8",
    icon: purpleIcon,
  },
  {
    id: "york",
    label: "York Region",
    shortLabel: "York Region",
    group: "North America",
    category: "traffic",
    accent: "#4f8edb",
    icon: redIcon,
  },
  {
    id: "ontario",
    label: "Ontario 511",
    shortLabel: "Ontario 511",
    group: "North America",
    category: "highway",
    accent: "#3f88d2",
    icon: blueIcon,
  },
  {
    id: "quebec",
    label: "Québec 511",
    shortLabel: "Québec 511",
    group: "North America",
    category: "highway",
    accent: "#4cae8d",
    icon: greenIcon,
  },
  {
    id: "alberta",
    label: "Alberta 511",
    shortLabel: "Alberta 511",
    group: "North America",
    category: "highway",
    accent: "#e68a46",
    icon: orangeIcon,
  },
  {
    id: "bc",
    label: "DriveBC",
    shortLabel: "DriveBC",
    group: "North America",
    category: "highway",
    accent: "#d8ad45",
    icon: yellowIcon,
  },
  {
    id: "california",
    label: "California Caltrans",
    shortLabel: "California",
    group: "North America",
    category: "highway",
    accent: "#d9784f",
    icon: orangeIcon,
  },
  {
    id: "illinois",
    label: "Illinois DOT",
    shortLabel: "Illinois",
    group: "North America",
    category: "traffic",
    accent: "#5b91a9",
    icon: blueIcon,
  },
  {
    id: "london",
    label: "London TfL",
    shortLabel: "London",
    group: "Europe",
    category: "traffic",
    accent: "#7865d8",
    icon: violetIcon,
  },
  {
    id: "sydney",
    label: "Sydney Transport",
    shortLabel: "Sydney",
    group: "Oceania",
    category: "traffic",
    accent: "#4292bf",
    icon: blueIcon,
  },
  {
    id: "wildlife",
    label: "Wildlife & Nature",
    shortLabel: "Wildlife",
    group: "Nature",
    category: "nature",
    accent: "#84a84d",
    icon: wildlifeIcon,
  },
  {
    id: "alertwest",
    label: "AlertWest Fire Cams",
    shortLabel: "AlertWest",
    group: "Nature",
    category: "nature",
    accent: "#e0533d",
    icon: orangeIcon,
  },
  {
    id: "finland",
    label: "Finland Weather Cams",
    shortLabel: "Finland",
    group: "Europe",
    category: "highway",
    accent: "#2a9d8f",
    icon: blueIcon,
  },
  {
    id: "nzta",
    label: "New Zealand Traffic (NZTA)",
    shortLabel: "New Zealand",
    group: "Oceania",
    category: "highway",
    accent: "#15aabf",
    icon: blueIcon,
  },
  {
    id: "wsdot",
    label: "Washington Traffic (WSDOT)",
    shortLabel: "Washington",
    group: "North America",
    category: "highway",
    accent: "#2b8a3e",
    icon: greenIcon,
  },
  {
    id: "iowa",
    label: "Iowa DOT Traffic",
    shortLabel: "Iowa",
    group: "North America",
    category: "highway",
    accent: "#c2255c",
    icon: redIcon,
  },
  {
    id: "austin",
    label: "Austin Traffic Cameras",
    shortLabel: "Austin",
    group: "North America",
    category: "traffic",
    accent: "#1864ab",
    icon: blueIcon,
  },
  {
    id: "oregon",
    label: "Oregon Traffic (TripCheck)",
    shortLabel: "Oregon",
    group: "North America",
    category: "highway",
    accent: "#6741d9",
    icon: violetIcon,
  },
  {
    id: "newfoundland",
    label: "Newfoundland & Labrador Hwy Cams",
    shortLabel: "Newfoundland",
    group: "North America",
    category: "highway",
    accent: "#5f3dc4",
    icon: violetIcon,
  },
  {
    id: "florida",
    label: "Florida 511 Traffic",
    shortLabel: "Florida",
    group: "North America",
    category: "highway",
    accent: "#fa5252",
    icon: redIcon,
  },
  {
    id: "michigan",
    label: "Michigan Traffic (MiDrive)",
    shortLabel: "Michigan",
    group: "North America",
    category: "highway",
    accent: "#1c7ed6",
    icon: blueIcon,
  },
  {
    id: "salem",
    label: "Salem, OR Traffic Cameras",
    shortLabel: "Salem",
    group: "North America",
    category: "traffic",
    accent: "#f06595",
    icon: violetIcon,
  },
  {
    id: "hawaii",
    label: "Hawaii DOT Traffic",
    shortLabel: "Hawaii",
    group: "North America",
    category: "highway",
    accent: "#cc5de8",
    icon: violetIcon,
  },
  {
    id: "seattle",
    label: "Seattle Traffic (SDOT)",
    shortLabel: "Seattle",
    group: "North America",
    category: "traffic",
    accent: "#37b24d",
    icon: greenIcon,
  },
  {
    id: "utah",
    label: "Utah DOT Traffic",
    shortLabel: "Utah",
    group: "North America",
    category: "highway",
    accent: "#d9480f",
    icon: orangeIcon,
  },
  {
    id: "geonetVolcano",
    label: "GeoNet NZ Volcano Webcams",
    shortLabel: "GeoNet Volcano",
    group: "Nature",
    category: "nature",
    accent: "#e8590c",
    icon: orangeIcon,
  },
  {
    id: "arlington",
    label: "Arlington, TX Traffic Cameras",
    shortLabel: "Arlington, TX",
    group: "North America",
    category: "traffic",
    accent: "#9c36b5",
    icon: violetIcon,
  },
];

const sourceMap = Object.fromEntries(
  cameraSourceCatalog.map((source) => [source.id, source]),
);

const isValidCoordinate = (lat, lng) =>
  Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180;

const proxyImageUrl = (url) => {
  if (!url) return null;

  return `https://wsrv.nl/?url=${encodeURIComponent(url)}`;
};

const metadata = (...entries) =>
  entries
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .map(([label, value]) => ({ label, value: String(value) }));

const createCamera = (sourceId, camera) => {
  const source = sourceMap[sourceId];
  const record = {
    ...camera,
    sourceId,
    sourceLabel: source.label,
    sourceGroup: source.group,
    category: source.category,
    accent: source.accent,
  };

  return {
    ...record,
    searchText: [
      record.name,
      record.sourceLabel,
      record.sourceGroup,
      ...(record.metadata || []).flatMap(({ value }) => value),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase(),
  };
};

const records = [];

wildlifeData.features.forEach((feature, index) => {
  const [lng, lat] = feature.geometry.coordinates;
  const { name, location, youtubeId } = feature.properties;

  if (isValidCoordinate(lat, lng) && youtubeId) {
    records.push(
      createCamera("wildlife", {
        id: `wildlife-${youtubeId || index}`,
        name: name || "Wildlife camera",
        lat,
        lng,
        feedType: "youtube",
        previewUrl: `https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&live=1&modestbranding=1&rel=0`,
        metadata: metadata(["Location", location]),
      }),
    );
  }
});

(torontoData.Data || []).forEach((camera) => {
  const lat = parseFloat(camera.Latitude);
  const lng = parseFloat(camera.Longitude);

  if (isValidCoordinate(lat, lng) && camera.Number) {
    records.push(
      createCamera("toronto", {
        id: `toronto-${camera.Number}`,
        name: camera.Name || "Toronto traffic camera",
        lat,
        lng,
        feedType: "current-frame",
        previewUrl: `https://opendata.toronto.ca/transportation/tmc/rescucameraimages/CameraImages/loc${camera.Number}.jpg`,
        metadata: metadata(["Camera number", camera.Number]),
      }),
    );
  }
});

(albertaData || []).forEach((camera) => {
  const lat = parseFloat(camera.Latitude);
  const lng = parseFloat(camera.Longitude);
  const baseImageUrl = camera.Url || camera.Views?.[0]?.Url;

  if (isValidCoordinate(lat, lng) && baseImageUrl) {
    records.push(
      createCamera("alberta", {
        id: `alberta-${camera.Id}`,
        name: camera.Description || "Alberta highway camera",
        lat,
        lng,
        feedType: "current-frame",
        previewUrl: proxyImageUrl(baseImageUrl, "Alberta+Cam+Offline"),
        metadata: metadata(["Roadway", camera.Roadway || "Alberta highway"]),
      }),
    );
  }
});

const ottawaCameras = Array.isArray(ottawaData)
  ? ottawaData
  : ottawaData.cameras || [];

ottawaCameras
  .filter((camera) => camera.type === "camera" || camera.camera_number < 2000)
  .forEach((camera) => {
    const lat = parseFloat(camera.latitude);
    const lng = parseFloat(camera.longitude);
    const cameraNumber = camera.camera_number;

    if (isValidCoordinate(lat, lng) && cameraNumber) {
      records.push(
        createCamera("ottawa", {
          id: `ottawa-${cameraNumber}`,
          name: camera.description || camera.name || "Ottawa traffic camera",
          lat,
          lng,
          feedType: "current-frame",
          previewUrl: proxyImageUrl(
            `https://traffic.ottawa.ca/map/camera?id=${cameraNumber}`,
            "City+Camera+Offline",
          ),
          metadata: metadata(["Camera number", cameraNumber]),
        }),
      );
    }
  });

(ontarioData || []).forEach((camera) => {
  const lat = parseFloat(camera.Latitude);
  const lng = parseFloat(camera.Longitude);
  const baseImageUrl = camera.Url || camera.Views?.[0]?.Url;

  if (isValidCoordinate(lat, lng) && baseImageUrl) {
    records.push(
      createCamera("ontario", {
        id: `ontario-${camera.Id}`,
        name: camera.Description || camera.Location || "Ontario highway camera",
        lat,
        lng,
        feedType: "current-frame",
        previewUrl: proxyImageUrl(baseImageUrl, "Highway+Cam+Offline"),
        metadata: metadata(["Roadway", camera.Roadway || "Ontario highway"]),
      }),
    );
  }
});

(quebecMockData.features || []).forEach((feature) => {
  if (!feature.geometry?.coordinates) return;

  const [x, y] = feature.geometry.coordinates;
  const earthRadius = 6378137;
  const lng = (x / earthRadius) * (180 / Math.PI);
  const lat =
    (2 * Math.atan(Math.exp(y / earthRadius)) - Math.PI / 2) * (180 / Math.PI);
  const name =
    feature.properties.DescriptionLocalisationEn ||
    feature.properties.DescriptionLocalisationFr ||
    "Québec camera";

  if (isValidCoordinate(lat, lng)) {
    records.push(
      createCamera("quebec", {
        id: `quebec-${feature.properties.IDEcamera}`,
        name,
        lat,
        lng,
        feedType: "live-video",
        previewUrl: `https://www.quebec511.info/Carte/Fenetres/camera.ashx?id=${feature.properties.IDEcamera}&format=mp4`,
        metadata: metadata(["Provider", "Québec 511"]),
      }),
    );
  }
});

(bcMockData || []).forEach((camera) => {
  const lat = parseFloat(camera.latitude);
  const lng = parseFloat(camera.longitude);
  const cameraId = camera.id;

  if (isValidCoordinate(lat, lng) && cameraId) {
    records.push(
      createCamera("bc", {
        id: `bc-${cameraId}`,
        name: camera.camName || "DriveBC camera",
        lat,
        lng,
        feedType: "current-frame",
        previewUrl: `https://www.drivebc.ca/images/${cameraId}.jpg`,
        metadata: metadata(["Roadway", camera.roadway || "British Columbia highway"]),
      }),
    );
  }
});

(londonData || []).forEach((camera, index) => {
  const videoUrl = camera.additionalProperties?.find(
    (property) => property.key === "videoUrl",
  )?.value;
  const imageUrl = camera.additionalProperties?.find(
    (property) => property.key === "imageUrl",
  )?.value;
  const lat = parseFloat(camera.lat);
  const lng = parseFloat(camera.lon);

  if (isValidCoordinate(lat, lng) && (videoUrl || imageUrl)) {
    records.push(
      createCamera("london", {
        id: `london-${camera.id || index}`,
        name: camera.commonName || "London traffic camera",
        lat,
        lng,
        feedType: videoUrl ? "live-video" : "current-frame",
        previewUrl: videoUrl || imageUrl,
        previewFallbackUrl: videoUrl && imageUrl ? imageUrl : null,
        lastUpdated: camera.modified || camera.lastUpdated || camera.updated,
        metadata: metadata(["View", camera.commonName]),
      }),
    );
  }
});

(californiaData.data || []).forEach((item) => {
  const cctv = item.cctv;
  const location = cctv?.location;
  const imageUrl = cctv?.imageData?.static?.currentImageURL;
  const lat = parseFloat(location?.latitude);
  const lng = parseFloat(location?.longitude);

  if (isValidCoordinate(lat, lng) && imageUrl && cctv.inService === "true") {
    records.push(
      createCamera("california", {
        id: `california-${cctv.index}`,
        name: location.locationName || "California highway camera",
        lat,
        lng,
        feedType: "current-frame",
        previewUrl: imageUrl,
        lastUpdated: cctv.recordTimestamp
          ? `${cctv.recordTimestamp.recordDate} ${cctv.recordTimestamp.recordTime}`
          : undefined,
        metadata: metadata(
          ["Nearby", location.nearbyPlace],
          ["County", location.county],
          ["Route", `${location.route || ""} ${location.direction || ""}`.trim()],
        ),
      }),
    );
  }
});

(sydneyData.features || []).forEach((feature, index) => {
  const [lng, lat] = feature.geometry.coordinates;
  const properties = feature.properties;

  if (isValidCoordinate(lat, lng) && properties.href) {
    records.push(
      createCamera("sydney", {
        id: `sydney-${feature.id || index}`,
        name: properties.title || "Sydney traffic camera",
        lat,
        lng,
        feedType: "current-frame",
        previewUrl: properties.href,
        metadata: metadata(["View", properties.view]),
      }),
    );
  }
});

(chicagoData.features || []).forEach((camera) => {
  const attributes = camera.attributes;
  const geometry = camera.geometry;
  const lat = parseFloat(geometry?.y);
  const lng = parseFloat(geometry?.x);
  const rawImageUrl = attributes?.SnapShot;

  if (isValidCoordinate(lat, lng) && rawImageUrl) {
    records.push(
      createCamera("illinois", {
        id: `illinois-${attributes.OBJECTID}`,
        name: attributes.CameraLocation || "Chicago traffic camera",
        lat,
        lng,
        feedType: "current-frame",
        previewUrl: proxyImageUrl(rawImageUrl, "Feed+Offline"),
        metadata: metadata(
          ["Direction", attributes.CameraDirection],
          ["Age", attributes.AgeInMinutes ? `${attributes.AgeInMinutes}m ago` : null],
        ),
      }),
    );
  }
});

(yorkData.features || []).forEach((feature) => {
  const properties = feature.properties;
  const [lng, lat] = feature.geometry?.coordinates || [];

  if (isValidCoordinate(lat, lng) && properties.photo) {
    records.push(
      createCamera("york", {
        id: `york-${properties.FACILITYID}`,
        name: properties.cameralocation || "York Region camera",
        lat,
        lng,
        feedType: "current-frame",
        previewUrl: proxyImageUrl(properties.photo, "York+Feed+Offline"),
        metadata: metadata(["Intersection ID", properties.FACILITYID]),
      }),
    );
  }
});

(alertWestData || []).forEach((camera) => {
  const { name, source, siteId, lat, lng, state, county } = camera;

  if (isValidCoordinate(lat, lng) && name) {
    records.push(
      createCamera("alertwest", {
        id: `alertwest-${siteId || name}`,
        name: (source || name).replace(/_/g, " "),
        lat,
        lng,
        feedType: "current-frame",
        previewUrl: `https://alertwest.live/api/firecams/v0/currentimage?name=${encodeURIComponent(name)}`,
        metadata: metadata(
          ["State", state],
          ["County", county],
        ),
      }),
    );
  }
});

(finlandData || []).forEach((station) => {
  const { stationId, name, lat, lng, presets } = station;

  if (!isValidCoordinate(lat, lng) || !Array.isArray(presets)) return;

  presets.forEach((presetId, index) => {
    if (!presetId) return;
    records.push(
      createCamera("finland", {
        id: `finland-${presetId}`,
        name: `${(name || stationId).replace(/_/g, " ")} · view ${index + 1}`,
        lat,
        lng,
        feedType: "current-frame",
        previewUrl: `https://weathercam.digitraffic.fi/${presetId}.jpg`,
        metadata: metadata(["Station", stationId]),
      }),
    );
  });
});

(nztaData || []).forEach((camera) => {
  const { objectId, name, lat, lng, imageUrl, direction, region, description } = camera;

  if (isValidCoordinate(lat, lng) && imageUrl) {
    records.push(
      createCamera("nzta", {
        id: `nzta-${objectId}`,
        name: name || "New Zealand traffic camera",
        lat,
        lng,
        feedType: "current-frame",
        previewUrl: proxyImageUrl(imageUrl),
        metadata: metadata(
          ["Direction", direction],
          ["Region", region],
          ["View", description],
        ),
      }),
    );
  }
});

(wsdotData || []).forEach((camera) => {
  const { objectId, name, lat, lng, imageUrl, direction } = camera;

  if (isValidCoordinate(lat, lng) && imageUrl) {
    records.push(
      createCamera("wsdot", {
        id: `wsdot-${objectId}`,
        name: name || "Washington traffic camera",
        lat,
        lng,
        feedType: "current-frame",
        previewUrl: imageUrl,
        metadata: metadata(["Direction", direction]),
      }),
    );
  }
});

(iowaData || []).forEach((camera) => {
  const { deviceId, name, lat, lng, imageUrl } = camera;

  if (isValidCoordinate(lat, lng) && imageUrl) {
    records.push(
      createCamera("iowa", {
        id: `iowa-${deviceId}`,
        name: name || "Iowa traffic camera",
        lat,
        lng,
        feedType: "current-frame",
        previewUrl: imageUrl,
      }),
    );
  }
});

(austinData || []).forEach((camera) => {
  const { cameraId, locationName, lat, lng, screenshotAddress } = camera;

  if (isValidCoordinate(lat, lng) && screenshotAddress) {
    records.push(
      createCamera("austin", {
        id: `austin-${cameraId}`,
        name: (locationName || "Austin traffic camera").trim(),
        lat,
        lng,
        feedType: "current-frame",
        previewUrl: screenshotAddress,
      }),
    );
  }
});

(oregonData || []).forEach((camera) => {
  const { cameraId, title, lat, lng, imageUrl } = camera;

  if (isValidCoordinate(lat, lng) && imageUrl) {
    records.push(
      createCamera("oregon", {
        id: `oregon-${cameraId}`,
        name: title || "Oregon highway camera",
        lat,
        lng,
        feedType: "current-frame",
        previewUrl: imageUrl,
      }),
    );
  }
});

(newfoundlandData || []).forEach((camera) => {
  const { objectId, location, lat, lng, imageUrl } = camera;

  if (isValidCoordinate(lat, lng) && imageUrl) {
    records.push(
      createCamera("newfoundland", {
        id: `newfoundland-${objectId}`,
        name: location || "Newfoundland & Labrador highway camera",
        lat,
        lng,
        feedType: "current-frame",
        previewUrl: imageUrl,
      }),
    );
  }
});

(floridaData || []).forEach((camera) => {
  const { objectId, description, lat, lng, imageUrl, county, highway, direction } = camera;

  if (isValidCoordinate(lat, lng) && imageUrl) {
    records.push(
      createCamera("florida", {
        id: `florida-${objectId}`,
        name: description || "Florida traffic camera",
        lat,
        lng,
        feedType: "current-frame",
        previewUrl: imageUrl,
        metadata: metadata(
          ["County", county],
          ["Highway", highway],
          ["Direction", direction],
        ),
      }),
    );
  }
});

(michiganData || []).forEach((camera) => {
  const { objectId, route, location, lat, lng, imageUrl, county, direction } = camera;

  if (isValidCoordinate(lat, lng) && imageUrl) {
    records.push(
      createCamera("michigan", {
        id: `michigan-${objectId}`,
        name: `${route || ""}${location || ""}`.trim() || "Michigan traffic camera",
        lat,
        lng,
        feedType: "current-frame",
        previewUrl: imageUrl,
        metadata: metadata(
          ["County", county],
          ["Direction", direction],
        ),
      }),
    );
  }
});

(salemData || []).forEach((camera) => {
  const { objectId, intersection, lat, lng, imageUrl, agency, camType } = camera;

  if (isValidCoordinate(lat, lng) && imageUrl) {
    records.push(
      createCamera("salem", {
        id: `salem-${objectId}`,
        name: intersection || "Salem traffic camera",
        lat,
        lng,
        feedType: "current-frame",
        previewUrl: imageUrl,
        metadata: metadata(
          ["Agency", agency],
          ["Type", camType],
        ),
      }),
    );
  }
});

(hawaiiData || []).forEach((camera) => {
  const { objectId, description, lat, lng, imageUrl } = camera;

  if (isValidCoordinate(lat, lng) && imageUrl) {
    records.push(
      createCamera("hawaii", {
        id: `hawaii-${objectId}`,
        name: description || "Hawaii traffic camera",
        lat,
        lng,
        feedType: "current-frame",
        previewUrl: imageUrl.replace(/^http:/i, "https:"),
      }),
    );
  }
});

(seattleData || []).forEach((camera) => {
  const { objectId, location, lat, lng, imageUrl, ownership } = camera;

  if (isValidCoordinate(lat, lng) && imageUrl) {
    records.push(
      createCamera("seattle", {
        id: `seattle-${objectId}`,
        name: location || "Seattle traffic camera",
        lat,
        lng,
        feedType: "current-frame",
        previewUrl: proxyImageUrl(imageUrl),
        metadata: metadata(["Owner", ownership]),
      }),
    );
  }
});

(utahData || []).forEach((camera) => {
  const { objectId, displayName, lat, lng, imageUrl, direction } = camera;

  if (isValidCoordinate(lat, lng) && imageUrl) {
    records.push(
      createCamera("utah", {
        id: `utah-${objectId}`,
        name: displayName || "Utah traffic camera",
        lat,
        lng,
        feedType: "current-frame",
        previewUrl: imageUrl.replace(/^http:/i, "https:"),
        metadata: metadata(["Direction", direction]),
      }),
    );
  }
});

(geonetVolcanoData || []).forEach((camera) => {
  const { objectId, name, lat, lng, imageUrl } = camera;

  if (isValidCoordinate(lat, lng) && imageUrl) {
    records.push(
      createCamera("geonetVolcano", {
        id: `geonet-${objectId}`,
        name: name || "GeoNet volcano webcam",
        lat,
        lng,
        feedType: "current-frame",
        previewUrl: imageUrl.replace(/^http:/i, "https:"),
      }),
    );
  }
});

(arlingtonData || []).forEach((camera) => {
  const { objectId, cameraLocation, lat, lng, imageUrl, description } = camera;

  if (isValidCoordinate(lat, lng) && imageUrl) {
    records.push(
      createCamera("arlington", {
        id: `arlington-${objectId}`,
        name: cameraLocation || "Arlington traffic camera",
        lat,
        lng,
        feedType: "current-frame",
        previewUrl: imageUrl,
        metadata: metadata(["Notes", description]),
      }),
    );
  }
});

export const cameraRecords = records;

export const sourceCounts = cameraRecords.reduce((counts, camera) => {
  counts[camera.sourceId] = (counts[camera.sourceId] || 0) + 1;
  return counts;
}, Object.fromEntries(cameraSourceCatalog.map((source) => [source.id, 0])));

export const totalCameraCount = cameraRecords.length;

export const groupedSources = cameraSourceCatalog.reduce((groups, source) => {
  const group = groups.find((item) => item.name === source.group);
  if (group) {
    group.sources.push(source);
  } else {
    groups.push({ name: source.group, sources: [source] });
  }
  return groups;
}, []);

export const matchesCategory = (camera, category) => {
  if (category === "all") return true;
  if (category === "video") {
    return camera.feedType === "live-video" || camera.feedType === "youtube";
  }
  return camera.category === category;
};

export const feedTypeLabel = (feedType) => {
  if (feedType === "youtube") return "Live stream";
  if (feedType === "live-video") return "Live video";
  return "Current frame";
};
