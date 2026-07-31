import { useCallback, useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster";

import {
  cameraRecords,
  cameraSourceCatalog,
  feedTypeLabel,
  groupedSources,
  matchesCategory,
  sourceCounts,
  totalCameraCount,
} from "./cameraModel";

const DEFAULT_MAP_VIEW = [24, -20];
const DEFAULT_MAP_ZOOM = 2;

const formatCount = (value) => new Intl.NumberFormat("en-US").format(value);

const addCacheBuster = (url, tick) => {
  if (!url || url.includes("youtube.com/embed")) return url;
  return `${url}${url.includes("?") ? "&" : "?"}t=${tick}`;
};

function FeedPreview({ camera, refreshTick, hasError, onError, onFallback, usingFallback }) {
  const previewUrl = usingFallback ? camera.previewFallbackUrl : camera.previewUrl;

  if (hasError || !previewUrl) {
    return (
      <div className="feed-placeholder" role="img" aria-label="Camera feed unavailable">
        <span className="feed-placeholder-icon">!</span>
        <strong>Feed unavailable</strong>
        <span>Camera details are still available.</span>
      </div>
    );
  }

  if (camera.feedType === "youtube") {
    return (
      <iframe
        className="feed-media"
        src={camera.previewUrl}
        title={`${camera.name} live stream`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  if (camera.feedType === "live-video" && !usingFallback) {
    return (
      <video
        key={`${camera.id}-${refreshTick}`}
        className="feed-media"
        src={addCacheBuster(previewUrl, refreshTick)}
        autoPlay
        loop
        muted
        playsInline
        onError={() => (camera.previewFallbackUrl ? onFallback() : onError())}
      />
    );
  }

  return (
    <img
      className="feed-media"
      src={addCacheBuster(previewUrl, refreshTick)}
      alt={`${camera.name} camera feed`}
      onError={onError}
    />
  );
}

function CameraDetail({ camera, hasError, refreshTick, usingFallback, onClose, onFeedError, onFeedFallback }) {
  const detailRef = useRef(null);
  const statusLabel = hasError
    ? "Feed unavailable"
      : usingFallback
      ? "Current frame"
      : feedTypeLabel(camera.feedType);

  useEffect(() => {
    detailRef.current?.focus();
  }, [camera.id]);

  return (
    <aside
      ref={detailRef}
      className="camera-detail"
      role="dialog"
      tabIndex="-1"
      aria-labelledby={`camera-title-${camera.id}`}
    >
      <div className="detail-header">
        <div>
          <p className="detail-kicker">Selected feed</p>
          <h2 id={`camera-title-${camera.id}`}>{camera.name}</h2>
        </div>
        <button className="icon-button" type="button" onClick={onClose} aria-label="Close camera details">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>

      <div className="detail-source">
        <span className="source-swatch" style={{ backgroundColor: camera.accent }} />
        <span>{camera.sourceLabel}</span>
      </div>

      <div className="detail-feed">
        <FeedPreview
          camera={camera}
          refreshTick={refreshTick}
          hasError={hasError}
          onError={onFeedError}
          onFallback={onFeedFallback}
          usingFallback={usingFallback}
        />
      </div>

      <div className={`feed-status ${hasError ? "is-offline" : ""}`}>
        <span className="status-dot" aria-hidden="true" />
        <strong>{statusLabel}</strong>
        {!hasError && camera.feedType !== "youtube" && (
          <span className="feed-status-time">
            {camera.lastUpdated || `Refreshed ${new Date(refreshTick).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`}
          </span>
        )}
      </div>

      {camera.metadata?.length > 0 && (
        <dl className="detail-metadata">
          {camera.metadata.map(({ label, value }) => (
            <div key={`${camera.id}-${label}`}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      )}

      <div className="detail-footer">
        <span>Public source</span>
        <span className="detail-coordinates">
          {camera.lat.toFixed(3)}, {camera.lng.toFixed(3)}
        </span>
      </div>
    </aside>
  );
}

function CategoryFilters({ activeCategory, onChange }) {
  const categories = [
    ["all", "All feeds"],
    ["traffic", "Traffic"],
    ["highway", "Highway"],
    ["nature", "Nature"],
    ["video", "Video"],
  ];

  return (
    <div className="filter-group" aria-label="Feed category filters">
      {categories.map(([value, label]) => (
        <button
          className={`filter-chip ${activeCategory === value ? "is-active" : ""}`}
          key={value}
          type="button"
          aria-pressed={activeCategory === value}
          onClick={() => onChange(value)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function ExplorerPanel({
  activeCategory,
  activeSources,
  isOpen,
  matchingCameras,
  isMapReady,
  onCategoryChange,
  onClose,
  onSelectCamera,
  onSearchChange,
  onShowMore,
  onSourceToggle,
  resultLimit,
  searchQuery,
  visibleCameraCount,
}) {
  const hasQuery = searchQuery.trim().length > 0;

  return (
    <aside className={`explorer-panel ${isOpen ? "is-open" : ""}`} aria-label="Explore cameras">
      <div className="panel-heading">
        <div>
          <p className="panel-kicker">Explore the network</p>
          <h1>Find a camera</h1>
        </div>
        <button className="panel-close" type="button" onClick={onClose} aria-label="Close explore panel">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>

      <label className="panel-search">
        <span className="search-icon" aria-hidden="true" />
        <span className="sr-only">Search cameras</span>
        <input
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search city, road, or camera"
          type="search"
        />
        {searchQuery && (
          <button className="search-clear" type="button" onClick={() => onSearchChange("")} aria-label="Clear search">
            &times;
          </button>
        )}
      </label>

      <div className="panel-scroll">
        <div className="panel-summary" aria-live="polite">
          <div>
            <strong>{formatCount(visibleCameraCount)}</strong>
            <span>feeds visible</span>
          </div>
          <span className={`summary-status ${isMapReady ? "" : "is-loading"}`}>
            <span className="status-dot" />
            {isMapReady ? "Sources loaded" : "Loading map"}
          </span>
        </div>

        <CategoryFilters activeCategory={activeCategory} onChange={onCategoryChange} />

        {hasQuery ? (
          <section className="results-section" aria-label="Search results">
            <div className="section-heading">
              <span>Matching cameras</span>
              <span>{formatCount(matchingCameras.length)}</span>
            </div>
            {matchingCameras.length > 0 ? (
              <div className="camera-results">
                {matchingCameras.slice(0, resultLimit).map((camera) => (
                  <button
                    className="camera-result"
                    key={camera.id}
                    type="button"
                    onClick={() => onSelectCamera(camera)}
                  >
                    <span className="result-marker" style={{ backgroundColor: camera.accent }} />
                    <span className="result-copy">
                      <strong>{camera.name}</strong>
                      <span>{camera.sourceLabel}</span>
                    </span>
                    <span className="result-arrow" aria-hidden="true">&rarr;</span>
                  </button>
                ))}
                {matchingCameras.length > resultLimit && (
                  <button className="load-more" type="button" onClick={onShowMore}>
                    Show more results
                    <span>{formatCount(matchingCameras.length - resultLimit)} remaining</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="empty-state">
                <strong>No cameras found</strong>
                <span>Try a city, road, or region name.</span>
              </div>
            )}
          </section>
        ) : (
          <div className="search-prompt">
            <span className="prompt-icon" aria-hidden="true">+</span>
            <span>Search across public camera feeds or browse by region below.</span>
          </div>
        )}

        <section className="regions-section" aria-label="Camera regions">
          <div className="section-heading">
            <span>Browse by region</span>
            <span>{cameraSourceCatalog.length} sources</span>
          </div>

          {groupedSources.map((group) => (
            <div className="source-group" key={group.name}>
              <p className="source-group-title">{group.name}</p>
              {group.sources.map((source) => {
                const enabled = activeSources[source.id];
                return (
                  <button
                    className={`region-row ${enabled ? "is-enabled" : "is-muted"}`}
                    key={source.id}
                    type="button"
                    aria-pressed={enabled}
                    onClick={() => onSourceToggle(source.id)}
                  >
                    <span className="source-swatch" style={{ backgroundColor: source.accent }} />
                    <span className="region-copy">
                      <strong>{source.label}</strong>
                      <span>{source.category === "nature" ? "Nature" : source.category === "highway" ? "Highway cameras" : "Traffic cameras"}</span>
                    </span>
                    <span className="region-count">{formatCount(sourceCounts[source.id])}</span>
                    <span className={`toggle-indicator ${enabled ? "is-on" : ""}`} aria-hidden="true" />
                  </button>
                );
              })}
            </div>
          ))}
        </section>
      </div>

      <div className="panel-footer">
        <span>Public camera sources</span>
        <span>Auto-refresh 15s</span>
      </div>
    </aside>
  );
}

export default function App() {
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);
  const markerRefs = useRef(new Map());
  const layerGroups = useRef(new Map());
  const selectCameraRef = useRef(() => {});
  const returnFocusRef = useRef(null);

  const [activeCategory, setActiveCategory] = useState("all");
  const [activeSources, setActiveSources] = useState(() =>
    Object.fromEntries(cameraSourceCatalog.map((source) => [source.id, true])),
  );
  const [isExplorerOpen, setIsExplorerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [feedErrors, setFeedErrors] = useState({});
  const [feedFallbacks, setFeedFallbacks] = useState({});
  const [resultLimit, setResultLimit] = useState(12);
  const [isMapReady, setIsMapReady] = useState(false);
  const [refreshTick, setRefreshTick] = useState(() => Date.now());

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const visibleCameras = cameraRecords.filter((camera) => {
    const sourceEnabled = activeSources[camera.sourceId];
    const categoryMatches = matchesCategory(camera, activeCategory);
    const queryMatches = !normalizedQuery || camera.searchText.includes(normalizedQuery);
    return sourceEnabled && categoryMatches && queryMatches;
  });

  const selectCamera = useCallback((camera) => {
    if (document.activeElement instanceof HTMLElement) {
      returnFocusRef.current = document.activeElement;
    }
    setSelectedCamera(camera);
    setIsExplorerOpen(false);
    setRefreshTick(Date.now());
    setFeedErrors((current) => {
      if (!current[camera.id]) return current;
      const next = { ...current };
      delete next[camera.id];
      return next;
    });
    setFeedFallbacks((current) => {
      if (!current[camera.id]) return current;
      const next = { ...current };
      delete next[camera.id];
      return next;
    });

    if (mapInstance.current) {
      const currentZoom = mapInstance.current.getZoom();
      mapInstance.current.flyTo([camera.lat, camera.lng], Math.max(currentZoom, 10), {
        duration: 0.6,
      });
    }
  }, []);

  useEffect(() => {
    selectCameraRef.current = selectCamera;
  }, [selectCamera]);

  useEffect(() => {
    if (!mapContainer.current || mapInstance.current) return undefined;

    const markers = markerRefs.current;
    const layers = layerGroups.current;

    const map = L.map(mapContainer.current, {
      zoomControl: false,
      worldCopyJump: true,
    }).setView(DEFAULT_MAP_VIEW, DEFAULT_MAP_ZOOM);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map);

    const clusterOptions = {
      maxClusterRadius: 52,
      disableClusteringAtZoom: 13,
      showCoverageOnHover: false,
      iconCreateFunction: (cluster) =>
        L.divIcon({
          className: "canopy-cluster",
          html: `<span>${cluster.getChildCount()}</span>`,
          iconSize: [38, 38],
        }),
    };

    cameraSourceCatalog.forEach((source) => {
      const group = L.markerClusterGroup(clusterOptions).addTo(map);
      layers.set(source.id, group);
    });

    cameraRecords.forEach((camera) => {
      const layer = layers.get(camera.sourceId);
      if (!layer) return;

      const marker = L.marker([camera.lat, camera.lng], {
        icon: sourceMapIcon(camera.sourceId),
        title: camera.name,
      });

      marker.on("click", () => selectCameraRef.current(camera));
      layer.addLayer(marker);
      markers.set(camera.id, marker);
    });

    mapInstance.current = map;
    const readyFrame = window.requestAnimationFrame(() => setIsMapReady(true));

    return () => {
      window.cancelAnimationFrame(readyFrame);
      map.remove();
      mapInstance.current = null;
      markers.clear();
      layers.clear();
    };
  }, []);

  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;

    cameraRecords.forEach((camera) => {
      const layer = layerGroups.current.get(camera.sourceId);
      const marker = markerRefs.current.get(camera.id);
      if (!layer || !marker) return;

      const sourceEnabled = activeSources[camera.sourceId];
      const categoryMatches = matchesCategory(camera, activeCategory);
      const queryMatches = !normalizedQuery || camera.searchText.includes(normalizedQuery);
      const visible = sourceEnabled && categoryMatches && queryMatches;

      if (visible && !layer.hasLayer(marker)) layer.addLayer(marker);
      if (!visible && layer.hasLayer(marker)) layer.removeLayer(marker);
    });
  }, [activeCategory, activeSources, normalizedQuery]);

  useEffect(() => {
    if (!selectedCamera || selectedCamera.feedType === "youtube") return undefined;

    const interval = window.setInterval(() => {
      setFeedErrors((current) => {
        if (!current[selectedCamera.id]) return current;
        const next = { ...current };
        delete next[selectedCamera.id];
        return next;
      });
      setRefreshTick(Date.now());
    }, 15000);
    return () => window.clearInterval(interval);
  }, [selectedCamera]);

  useEffect(() => {
    if (!mapInstance.current) return undefined;

    const frame = window.requestAnimationFrame(() => mapInstance.current?.invalidateSize());
    return () => window.cancelAnimationFrame(frame);
  }, [isExplorerOpen, selectedCamera]);

  const toggleSource = (sourceId) => {
    const nextValue = !activeSources[sourceId];
    setActiveSources((current) => ({
      ...current,
      [sourceId]: !current[sourceId],
    }));

    if (selectedCamera?.sourceId === sourceId && !nextValue) {
      setSelectedCamera(null);
    }
    setResultLimit(12);
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setResultLimit(12);
    if (selectedCamera && !matchesCategory(selectedCamera, category)) {
      setSelectedCamera(null);
    }
  };

  const handleSearchChange = (value) => {
    const nextQuery = value.trim().toLowerCase();
    setSearchQuery(value);
    setResultLimit(12);
    if (selectedCamera && nextQuery && !selectedCamera.searchText.includes(nextQuery)) {
      setSelectedCamera(null);
    }
  };

  const handleFeedError = () => {
    if (!selectedCamera) return;
    setFeedErrors((current) => ({ ...current, [selectedCamera.id]: true }));
  };

  const handleFeedFallback = () => {
    if (!selectedCamera) return;
    setFeedFallbacks((current) => ({ ...current, [selectedCamera.id]: true }));
  };

  const closeSelectedCamera = () => {
    setSelectedCamera(null);
    window.requestAnimationFrame(() => {
      const previousFocus = returnFocusRef.current;
      if (previousFocus && document.contains(previousFocus)) {
        previousFocus.focus();
      } else if (window.matchMedia("(max-width: 680px)").matches) {
        document.querySelector(".mobile-explore-toggle")?.focus();
      } else {
        mapContainer.current?.focus();
      }
    });
  };

  return (
    <div className={`app-shell ${selectedCamera ? "has-detail" : ""}`}>
      <div ref={mapContainer} className="map-canvas" tabIndex="-1" aria-label="Global camera map" />

      <header className="topbar">
        <div className="brand-lockup">
          <span className="brand-mark">CS</span>
          <span className="brand-copy">
            <strong>CanSpy</strong>
            <span>Global camera explorer</span>
          </span>
        </div>

        <label className="topbar-search">
          <span className="search-icon" aria-hidden="true" />
          <span className="sr-only">Search the camera network</span>
          <input
            value={searchQuery}
            onChange={(event) => handleSearchChange(event.target.value)}
            onFocus={() => setIsExplorerOpen(true)}
            placeholder="Search city, road, or camera"
            type="search"
          />
          <kbd>/</kbd>
        </label>

        <div className="topbar-meta">
          <span className="source-status"><span className="status-dot" />Sources loaded</span>
          <span>{formatCount(totalCameraCount)} public feeds</span>
        </div>
      </header>

      <ExplorerPanel
        activeCategory={activeCategory}
        activeSources={activeSources}
        isOpen={isExplorerOpen}
        isMapReady={isMapReady}
        matchingCameras={visibleCameras}
        onCategoryChange={handleCategoryChange}
        onClose={() => setIsExplorerOpen(false)}
        onSelectCamera={selectCamera}
        onSearchChange={handleSearchChange}
        onShowMore={() => setResultLimit((limit) => limit + 12)}
        onSourceToggle={toggleSource}
        resultLimit={resultLimit}
        searchQuery={searchQuery}
        visibleCameraCount={visibleCameras.length}
      />

      <button
        className="mobile-explore-toggle"
        type="button"
        aria-expanded={isExplorerOpen}
        onClick={() => setIsExplorerOpen((open) => !open)}
      >
        <span className="toggle-menu-icon" aria-hidden="true">=</span>
        Explore cameras
        <span className="toggle-count">{formatCount(visibleCameras.length)}</span>
      </button>

      <div className="map-actions" aria-label="Map controls">
        <button type="button" onClick={() => mapInstance.current?.zoomIn()} aria-label="Zoom in">+</button>
        <button type="button" onClick={() => mapInstance.current?.zoomOut()} aria-label="Zoom out">&minus;</button>
        <span className="map-actions-divider" />
        <button className="reset-map" type="button" onClick={() => mapInstance.current?.flyTo(DEFAULT_MAP_VIEW, DEFAULT_MAP_ZOOM)}>
          Reset view
        </button>
      </div>

      <div className="map-status">
        <span className="status-dot" />
        <span>Global view</span>
        <span className="map-status-divider">/</span>
        <strong>{formatCount(visibleCameras.length)} feeds</strong>
      </div>

      {selectedCamera && (
        <CameraDetail
          camera={selectedCamera}
          hasError={Boolean(feedErrors[selectedCamera.id])}
          usingFallback={Boolean(feedFallbacks[selectedCamera.id])}
          refreshTick={refreshTick}
          onClose={closeSelectedCamera}
          onFeedError={handleFeedError}
          onFeedFallback={handleFeedFallback}
        />
      )}
    </div>
  );
}

const sourceIcons = new Map(cameraSourceCatalog.map((source) => [source.id, source.icon]));

function sourceMapIcon(sourceId) {
  return sourceIcons.get(sourceId);
}
