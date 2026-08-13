"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTodayAttendance } from "@/src/features/attendance/hooks/use-attendance";
import { ClockInWidget } from "@/src/features/attendance/components/clock-in-widget";
import {
  Users,
  Car,
  CalendarCheck,
  Building2,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export default function StaffDashboardPage() {
  const { data: attendanceData } = useTodayAttendance();
  const status = attendanceData?.status || "not_clocked_in";

  const [greeting, setGreeting] = useState("");
  const [dateTimeStr, setDateTimeStr] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hour = now.getHours();

      if (hour < 12) setGreeting("Good Morning ☀️");
      else if (hour < 17) setGreeting("Good Afternoon 🌤️");
      else setGreeting("Good Evening 🌙");

      const options: Intl.DateTimeFormatOptions = {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      };
      setDateTimeStr(now.toLocaleString("en-IN", options));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full space-y-6 font-sans select-none">
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
              <span className="text-ink-subtle">Shift Ended</span>
            )}
          </p>
          <p className="text-[11px] text-ink-subtle">
            {status === "clocked_in"
              ? "Clocked in at dealership"
              : "Clock-in required to log tasks"}
          </p>
        </div>

        {/* Card 2: Dealership Stock */}
        <div className="bg-card border border-line rounded-xl p-4 shadow-bento space-y-1.5">
          <div className="flex items-center justify-between text-ink-subtle">
            <span className="text-[10px] font-mono font-bold tracking-wider uppercase">
              In Stock Cars
            </span>
            <Car className="h-3.5 w-3.5 text-accent" />
          </div>
          <p className="text-sm font-bold text-ink font-sans">
            Available Inventory
          </p>
          <Link
            href="/staff/stock"
            className="text-[11px] font-semibold text-accent hover:underline inline-flex items-center gap-1"
          >
            <span>Browse Vehicles</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {/* Card 3: Active Bookings */}
        <div className="bg-card border border-line rounded-xl p-4 shadow-bento space-y-1.5">
          <div className="flex items-center justify-between text-ink-subtle">
            <span className="text-[10px] font-mono font-bold tracking-wider uppercase">
              Bookings
            </span>
            <CalendarCheck className="h-3.5 w-3.5 text-accent" />
          </div>
          <p className="text-sm font-bold text-ink font-sans">
            Customer Tokens
          </p>
          <Link
            href="/staff/booking"
            className="text-[11px] font-semibold text-accent hover:underline inline-flex items-center gap-1"
          >
            <span>View Tokens</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {/* Card 4: System Status */}
        <div className="bg-card border border-line rounded-xl p-4 shadow-bento space-y-1.5">
          <div className="flex items-center justify-between text-ink-subtle">
            <span className="text-[10px] font-mono font-bold tracking-wider uppercase">
              System Node
            </span>
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
          </div>
          <p className="text-sm font-bold text-ink font-sans flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            <span>Staff Portal v4</span>
          </p>
          <p className="text-[11px] text-ink-subtle font-mono">
            Role: Sales Executive
          </p>
        </div>
      </div>

      {/* 3. Main Dashboard Layout (Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Main Actions & Lead Summary) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions Panel */}
          <div className="bg-card border border-line rounded-xl p-5 shadow-bento space-y-3">
            <div className="flex items-center justify-between border-b border-line/50 pb-2.5">
              <h3 className="text-xs font-bold text-ink font-sans tracking-tight uppercase">
                Staff Quick Workstation
              </h3>
              <span className="text-[10px] font-mono text-ink-subtle">
                Shortcuts
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Action 1: Showroom Stock */}
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

              {/* Action 2: Booking Tokens */}
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
                Visit the Leads tab to view customer enquiries and track test drive follow-ups.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side Panel: Sleek Side Terminal Clock Widget */}
        <div className="hidden lg:block lg:col-span-1">
          <ClockInWidget />
        </div>
      </div>
    </div>
  );
}
