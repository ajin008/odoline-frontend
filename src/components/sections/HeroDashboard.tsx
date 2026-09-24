/* eslint-disable security/detect-object-injection */
import * as React from "react";
import Image from "next/image";
import { siteContent } from "@/src/content/site";
import {
  BarChart3,
  Bell,
  CalendarCheck,
  Car,
  FileCheck,
  LayoutGrid,
  LifeBuoy,
  MessagesSquare,
  Search,
  Settings,
  Users,
} from "lucide-react";

type IconType = React.ComponentType<{ className?: string; strokeWidth?: number }>;

const NAV_ICONS: IconType[] = [LayoutGrid, Car, MessagesSquare, CalendarCheck, FileCheck, Users, BarChart3];
const FOOTER_ICONS: IconType[] = [Settings, LifeBuoy];

// Donut + legend colours, in segment order
const SEGMENT_TONES = [
  { stroke: "text-accent", dot: "bg-accent" },
  { stroke: "text-ink", dot: "bg-ink" },
  { stroke: "text-highlight", dot: "bg-highlight" },
];

const STATUS_TONES = {
  booked: "bg-highlight-light text-ink",
  delivered: "bg-success-light text-success",
  pending: "bg-warning-light text-warning",
};

/**
 * Product illustration of the owner dashboard. Decorative (aria-hidden) —
 * every label and sample value lives in site.ts under hero.dashboard.
 */
export function HeroDashboard() {
  const d = siteContent.hero.dashboard;

  return (
    <figure className="relative">
      <div className="rounded-[1.75rem] border border-line bg-inset p-1.5 shadow-float sm:p-2">
        <div
          aria-hidden="true"
          className="flex overflow-hidden rounded-[1.35rem] border border-line bg-canvas text-left"
        >
          {/* ── Sidebar ── */}
          <aside className="hidden w-56 shrink-0 flex-col bg-footer p-5 text-footer-ink lg:flex">
            <div className="flex items-center gap-2.5 font-heading text-base font-extrabold tracking-tight">
              <Image src="/icons/icon-192.png" alt="" width={28} height={28} className="size-7 rounded-lg" />
              {siteContent.nav.wordmark}
            </div>

            <div className="mt-6 flex items-center gap-3 rounded-xl border border-footer-line p-2.5">
              <span className="grid size-8 place-items-center rounded-full bg-accent font-heading text-xs font-bold text-inverse">
                {d.showroom.charAt(0)}
              </span>
              <div className="min-w-0">
                <div className="truncate text-[13px] font-semibold">{d.showroom}</div>
                <div className="text-[11px] text-footer-muted">{d.role}</div>
              </div>
            </div>

            <ul className="mt-6 space-y-1">
              {d.nav.map((item, i) => {
                const Icon = NAV_ICONS[i] ?? LayoutGrid;
                const active = i === 0;
                return (
                  <li
                    key={item}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] ${
                      active ? "bg-footer-line font-semibold text-footer-ink" : "text-footer-muted"
                    }`}
                  >
                    <Icon className="size-4" strokeWidth={1.75} />
                    {item}
                    {active && <span className="ml-auto size-1.5 rounded-full bg-highlight" />}
                  </li>
                );
              })}
            </ul>

            <ul className="mt-auto space-y-1 border-t border-footer-line pt-4">
              {d.navFooter.map((item, i) => {
                const Icon = FOOTER_ICONS[i] ?? Settings;
                return (
                  <li key={item} className="flex items-center gap-3 px-3 py-2 text-[13px] text-footer-muted">
                    <Icon className="size-4" strokeWidth={1.75} />
                    {item}
                  </li>
                );
              })}
            </ul>
          </aside>

          {/* ── Main ── */}
          <div className="min-w-0 flex-1 bg-inset p-3 sm:p-5 lg:p-6">
            {/* Top bar */}
            <div className="flex items-center justify-between gap-4 px-1 pb-4 sm:pb-5">
              <div className="min-w-0">
                <div className="text-xs text-ink-subtle">{d.greeting}</div>
                <div className="truncate font-heading text-lg font-bold tracking-tight text-ink sm:text-xl">
                  {d.title}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="hidden h-9 w-60 items-center gap-2 rounded-full border border-line bg-card px-3.5 text-xs text-ink-subtle xl:flex">
                  <Search className="size-3.5" />
                  {d.search}
                </div>
                <span className="relative grid size-9 place-items-center rounded-full border border-line bg-card text-ink-muted">
                  <Bell className="size-4" strokeWidth={1.75} />
                  <span className="absolute top-2 right-2.5 size-1.5 rounded-full bg-danger" />
                </span>
                <div className="hidden rounded-full border border-line bg-card p-1 sm:flex">
                  {d.ranges.map((r, i) => (
                    <span
                      key={r}
                      className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
                        i === d.activeRange ? "bg-cta text-cta-ink" : "text-ink-subtle"
                      }`}
                    >
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* KPI cards */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-4">
              {d.kpis.map((kpi, i) => (
                <div
                  key={kpi.label}
                  className={`rounded-2xl border p-3.5 sm:p-4 ${
                    i === 0 ? "border-transparent bg-accent-light" : "border-line bg-card"
                  }`}
                >
                  <div className="text-[11px] font-medium text-ink-muted sm:text-xs">{kpi.label}</div>
                  <div className="mt-2 font-heading text-2xl font-extrabold tracking-[-0.03em] text-ink sm:mt-3 sm:text-[1.75rem]">
                    {kpi.value}
                  </div>
                  <div
                    className={`mt-1 truncate text-[11px] ${
                      i === d.kpis.length - 1 ? "font-semibold text-warning" : "text-ink-subtle"
                    }`}
                  >
                    {kpi.note}
                  </div>
                </div>
              ))}
            </div>

            {/* Chart + donut */}
            <div className="mt-2.5 grid gap-2.5 sm:mt-3 sm:gap-3 md:grid-cols-[1.6fr_1fr]">
              <BarChartCard />
              <DonutCard />
            </div>

            {/* Activity + journey */}
            <div className="mt-2.5 grid gap-2.5 sm:mt-3 sm:gap-3 md:grid-cols-[1.6fr_1fr]">
              <ActivityCard />
              <JourneyCard />
            </div>
          </div>
        </div>
      </div>
      <figcaption className="sr-only">{d.caption}</figcaption>
    </figure>
  );
}

function CardTitle({ children, aside }: { children: React.ReactNode; aside?: React.ReactNode }) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5">
      <span className="font-heading text-[15px] font-bold tracking-tight text-ink">{children}</span>
      {aside}
    </div>
  );
}

function BarChartCard() {
  const chart = siteContent.hero.dashboard.chart;
  const max = Math.max(...chart.months.map((m) => m.enquiries));

  return (
    <div className="rounded-2xl border border-line bg-card p-4 sm:p-5">
      <CardTitle
        aside={
          <span className="flex items-center gap-3 text-[11px] text-ink-muted">
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-ink" />
              {chart.legend[0]}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-line-focus" />
              {chart.legend[1]}
            </span>
          </span>
        }
      >
        {chart.title}
      </CardTitle>

      <div className="relative flex h-40 items-end justify-between gap-3 border-b border-line sm:h-44 sm:gap-5">
        {/* Gridlines */}
        {[0.25, 0.5, 0.75].map((f) => (
          <span
            key={f}
            className="absolute inset-x-0 border-t border-dashed border-line"
            style={{ bottom: `${f * 100}%` }}
          />
        ))}
        {chart.months.map((m, i) => {
          const hi = i === chart.highlight;
          return (
            <div key={m.label} className="relative flex h-full flex-1 items-end justify-center gap-1 sm:gap-1.5">
              <div className="relative flex h-full w-full max-w-7 items-end">
                {hi && (
                  <span className="absolute -top-0 left-1/2 -translate-x-1/2 -translate-y-full pb-1 font-mono text-[10px] font-semibold text-accent">
                    {m.enquiries}
                  </span>
                )}
                <span
                  className={`w-full rounded-t-md ${hi ? "bg-accent" : "bg-ink"}`}
                  style={{ height: `${(m.enquiries / max) * 88}%` }}
                />
              </div>
              <div className="flex h-full w-full max-w-7 items-end">
                <span
                  className={`w-full rounded-t-md ${hi ? "bg-accent-light" : "bg-line-focus"}`}
                  style={{ height: `${(m.bookings / max) * 88}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex justify-between gap-3 sm:gap-5">
        {chart.months.map((m, i) => (
          <span
            key={m.label}
            className={`flex-1 text-center text-[11px] ${
              i === chart.highlight ? "font-semibold text-ink" : "text-ink-subtle"
            }`}
          >
            {m.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function DonutCard() {
  const donut = siteContent.hero.dashboard.donut;
  const total = donut.segments.reduce((sum, s) => sum + s.value, 0);
  const r = 42;
  const C = 2 * Math.PI * r;
  const gap = 3;
  // Start of each segment along the ring
  const starts = donut.segments.map((_, i) =>
    donut.segments.slice(0, i).reduce((sum, s) => sum + (s.value / total) * C, 0)
  );

  return (
    <div className="flex flex-col rounded-2xl border border-line bg-card p-4 sm:p-5">
      <CardTitle>{donut.title}</CardTitle>
      <div className="flex flex-1 items-center gap-5 md:flex-col md:justify-center lg:flex-row">
        <div className="relative size-32 shrink-0">
          <svg viewBox="0 0 100 100" className="size-full -rotate-90">
            <circle cx="50" cy="50" r={r} fill="none" strokeWidth="11" className="text-inset" stroke="currentColor" />
            {donut.segments.map((seg, i) => {
              const len = (seg.value / total) * C - gap;
              return (
                <circle
                  key={seg.label}
                  cx="50"
                  cy="50"
                  r={r}
                  fill="none"
                  strokeWidth="11"
                  strokeLinecap="round"
                  stroke="currentColor"
                  className={SEGMENT_TONES[i % SEGMENT_TONES.length].stroke}
                  strokeDasharray={`${Math.max(len, 0)} ${C}`}
                  strokeDashoffset={-starts[i]}
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 grid place-items-center text-center">
            <div>
              <div className="font-heading text-2xl font-extrabold leading-none tracking-tight text-ink">{total}</div>
              <div className="mt-1 text-[11px] text-ink-subtle">{donut.totalLabel}</div>
            </div>
          </div>
        </div>
        <ul className="w-full space-y-2.5">
          {donut.segments.map((seg, i) => (
            <li key={seg.label} className="flex items-center justify-between gap-3 text-xs">
              <span className="flex items-center gap-2 text-ink-muted">
                <span className={`size-2 rounded-full ${SEGMENT_TONES[i % SEGMENT_TONES.length].dot}`} />
                {seg.label}
              </span>
              <span className="font-mono font-semibold text-ink">{seg.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ActivityCard() {
  const activity = siteContent.hero.dashboard.activity;

  return (
    <div className="rounded-2xl border border-line bg-card p-4 sm:p-5">
      <CardTitle>{activity.title}</CardTitle>
      <ul className="divide-y divide-line">
        {activity.rows.map((row, i) => (
          <li
            key={row.reg}
            className={`items-center gap-3 py-3 first:pt-0 last:pb-0 ${i > 1 ? "hidden sm:flex" : "flex"}`}
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-inset text-ink-muted">
              <Car className="size-4" strokeWidth={1.75} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[13px] font-semibold text-ink">{row.car}</div>
              <div className="truncate text-[11px] text-ink-subtle">
                <span className="font-mono">{row.reg}</span> · {row.event}
              </div>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1">
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${STATUS_TONES[row.status]}`}>
                {activity.statusLabels[row.status]}
              </span>
              <span className="font-mono text-[10px] text-ink-subtle">{row.time}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function JourneyCard() {
  const journey = siteContent.hero.dashboard.journey;
  const current = journey.stages.find((s) => s.status === "current");

  return (
    <div className="hidden flex-col rounded-2xl border border-line bg-footer p-4 text-footer-ink sm:flex sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <span className="font-heading text-[15px] font-bold tracking-tight">{journey.title}</span>
        {current && (
          <span className="rounded-full bg-highlight px-2 py-0.5 text-[10px] font-semibold text-highlight-ink">
            {current.label}
          </span>
        )}
      </div>
      <div className="mt-1 font-mono text-[11px] text-footer-muted">{journey.car}</div>

      <ol className="mt-auto flex items-center pt-6">
        {journey.stages.map((stage, i) => (
          <li key={stage.label} className="flex flex-1 items-center last:flex-none">
            <span
              className={`size-3 shrink-0 rounded-full ${
                stage.status === "completed"
                  ? "bg-accent"
                  : stage.status === "current"
                    ? "bg-highlight ring-4 ring-highlight/25"
                    : "border-2 border-footer-muted"
              }`}
            />
            {i < journey.stages.length - 1 && (
              <span
                className={`h-0.5 flex-1 ${stage.status === "completed" ? "bg-accent" : "bg-footer-line"}`}
              />
            )}
          </li>
        ))}
      </ol>
      <div className="mt-3 flex justify-between text-[10px] text-footer-muted">
        <span>{journey.stages[0].label}</span>
        <span>{journey.stages[journey.stages.length - 1].label}</span>
      </div>
    </div>
  );
}
