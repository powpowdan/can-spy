# Project: Ottawa Traffic Spy
-- **Core Goal**: Map all City of Ottawa traffic cameras along a user-defined route. and view the cameras along the route in order
- **Tech Stack**: React 19, Vite, Vanilla Leaflet (direct L.map calls).
 
- **Rules**:  
  - Data Source: http://traffic.ottawa.ca/map/service/camera
  - Always check for existing map instances before initializing to avoid "Map already initialized" errors.

  # Ottawa Traffic Spy Context
- **API Endpoint**: http://traffic.ottawa.ca/map/service/camera
- **Image URL Pattern**: https://traffic.ottawa.ca/map/cameraWindow?id=[camera_number]
- **Data Structure**: The API returns an array of objects. Key fields: `latitude`, `longitude`, `type`, `camera_number`, `description`.
- **Logic**: 
  - Filter for `type: "camera"`.
  - On marker click, open a popup showing the camera description and an `<img>` tag pointing to the Image URL.

  - **Data Fetching**: All API calls must be wrapped in a `useEffect` with an empty dependency array `[]`. Do NOT fetch data inside the map move/zoom events to prevent spamming the server.
  When creating the popup content, use an <iframe> or a styled <div> to wrap the camera window URL, as it often contains the live-refreshing image from the city's feed.