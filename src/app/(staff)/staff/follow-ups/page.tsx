/* eslint-disable security/detect-object-injection */
"use client";

import { useState } from "react";
import Link from "next/link";
import { useActionFollowUps } from "@/src/features/leads/hooks/use-lead-follow-ups";
import type { LeadPriority } from "@/src/features/leads/types/lead-types";
import {
  PhoneCall,
  MessageCircle,
  ArrowRight,
  Clock,
  CheckCircle2,
  Loader2,
  Calendar,
  User,
} from "lucide-react";

type BucketType = "today" | "overdue" | "upcoming";

const PRIORITY_CONFIG: Record<
  LeadPriority,
  { label: string; bgClass: string; textClass: string; borderClass: string }
> = {
  very_hot: {
    label: "Very Hot",
    bgClass: "bg-red-500/10",
    textClass: "text-red-500",
    borderClass: "border-red-500/20",
  },
  hot: {
    label: "Hot",
    bgClass: "bg-amber-500/10",
    textClass: "text-amber-500",
    borderClass: "border-amber-500/20",
  },
  warm: {
    label: "Warm",
    bgClass: "bg-yellow-500/10",
    textClass: "text-yellow-600 dark:text-yellow-400",
    borderClass: "border-yellow-500/20",
  },
  cold: {
    label: "Cold",
    bgClass: "bg-blue-500/10",
    textClass: "text-blue-500",
    borderClass: "border-blue-500/20",
  },
};

export default function StaffFollowUpsPage() {
  const [activeBucket, setActiveBucket] = useState<BucketType>("today");

  const { data: todayList } = useActionFollowUps("today");
  const { data: overdueList } = useActionFollowUps("overdue");
  const { data: upcomingList } = useActionFollowUps("upcoming");

  const currentQuery =
    activeBucket === "today"
      ? todayList
      : activeBucket === "overdue"
      ? overdueList
      : upcomingList;

  const overdueCount = overdueList?.length || 0;

  const handleCall = (phone?: string) => {
    if (phone) {
      const cleanPhone = phone.replace(/\D/g, "");
      window.open(`tel:${cleanPhone}`, "_self");
    }
  };

  const handleWhatsApp = (phone?: string) => {
    if (phone) {
      let cleanPhone = phone.replace(/\D/g, "");
      if (cleanPhone.length === 10) {
        cleanPhone = `91${cleanPhone}`;
      }
      window.open(`https://wa.me/${cleanPhone}`, "_blank");
    }
  };

  return (
    <div className="w-full space-y-5 font-sans select-none">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line/60 pb-4">
        <div className="space-y-1">
          <h1 className="text-xl font-bold tracking-tight text-ink font-sans">
            Follow-up Action List
          </h1>
          <p className="text-xs text-ink-muted">
            Daily task list for customer outreach, call reminders, and
            follow-ups.
          </p>
        </div>
      </div>

      {/* Segmented Tab Controls */}
      <div className="flex items-center gap-1.5 border-b border-line/60 pb-3">
        <button
          type="button"
          onClick={() => setActiveBucket("today")}
          className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
            activeBucket === "today"
              ? "bg-accent text-inverse shadow-xs"
              : "bg-card border border-line text-ink-subtle hover:text-ink"
          }`}
        >
          <Clock className="h-3.5 w-3.5" />
          <span>Today</span>
          {todayList && todayList.length > 0 && (
            <span className="ml-1 rounded-md bg-inverse/20 px-1.5 py-0.2 text-[10px] font-mono">
              {todayList.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveBucket("overdue")}
          className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
            activeBucket === "overdue"
              ? "bg-red-500 text-white shadow-xs"
              : "bg-card border border-line text-ink-subtle hover:text-ink"
          }`}
        >
          <Clock className="h-3.5 w-3.5" />
          <span>Overdue</span>
          {overdueCount > 0 && (
            <span className="ml-1 rounded-md bg-red-500/20 text-red-500 font-bold px-1.5 py-0.2 text-[10px] font-mono">
              {overdueCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveBucket("upcoming")}
          className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
            activeBucket === "upcoming"
              ? "bg-accent text-inverse shadow-xs"
              : "bg-card border border-line text-ink-subtle hover:text-ink"
          }`}
        >
          <Calendar className="h-3.5 w-3.5" />
          <span>Upcoming</span>
        </button>
      </div>

      {/* Action List Grid / Items */}
      {!currentQuery ? (
        <div className="py-12 text-center text-xs text-ink-subtle flex items-center justify-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-accent" />
          Loading follow-up list…
        </div>
      ) : currentQuery.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line bg-card p-10 text-center max-w-md mx-auto my-6 select-none space-y-2">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-inset text-emerald-500 border border-line">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <p className="text-sm font-bold text-ink">
            {activeBucket === "today"
              ? "Nothing due today 🎉"
              : activeBucket === "overdue"
              ? "No overdue follow-ups 🎉"
              : "No upcoming follow-ups scheduled"}
          </p>
          <p className="text-xs text-ink-subtle">
            All customer follow-ups for this category are up to date.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {currentQuery.map((fu) => {
            const customerName = fu.lead?.customer?.name || "Customer";
            const customerPhone = fu.lead?.customer?.phone || "N/A";
            const leadPriority = fu.lead?.priority || "warm";
            const priority =
              PRIORITY_CONFIG[leadPriority] || PRIORITY_CONFIG.warm;

            const dueStr = new Date(fu.due_at).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            });

            return (
              <div
                key={fu.id}
                className="flex flex-col justify-between rounded-xl border border-line bg-card p-4 transition-all hover:border-accent/40 hover:shadow-md space-y-3"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-inset border border-line text-ink-subtle shrink-0">
                        <User className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-ink truncate">
                          {customerName}
                        </h3>
                        <p className="text-xs text-ink-subtle font-mono truncate">
                          {customerPhone}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${priority.bgClass} ${priority.textClass} ${priority.borderClass} shrink-0`}
                    >
                      {priority.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-ink-subtle bg-inset/50 rounded-md p-2 border border-line/40 font-mono">
                    <Clock className="h-3.5 w-3.5 text-accent shrink-0" />
                    <span>Due: {dueStr}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-line/50 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleCall(customerPhone)}
                      className="flex items-center gap-1 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 px-2.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <PhoneCall className="h-3.5 w-3.5" />
                      <span>Call</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleWhatsApp(customerPhone)}
                      className="flex items-center gap-1 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 px-2.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <MessageCircle className="h-3.5 w-3.5" />
                      <span>WhatsApp</span>
                    </button>
                  </div>

                  <Link
                    href={`/staff/leads/${fu.lead_id}`}
                    className="flex items-center gap-1 text-xs font-semibold text-accent hover:underline shrink-0"
                  >
                    <span>View</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
