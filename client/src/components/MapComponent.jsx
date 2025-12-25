import React, { useMemo, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '0.5rem'
};

const defaultCenter = {
  lat: -1.2921,
  lng: 36.8219
};

const mapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  styles: [
    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
    {
      featureType: "administrative.locality",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "poi",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "poi.park",
      elementType: "geometry",
      stylers: [{ color: "#263c3f" }],
    },
    {
      featureType: "poi.park",
      elementType: "labels.text.fill",
      stylers: [{ color: "#6b9a76" }],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#38414e" }],
    },
    {
      featureType: "road",
      elementType: "geometry.stroke",
      stylers: [{ color: "#212a37" }],
    },
    {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [{ color: "#9ca5b3" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [{ color: "#746855" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [{ color: "#1f2835" }],
    },
    {
      featureType: "road.highway",
      elementType: "labels.text.fill",
      stylers: [{ color: "#f3d19c" }],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#17263c" }],
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [{ color: "#515c6d" }],
    },
    {
      featureType: "water",
      elementType: "labels.text.stroke",
      stylers: [{ color: "#17263c" }],
    },
  ]
};

const MapComponent = ({ detections }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "" // Leave empty for demo or user to fill
  });

  const [selectedDetection, setSelectedDetection] = React.useState(null);
  const mapRef = React.useRef(null);

  const activeDetections = useMemo(() => {
    // Only show recent detections (last 2 mins) on map to avoid clutter
    const now = new Date();
    return detections.filter(d => (now - new Date(d.timestamp)) < 120000);
  }, [detections]);

  // Fit map bounds to all detection points
  useEffect(() => {
    if (mapRef.current && activeDetections.length > 0 && isLoaded) {
      const bounds = new window.google.maps.LatLngBounds();
      
      activeDetections.forEach(detection => {
        bounds.extend(new window.google.maps.LatLng(detection.location.lat, detection.location.lng));
      });

      // Fit map to bounds with generous padding for better visibility
      mapRef.current.fitBounds(bounds, { top: 80, right: 80, bottom: 80, left: 80 });
    } else if (mapRef.current && isLoaded && activeDetections.length === 0) {
      // If no detections, center on default location
      mapRef.current.setCenter(defaultCenter);
      mapRef.current.setZoom(12);
    }
  }, [activeDetections, isLoaded]);

  if (!isLoaded) return (
    <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-full border-4 border-slate-700 border-t-blue-500 animate-spin"></div>
        <p className="text-slate-400 text-sm font-medium">Loading map...</p>
      </div>
    </div>
  );

  return (
    <GoogleMap
      onLoad={(mapInstance) => {
        mapRef.current = mapInstance;
        // Initial fit will be handled by useEffect
        if (activeDetections.length === 0) {
          mapInstance.setCenter(defaultCenter);
          mapInstance.setZoom(14);
        }
      }}
      mapContainerStyle={containerStyle}
      center={defaultCenter}
      zoom={14}
      options={mapOptions}
    >
      {activeDetections.map((detection) => (
        <Marker
          key={detection.id}
          position={detection.location}
          onClick={() => setSelectedDetection(detection)}
          icon={{
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: detection.riskLevel === 'CRITICAL' ? '#EF4444' : (detection.riskLevel === 'High' ? '#F59E0B' : '#10B981'),
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: '#FFFFFF',
          }}
        />
      ))}

      {selectedDetection && (
        <InfoWindow
          position={selectedDetection.location}
          onCloseClick={() => setSelectedDetection(null)}
        >
          <div className="text-black p-1">
            <h3 className="font-bold text-lg">{selectedDetection.animal}</h3>
            <p>Confidence: {(selectedDetection.confidence * 100).toFixed(1)}%</p>
            <p className="text-xs text-gray-500">{new Date(selectedDetection.timestamp).toLocaleTimeString()}</p>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
};

export default React.memo(MapComponent);
