"use client";

import { useEffect, useRef, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet's default marker icon paths broken under Next.js bundler
type IconDefaultWithPrivate = L.Icon.Default & { _getIconUrl?: () => string };
delete (L.Icon.Default.prototype as IconDefaultWithPrivate)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function RecenterMap({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], map.getZoom());
  }, [lat, lng, map]);
  return null;
}

interface ShowroomGeofenceMapInnerProps {
  lat: number;
  lng: number;
  radiusMeters: number;
  onPositionChange: (lat: number, lng: number) => void;
}

export default function ShowroomGeofenceMapInner({
  lat,
  lng,
  radiusMeters,
  onPositionChange,
}: ShowroomGeofenceMapInnerProps) {
  const markerRef = useRef<L.Marker>(null);

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const newPos = marker.getLatLng();
          onPositionChange(
            Number(newPos.lat.toFixed(7)),
            Number(newPos.lng.toFixed(7))
          );
        }
      },
    }),
    [onPositionChange]
  );

  return (
    <div className="relative w-full h-[420px] rounded-xl overflow-hidden border border-line shadow-xs">
      <MapContainer
        center={[lat, lng]}
        zoom={16}
        scrollWheelZoom={true}
        className="w-full h-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <RecenterMap lat={lat} lng={lng} />

        <Marker
          draggable={true}
          eventHandlers={eventHandlers}
          position={[lat, lng]}
          ref={markerRef}
        />

        <Circle
          center={[lat, lng]}
          radius={radiusMeters}
          pathOptions={{
            color: "#0284c7",
            fillColor: "#0284c7",
            fillOpacity: 0.18,
            weight: 2,
          }}
        />
      </MapContainer>
    </div>
  );
}
