import React, { useMemo } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '0.5rem'
};

const center = {
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

  const activeDetections = useMemo(() => {
    // Only show recent detections (last 2 mins) on map to avoid clutter
    const now = new Date();
    return detections.filter(d => (now - new Date(d.timestamp)) < 120000);
  }, [detections]);

  if (!isLoaded) return <div className="w-full h-full bg-slate-800 animate-pulse rounded-lg flex items-center justify-center text-slate-500">Loading Map...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
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
