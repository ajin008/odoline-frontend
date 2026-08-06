/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useConfig } from "../hooks/use-config";
import { useUpdateGeofence } from "../hooks/use-update-geofence";
import { MapPin, Locate, Save, Loader2, Compass } from "lucide-react";
import { toast } from "sonner";

// Default fallback coordinates if showroom geofence has not been set yet
const DEFAULT_LAT = 10.0261;
const DEFAULT_LNG = 76.3125;
const DEFAULT_RADIUS = 120;

// Dynamic import with ssr: false to prevent Leaflet "window is not defined" SSR errors
const ShowroomGeofenceMapInner = dynamic(
  () => import("./showroom-geofence-map-inner"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[420px] w-full rounded-xl bg-inset border border-line flex flex-col items-center justify-center gap-2 text-xs font-semibold text-ink-muted animate-pulse">
        <Compass className="h-6 w-6 text-accent animate-spin" />
        <span>Loading Interactive Geofence Map...</span>
      </div>
    ),
  }
);

export function ShowroomSetupSettings() {
  const { data: config, isLoading: isConfigLoading } = useConfig();
  const updateGeofenceMutation = useUpdateGeofence();

  const [lat, setLat] = useState<number>(DEFAULT_LAT);
  const [lng, setLng] = useState<number>(DEFAULT_LNG);
  const [radiusMeters, setRadiusMeters] = useState<number>(DEFAULT_RADIUS);
  const [isLocating, setIsLocating] = useState<boolean>(false);

  // Sync state with loaded config
  useEffect(() => {
    if (config) {
      if (config.latitude !== null && config.longitude !== null) {
        setLat(config.latitude);
        setLng(config.longitude);
      }
      if (config.geofence_radius_meters) {
        setRadiusMeters(config.geofence_radius_meters);
      }
    }
  }, [config]);

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        const newLat = Number(position.coords.latitude.toFixed(7));
        const newLng = Number(position.coords.longitude.toFixed(7));
        setLat(newLat);
        setLng(newLng);
        toast.success("Updated coordinates to your current device location");
      },
      (error) => {
        setIsLocating(false);
        let errorMsg = "Unable to retrieve device location";
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg = "Location permission denied by browser";
        }
        toast.error(errorMsg);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleSaveGeofence = () => {
    updateGeofenceMutation.mutate({
      latitude: lat,
      longitude: lng,
      geofence_radius_meters: radiusMeters,
    });
  };

  if (isConfigLoading) {
    return (
      <div className="space-y-6 animate-pulse max-w-4xl font-sans">
        <div className="h-64 rounded-xl bg-inset border border-line" />
        <div className="h-96 rounded-xl bg-inset border border-line" />
      </div>
    );
  }

  return (
    <div className="space-y-6 select-none font-sans max-w-4xl">
      {/* ------------------------------------------------------------- */}
      {/* SECTION 1: SHOWROOM GEOFENCE SETUP & MAP INTERFACE            */}
      {/* ------------------------------------------------------------- */}
      <div className="rounded-xl border border-line bg-card p-4 sm:p-6 space-y-5 shadow-bento">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-line pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-inverse shrink-0 shadow-xs">
              <MapPin className="h-5 w-5 stroke-[2.5px]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink tracking-tight font-sans">
                Showroom Geofence Location
              </h3>
              <p className="text-xs text-ink-subtle mt-0.5">
                Drag marker or use device GPS to position your dealership
                geofence pin
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleUseCurrentLocation}
            disabled={isLocating}
            className="inline-flex items-center gap-2 rounded-lg border border-line bg-inset px-3.5 py-2 text-xs font-bold text-ink-muted hover:text-ink hover:bg-card active:scale-[0.98] transition-all cursor-pointer self-start sm:self-auto"
          >
            {isLocating ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Locate className="h-3.5 w-3.5 text-accent stroke-[2.5px]" />
            )}
            <span>Use My Current Location</span>
          </button>
        </div>

        {/* Interactive Leaflet Map Container */}
        <ShowroomGeofenceMapInner
          lat={lat}
          lng={lng}
          radiusMeters={radiusMeters}
          onPositionChange={(newLat, newLng) => {
            setLat(newLat);
            setLng(newLng);
          }}
        />

        {/* Controls & Range Parameters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Latitude */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-ink-muted block">
              Latitude
            </label>
            <input
              type="number"
              step="any"
              value={lat}
              onChange={(e) => setLat(parseFloat(e.target.value) || 0)}
              className="w-full rounded-lg border border-line bg-inset px-3.5 py-2 text-xs font-mono font-bold text-ink focus:outline-none focus:border-accent"
            />
          </div>

          {/* Longitude */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-ink-muted block">
              Longitude
            </label>
            <input
              type="number"
              step="any"
              value={lng}
              onChange={(e) => setLng(parseFloat(e.target.value) || 0)}
              className="w-full rounded-lg border border-line bg-inset px-3.5 py-2 text-xs font-mono font-bold text-ink focus:outline-none focus:border-accent"
            />
          </div>

          {/* Radius Slider & Numeric Meter Selector */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-ink-muted">
              <span>Geofence Radius</span>
              <span className="font-mono font-bold text-accent">
                {radiusMeters} meters
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="10"
                max="2000"
                step="5"
                value={radiusMeters}
                onChange={(e) =>
                  setRadiusMeters(parseInt(e.target.value, 10) || 120)
                }
                className="w-full accent-accent cursor-pointer h-2 bg-inset rounded-lg"
              />
              <input
                type="number"
                min="10"
                max="2000"
                value={radiusMeters}
                onChange={(e) =>
                  setRadiusMeters(
                    Math.min(
                      2000,
                      Math.max(10, parseInt(e.target.value, 10) || 10)
                    )
                  )
                }
                className="w-20 rounded-lg border border-line bg-inset px-2.5 py-1.5 text-xs font-mono font-bold text-ink text-center focus:outline-none focus:border-accent shrink-0"
              />
            </div>
          </div>
        </div>

        {/* Save Geofence Action Row */}
        <div className="pt-3 border-t border-line flex items-center justify-end">
          <button
            type="button"
            onClick={handleSaveGeofence}
            disabled={updateGeofenceMutation.isPending}
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-xs font-bold text-inverse hover:bg-accent-hover active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
          >
            {updateGeofenceMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4 stroke-[2.5px]" />
            )}
            <span>Save Geofence Configuration</span>
          </button>
        </div>
      </div>
    </div>
  );
}
