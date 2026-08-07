"use client";

import { useState, useEffect } from "react";
import {
  useTodayAttendance,
  useAttendanceActions,
} from "../hooks/use-attendance";
import { useMe } from "@/src/features/auth/hooks/use-me";
import {
  MapPin,
  LogOut,
  CheckCircle2,
  Building2,
  Loader2,
  AlertTriangle,
  ShieldAlert,
} from "lucide-react";

function getGreetingPrefix(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function ClockInWidget() {
  const { data: user } = useMe();
  const { data: attendanceState, isLoading, isError } = useTodayAttendance();
  const { clockIn, clockOut } = useAttendanceActions();

  const [geoError, setGeoError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [dateTimeStr, setDateTimeStr] = useState("");
  const [greeting, setGreeting] = useState("");

  // Live Clock & Greeting display
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hour = now.getHours();
      const prefix = getGreetingPrefix(hour);
      const firstName = user?.name ? user.name.trim().split(" ")[0] : "";
      setGreeting(firstName ? `${prefix}, ${firstName}! 👋` : `${prefix}! 👋`);

      const dateStr = now.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      });
      const timeStr = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      setDateTimeStr(`${dateStr} · ${timeStr}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [user?.name]);

  const handleAction = () => {
    setGeoError(null);

    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        const { latitude, longitude } = position.coords;

        if (attendanceState?.status === "not_clocked_in") {
          clockIn.mutate({ latitude, longitude });
        } else if (attendanceState?.status === "clocked_in") {
          clockOut.mutate({ latitude, longitude });
        }
      },
      (error) => {
        setIsLocating(false);
        if (error.code === error.PERMISSION_DENIED) {
          setGeoError(
            "Allow location access in your browser settings to clock in/out."
          );
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          setGeoError(
            "Position unavailable. Please ensure GPS is enabled on your device."
          );
        } else if (error.code === error.TIMEOUT) {
          setGeoError("Location request timed out. Please try again.");
        } else {
          setGeoError("Unable to retrieve your location.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const isPending = isLocating || clockIn.isPending || clockOut.isPending;
  const status = attendanceState?.status ?? "not_clocked_in";
  const record = attendanceState?.record;

  // Format UTC timestamps to IST strings
  const formatISTTime = (isoString: string | null | undefined) => {
    if (!isoString) return "";
    return new Date(isoString).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-line bg-card p-6 md:p-8 space-y-6 shadow-bento animate-pulse max-w-xl mx-auto">
        <div className="h-6 w-1/3 bg-inset rounded-md" />
        <div className="h-24 bg-inset rounded-xl" />
        <div className="h-12 bg-inset rounded-xl" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-rose-500/30 bg-rose-500/5 p-6 text-center space-y-3 max-w-xl mx-auto">
        <AlertTriangle className="h-8 w-8 text-rose-500 mx-auto" />
        <h3 className="text-sm font-bold text-ink">
          Failed to load attendance state
        </h3>
        <p className="text-xs text-ink-subtle">
          Please check your network connection and try again.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto space-y-6 select-none font-sans">
      {/* Attendance Clock Bento Card */}
      <div className="rounded-2xl border border-line/90 bg-card p-6 md:p-8 shadow-bento space-y-6">
        {/* Card Header: Greeting & Formatted Date / Time */}
        <div className="border-b border-line/40 pb-5 space-y-1">
          <h2 className="text-xl font-bold tracking-tight text-ink font-sans">
            {greeting || "Welcome! 👋"}
          </h2>
          <p className="text-xs font-semibold text-ink-muted">{dateTimeStr}</p>
        </div>

        {/* Status Indicator Banner */}
        <div className="space-y-2">
          <span className="text-[10px] font-semibold text-ink-subtle uppercase tracking-wider block">
            Today&apos;s Shift Status
          </span>

          {status === "not_clocked_in" && (
            <div className="flex items-center justify-between p-4 rounded-xl bg-amber-500 text-white shadow-xs border-none">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/20 text-white shrink-0">
                  <Building2 className="h-5 w-5 stroke-[2.5px]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold font-sans text-white">
                    Not Clocked In
                  </h4>
                  <p className="text-[11px] font-medium text-white/90">
                    You haven&lsquo;t clocked in for today&apos;s shift yet.
                  </p>
                </div>
              </div>
            </div>
          )}

          {status === "clocked_in" && (
            <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-600 text-white shadow-xs border-none">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/20 text-white shrink-0">
                  <CheckCircle2 className="h-5 w-5 stroke-[2.5px]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold font-sans text-white">
                    On Showroom Shift
                  </h4>
                  <p className="text-[11px] font-medium text-white/90 font-mono">
                    Clocked in at{" "}
                    {formatISTTime(
                      attendanceState?.clock_in_at || record?.clock_in_at
                    )}{" "}
                    (IST)
                  </p>
                </div>
              </div>
              <span className="h-2.5 w-2.5 rounded-full bg-white animate-pulse shrink-0" />
            </div>
          )}

          {status === "clocked_out" && (
            <div className="flex items-center justify-between p-4 rounded-xl border border-line bg-inset text-ink">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-card border border-line text-ink-subtle shrink-0">
                  <CheckCircle2 className="h-5 w-5 stroke-[2.5px] text-emerald-600" />
                </div>
                <div>
                  <h4 className="text-xs font-bold font-sans">
                    Shift Completed Today
                  </h4>
                  <p className="text-[11px] text-ink-muted font-mono">
                    Clocked in:{" "}
                    {formatISTTime(
                      attendanceState?.clock_in_at || record?.clock_in_at
                    )}{" "}
                    • Clocked out:{" "}
                    {formatISTTime(
                      attendanceState?.clock_out_at || record?.clock_out_at
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Geolocation Warning Alert (if any) */}
        {geoError && (
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300 text-xs leading-relaxed animate-in fade-in">
            <ShieldAlert className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{geoError}</span>
          </div>
        )}

        {/* Contextual Clock Action Button */}
        <div className="pt-2">
          {status === "not_clocked_in" && (
            <button
              type="button"
              disabled={isPending}
              onClick={handleAction}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-sm font-bold text-inverse hover:bg-accent-hover active:scale-[0.99] disabled:opacity-50 transition-all cursor-pointer shadow-sm border-none"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Verifying Geofence Location...</span>
                </>
              ) : (
                <>
                  <MapPin className="h-4 w-4 stroke-[2.5px]" />
                  <span>Clock In to Showroom</span>
                </>
              )}
            </button>
          )}

          {status === "clocked_in" && (
            <button
              type="button"
              disabled={isPending}
              onClick={handleAction}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#171819] hover:bg-[#262729] text-white py-3.5 text-sm font-bold shadow-sm active:scale-[0.99] disabled:opacity-50 transition-all cursor-pointer border-none"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Verifying Geofence Location...</span>
                </>
              ) : (
                <>
                  <LogOut className="h-4 w-4 stroke-[2.5px]" />
                  <span>Clock Out of Showroom</span>
                </>
              )}
            </button>
          )}

          {status === "clocked_out" && (
            <button
              type="button"
              disabled={true}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-inset px-6 py-3.5 text-xs font-bold text-ink-subtle cursor-not-allowed opacity-80 border-none"
            >
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>Attendance Recorded for Today</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
