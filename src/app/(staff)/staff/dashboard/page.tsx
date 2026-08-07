"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useMe } from "@/src/features/auth/hooks/use-me";
import { useTodayAttendance } from "@/src/features/attendance/hooks/use-attendance";
import { useConfig } from "@/src/features/settings/hooks/use-config";
import { ClockInWidget } from "@/src/features/attendance/components/clock-in-widget";
import { CreateLeadModal } from "@/src/features/leads/components/create-lead-modal";
import {
  Clock,
  Timer,
  Building2,
  Users,
  Car,
  CalendarCheck,
  Plus,
  ArrowRight,
} from "lucide-react";

function getGreetingPrefix(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function StaffDashboardPage() {
  const { data: user } = useMe();
  const { data: attendanceState } = useTodayAttendance();
  const { data: config } = useConfig();
  const [isCreateLeadOpen, setIsCreateLeadOpen] = useState(false);

  const geofenceRadius = config?.geofence_radius_meters ?? 120;
  const isGeofenceConfigured =
    config?.latitude !== null &&
    config?.latitude !== undefined &&
    config?.longitude !== null &&
    config?.longitude !== undefined;

  const [dateTimeStr, setDateTimeStr] = useState("");
  const [greeting, setGreeting] = useState("");
  const [shiftDuration, setShiftDuration] = useState("");

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

      // Calculate shift duration
      const clockInAt =
        attendanceState?.clock_in_at || attendanceState?.record?.clock_in_at;
      const clockOutAt =
        attendanceState?.clock_out_at || attendanceState?.record?.clock_out_at;

      if (clockInAt) {
        const start = new Date(clockInAt).getTime();
        const end = clockOutAt ? new Date(clockOutAt).getTime() : now.getTime();
        const diffMs = Math.max(0, end - start);
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        setShiftDuration(`${hours}h ${mins}m`);
      } else {
        setShiftDuration("");
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [user?.name, attendanceState]);

  const status = attendanceState?.status ?? "not_clocked_in";
  const record = attendanceState?.record;

  const formatISTTime = (isoString: string | null | undefined) => {
    if (!isoString) return "--:--";
    return new Date(isoString).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const clockInTimeStr = formatISTTime(
    attendanceState?.clock_in_at || record?.clock_in_at
  );
  const clockOutTimeStr = formatISTTime(
    attendanceState?.clock_out_at || record?.clock_out_at
  );

  return (
    <div className="w-full space-y-5 font-sans select-none">
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-line/60 pb-4">
        <div>
          <h1 className="font-heading text-xl md:text-2xl font-bold tracking-tight text-ink">
            {greeting || "Welcome! 👋"}
          </h1>
          <p className="text-xs text-ink-muted font-medium mt-0.5">
            {dateTimeStr}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateLeadOpen(true)}
          className="hidden sm:inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-xs font-bold text-inverse hover:bg-accent-hover active:scale-[0.98] transition-all cursor-pointer shadow-sm shrink-0 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4 stroke-[2.5px]" />
          <span>New Lead Registration</span>
        </button>
      </div>

      {/* 2. Top Summary KPI Cards (4 Metric Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: Shift Status */}
        <div className="bg-card border border-line rounded-xl p-4 shadow-bento space-y-1.5">
          <div className="flex items-center justify-between text-ink-subtle">
            <span className="text-[10px] font-mono font-bold tracking-wider uppercase">
              Shift Status
            </span>
            <Building2 className="h-3.5 w-3.5 text-accent" />
          </div>
          <p className="text-sm font-bold text-ink flex items-center gap-1.5 font-sans">
            {status === "not_clocked_in" && (
              <span className="text-ink-muted">Off Shift</span>
            )}
            {status === "clocked_in" && (
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Active Shift
              </span>
            )}
            {status === "clocked_out" && (
              <span className="text-ink-subtle">Completed</span>
            )}
          </p>
        </div>

        {/* Card 2: Clock In Time */}
        <div className="bg-card border border-line rounded-xl p-4 shadow-bento space-y-1.5">
          <div className="flex items-center justify-between text-ink-subtle">
            <span className="text-[10px] font-mono font-bold tracking-wider uppercase">
              Clock In Time
            </span>
            <Clock className="h-3.5 w-3.5 text-accent" />
          </div>
          <p className="text-sm font-bold font-mono text-ink">
            {status === "not_clocked_in" ? "--:--" : clockInTimeStr}
          </p>
        </div>

        {/* Card 3: Shift Duration */}
        <div className="bg-card border border-line rounded-xl p-4 shadow-bento space-y-1.5">
          <div className="flex items-center justify-between text-ink-subtle">
            <span className="text-[10px] font-mono font-bold tracking-wider uppercase">
              {status === "clocked_out" ? "Clock Out" : "Shift Elapsed"}
            </span>
            <Timer className="h-3.5 w-3.5 text-accent" />
          </div>
          <p className="text-sm font-bold font-mono text-ink">
            {status === "not_clocked_in"
              ? "--:--"
              : status === "clocked_out"
              ? clockOutTimeStr
              : shiftDuration || "--:--"}
          </p>
        </div>

        {/* Card 4: Geofence Status */}
        <div className="bg-card border border-line rounded-xl p-4 shadow-bento space-y-1.5">
          <div className="flex items-center justify-between text-ink-subtle">
            <span className="text-[10px] font-mono font-bold tracking-wider uppercase">
              Geofence Check
            </span>
            <Building2
              className={`h-3.5 w-3.5 ${
                isGeofenceConfigured ? "text-emerald-500" : "text-amber-500"
              }`}
            />
          </div>
          <p
            className={`text-sm font-bold font-sans ${
              isGeofenceConfigured
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-amber-600 dark:text-amber-400"
            }`}
          >
            {isGeofenceConfigured
              ? `Verified (${geofenceRadius}m)`
              : "Location Unset"}
          </p>
        </div>
      </div>

      {/* Mobile/Tablet Attendance Action Terminal (Placed directly below the 4 KPI boxes) */}
      <div className="block lg:hidden">
        <ClockInWidget />
      </div>

      {/* 3. Main Multi-Column Dashboard Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 pt-1">
        {/* Left Column: Quick Tools & Sales Operations */}
        <div className="lg:col-span-2 space-y-5">
          {/* Quick Actions Panel */}
          <div className="bg-card border border-line rounded-xl p-5 shadow-bento space-y-4">
            <div className="flex items-center justify-between border-b border-line/50 pb-3">
              <h3 className="text-xs font-bold text-ink font-sans tracking-tight uppercase">
                Quick Sales Actions
              </h3>
              <span className="text-[10px] font-mono text-ink-subtle">
                Sales Operations
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Action 1: Register Lead */}
              <button
                type="button"
                onClick={() => setIsCreateLeadOpen(true)}
                className="flex flex-col items-start p-3.5 rounded-lg border border-line bg-inset hover:bg-card hover:border-accent/40 transition-all text-left space-y-2 cursor-pointer group"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-light text-accent">
                  <Users className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-ink font-sans group-hover:text-accent transition-colors">
                    Add Customer Lead
                  </h4>
                  <p className="text-[10px] text-ink-muted">
                    Register enquiry &amp; contact
                  </p>
                </div>
              </button>

              {/* Action 2: Stock Roster */}
              <Link
                href="/staff/stock"
                className="flex flex-col items-start p-3.5 rounded-lg border border-line bg-inset hover:bg-card hover:border-accent/40 transition-all text-left space-y-2 cursor-pointer group"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-light text-accent">
                  <Car className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-ink font-sans group-hover:text-accent transition-colors">
                    Browse Vehicle Stock
                  </h4>
                  <p className="text-[10px] text-ink-muted">
                    View active cars &amp; prices
                  </p>
                </div>
              </Link>

              {/* Action 3: Booking Tokens */}
              <Link
                href="/staff/booking"
                className="flex flex-col items-start p-3.5 rounded-lg border border-line bg-inset hover:bg-card hover:border-accent/40 transition-all text-left space-y-2 cursor-pointer group"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-light text-accent">
                  <CalendarCheck className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-ink font-sans group-hover:text-accent transition-colors">
                    Booking Receipts
                  </h4>
                  <p className="text-[10px] text-ink-muted">
                    Track tokens &amp; deliveries
                  </p>
                </div>
              </Link>
            </div>
          </div>

          {/* Active Customer Enquiries List Panel */}
          <div className="bg-card border border-line rounded-xl p-5 shadow-bento space-y-4">
            <div className="flex items-center justify-between border-b border-line/50 pb-3">
              <h3 className="text-xs font-bold text-ink font-sans tracking-tight uppercase">
                Active Customer Enquiries
              </h3>
              <Link
                href="/staff/leads"
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-accent hover:underline"
              >
                <span>View All Leads</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="rounded-lg border border-dashed border-line bg-inset p-6 text-center space-y-2">
              <Users className="h-8 w-8 text-ink-subtle mx-auto" />
              <h4 className="text-xs font-bold text-ink font-sans">
                No Pending Customer Tasks
              </h4>
              <p className="text-[11px] text-ink-subtle max-w-xs mx-auto leading-relaxed">
                Click &#34;+ New Lead Registration&#34; to add customer
                enquiries and track test drive follow-ups.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side Panel: Sleek Side Terminal Clock Widget */}
        <div className="hidden lg:block lg:col-span-1">
          <ClockInWidget />
        </div>
      </div>

      {/* Structural Create Lead Modal */}
      <CreateLeadModal
        isOpen={isCreateLeadOpen}
        onClose={() => setIsCreateLeadOpen(false)}
      />
    </div>
  );
}
