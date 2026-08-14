"use client";

import {
  Trophy,
  XCircle,
  Percent,
  FolderOpen,
  Users,
  Filter,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useDashboardFunnel } from "../hooks/use-dashboard-funnel";
import type { LeadStage } from "../types/lead-types";

interface StageConfig {
  key: LeadStage;
  label: string;
  isTerminal: boolean;
  barColor: string;
  badgeBg: string;
  textColor: string;
}

const STAGE_CONFIGS: StageConfig[] = [
  {
    key: "new",
    label: "New Enquiries",
    isTerminal: false,
    barColor: "bg-blue-500",
    badgeBg: "bg-blue-500/10 border-blue-500/20 text-blue-600",
    textColor: "text-blue-600",
  },
  {
    key: "contacted",
    label: "Contacted & Qualified",
    isTerminal: false,
    barColor: "bg-indigo-500",
    badgeBg: "bg-indigo-500/10 border-indigo-500/20 text-indigo-600",
    textColor: "text-indigo-600",
  },
  {
    key: "test_drive",
    label: "Test Drive Scheduled",
    isTerminal: false,
    barColor: "bg-purple-500",
    badgeBg: "bg-purple-500/10 border-purple-500/20 text-purple-600",
    textColor: "text-purple-600",
  },
  {
    key: "discussion",
    label: "Price Discussion / Offer",
    isTerminal: false,
    barColor: "bg-amber-500",
    badgeBg: "bg-amber-500/10 border-amber-500/20 text-amber-600",
    textColor: "text-amber-600",
  },
  {
    key: "won",
    label: "Won (Closed Deal)",
    isTerminal: true,
    barColor: "bg-emerald-500",
    badgeBg: "bg-emerald-500/10 border-emerald-500/20 text-emerald-600",
    textColor: "text-emerald-600",
  },
  {
    key: "lost",
    label: "Lost / Closed",
    isTerminal: true,
    barColor: "bg-rose-500",
    badgeBg: "bg-rose-500/10 border-rose-500/20 text-rose-600",
    textColor: "text-rose-600",
  },
];

export function OwnerFunnelDashboard() {
  const { data, isLoading, isError, refetch } = useDashboardFunnel();

  if (isLoading) {
    return (
      <div className="space-y-6 font-sans select-none animate-pulse">
        {/* Loading Skeletons for Conversion Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-24 rounded-xl border border-line bg-card p-4 space-y-3"
            >
              <div className="h-4 w-20 rounded bg-inset" />
              <div className="h-7 w-12 rounded bg-inset" />
            </div>
          ))}
        </div>

        {/* Loading Skeleton for Funnel Bar Visual */}
        <div className="rounded-xl border border-line bg-card p-5 space-y-4">
          <div className="h-5 w-48 rounded bg-inset" />
          <div className="space-y-3 pt-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-10 rounded-lg bg-inset w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-5 font-sans select-none text-rose-600 space-y-3">
        <div className="flex items-center gap-2.5">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <h3 className="text-sm font-bold">Failed to load CRM Funnel & Conversion data</h3>
        </div>
        <p className="text-xs text-rose-600/80">
          An error occurred while communicating with the dealership server. Please check your connection and try again.
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-colors cursor-pointer"
        >
          <RefreshCw className="h-3.5 w-3.5 stroke-[2.25px]" />
          <span>Retry</span>
        </button>
      </div>
    );
  }

  const funnel = data?.funnel ?? {
    new: 0,
    contacted: 0,
    test_drive: 0,
    discussion: 0,
    won: 0,
    lost: 0,
  };

  const conversion = data?.conversion ?? {
    won_this_month: 0,
    lost_this_month: 0,
    conversion_rate: 0,
  };

  const totals = data?.totals ?? {
    total_open: 0,
    total_leads: 0,
  };

  // Conversion rate percentage string
  const conversionPct =
    typeof conversion.conversion_rate === "number"
      ? `${(conversion.conversion_rate * 100).toFixed(0)}%`
      : "0%";

  const maxStageCount = Math.max(
    funnel.new,
    funnel.contacted,
    funnel.test_drive,
    funnel.discussion,
    funnel.won,
    funnel.lost,
    1
  );

  const conversionCards = [
    {
      label: "Won This Month",
      value: conversion.won_this_month,
      icon: Trophy,
      color: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
      subtitle: "Leads closed won",
    },
    {
      label: "Lost This Month",
      value: conversion.lost_this_month,
      icon: XCircle,
      color: "text-rose-600 bg-rose-500/10 border-rose-500/20",
      subtitle: "Leads closed lost",
    },
    {
      label: "Conversion Rate",
      value: conversionPct,
      icon: Percent,
      color: "text-purple-600 bg-purple-500/10 border-purple-500/20",
      subtitle: "This month (won / total)",
    },
    {
      label: "Total Open Leads",
      value: totals.total_open,
      icon: FolderOpen,
      color: "text-accent bg-accent/10 border-accent/20",
      subtitle: "Active pipeline",
    },
    {
      label: "Total Leads",
      value: totals.total_leads,
      icon: Users,
      color: "text-slate-600 bg-slate-500/10 border-slate-500/20",
      subtitle: "Dealership-wide",
    },
  ];

  return (
    <div className="space-y-6 font-sans select-none">
      {/* 1. Metric Conversion & Totals Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
        {conversionCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="flex flex-col justify-between rounded-xl border border-line bg-card p-4 transition-all duration-200 hover:border-accent/40 shadow-2xs"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-ink-muted truncate">
                  {card.label}
                </span>
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-lg border ${card.color} shrink-0`}
                >
                  <Icon className="h-3.5 w-3.5 stroke-[2.25px]" />
                </div>
              </div>

              <div className="mt-2.5 space-y-0.5">
                <span className="font-heading text-2xl font-extrabold tracking-tight text-ink block leading-none">
                  {card.value}
                </span>
                <span className="text-[10px] text-ink-subtle block truncate">
                  {card.subtitle}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2. Visual Sales Funnel Stage Breakdown */}
      <div className="rounded-xl border border-line bg-card p-5 space-y-5 shadow-2xs">
        <div className="flex items-center justify-between border-b border-line/60 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 border border-accent/20 text-accent">
              <Filter className="h-4 w-4 stroke-[2.25px]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink font-heading leading-tight">
                Dealership Sales Funnel
              </h3>
              <p className="text-[11px] text-ink-subtle">
                Stage progression from enquiry to resolution (Dealership-wide)
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-3 text-[11px] font-semibold">
            <span className="flex items-center gap-1.5 text-accent bg-accent/10 border border-accent/20 px-2.5 py-1 rounded-md">
              <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
              Active Stages (4)
            </span>
            <span className="flex items-center gap-1.5 text-ink-muted bg-inset border border-line px-2.5 py-1 rounded-md">
              <CheckCircle2 className="h-3 w-3 text-emerald-500" />
              Terminal (2)
            </span>
          </div>
        </div>

        {/* Empty State Banner */}
        {totals.total_leads === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center space-y-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-inset text-ink-subtle mb-1">
              <Filter className="h-6 w-6 stroke-[1.5px]" />
            </div>
            <h4 className="text-sm font-bold text-ink">No Lead Data Recorded Yet</h4>
            <p className="text-xs text-ink-subtle max-w-sm">
              As staff members log customer enquiries and progress leads through sales stages, real-time funnel metrics will populate here.
            </p>
          </div>
        ) : (
          /* Funnel Bar Visual Stack */
          <div className="space-y-3">
            {STAGE_CONFIGS.map((config) => {
              const count = funnel[config.key] ?? 0;
              const barWidthPct =
                count > 0 ? Math.max((count / maxStageCount) * 100, 4) : 0;
              const shareOfTotalPct =
                totals.total_leads > 0
                  ? Math.round((count / totals.total_leads) * 100)
                  : 0;

              return (
                <div key={config.key} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${config.badgeBg}`}
                      >
                        {config.isTerminal ? "Terminal" : "Active"}
                      </span>
                      <span className="font-semibold text-ink font-sans">
                        {config.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-[11px] text-ink-subtle">
                        {shareOfTotalPct}% of leads
                      </span>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-md bg-inset border border-line ${config.textColor}`}
                      >
                        {count}
                      </span>
                    </div>
                  </div>

                  {/* Horizontal Bar Visual */}
                  <div className="relative h-3 w-full rounded-full bg-inset overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ease-out ${config.barColor}`}
                      style={{ width: `${barWidthPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
