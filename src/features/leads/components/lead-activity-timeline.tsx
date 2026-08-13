"use client";

import { useState } from "react";
import { useLeadActivities, useLogActivity } from "../hooks/use-lead-activities";
import type { LeadActivityType } from "../types/lead-types";
import {
  PhoneCall,
  MessageCircle,
  MapPin,
  FileText,
  TrendingUp,
  Flame,
  UserCheck,
  History,
  Loader2,
  X,
  Send,
  Clock,
  type LucideIcon,
} from "lucide-react";

interface LeadActivityTimelineProps {
  leadId: string;
  customerPhone?: string;
}

const TYPE_CONFIG: Record<
  LeadActivityType,
  { label: string; icon: LucideIcon; iconBg: string; textClass: string }
> = {
  call: {
    label: "Phone Call",
    icon: PhoneCall,
    iconBg: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    textClass: "text-blue-500",
  },
  whatsapp: {
    label: "WhatsApp",
    icon: MessageCircle,
    iconBg: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    textClass: "text-emerald-500",
  },
  visit: {
    label: "Showroom Visit",
    icon: MapPin,
    iconBg: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    textClass: "text-purple-500",
  },
  note: {
    label: "Note Added",
    icon: FileText,
    iconBg: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    textClass: "text-amber-500",
  },
  stage_change: {
    label: "Stage Changed",
    icon: TrendingUp,
    iconBg: "bg-accent/10 text-accent border-accent/20",
    textClass: "text-accent",
  },
  priority_change: {
    label: "Priority Updated",
    icon: Flame,
    iconBg: "bg-red-500/10 text-red-500 border-red-500/20",
    textClass: "text-red-500",
  },
  reassigned: {
    label: "Lead Reassigned",
    icon: UserCheck,
    iconBg: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
    textClass: "text-indigo-500",
  },
};

export function LeadActivityTimeline({
  leadId,
  customerPhone,
}: LeadActivityTimelineProps) {
  const { data: activities, isLoading, isError } = useLeadActivities(leadId);
  const logActivityMutation = useLogActivity(leadId);

  const [activeModalType, setActiveModalType] = useState<"visit" | "note" | null>(
    null
  );
  const [noteInput, setNoteInput] = useState("");

  const handleCall = () => {
    if (customerPhone) {
      const cleanPhone = customerPhone.replace(/\D/g, "");
      window.open(`tel:${cleanPhone}`, "_self");
    }
    logActivityMutation.mutate({ type: "call" });
  };

  const handleWhatsApp = () => {
    if (customerPhone) {
      let cleanPhone = customerPhone.replace(/\D/g, "");
      if (cleanPhone.length === 10) {
        cleanPhone = `91${cleanPhone}`;
      }
      window.open(`https://wa.me/${cleanPhone}`, "_blank");
    }
    logActivityMutation.mutate({ type: "whatsapp" });
  };

  const handleOpenNoteModal = (type: "visit" | "note") => {
    setActiveModalType(type);
    setNoteInput("");
  };

  const handleSubmitNoteModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModalType) return;

    logActivityMutation.mutate(
      {
        type: activeModalType,
        note: noteInput.trim() || undefined,
      },
      {
        onSuccess: () => {
          setActiveModalType(null);
          setNoteInput("");
        },
      }
    );
  };

  // Calculate days since last contact (call, whatsapp, or visit)
  const lastContactActivity = activities?.find((a) =>
    ["call", "whatsapp", "visit"].includes(a.type)
  );

  let lastContactLabel = "No contact logged yet";
  if (lastContactActivity) {
    const diffMs =
      new Date().getTime() - new Date(lastContactActivity.created_at).getTime();
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (days === 0) {
      lastContactLabel = "Last contact: Today";
    } else if (days === 1) {
      lastContactLabel = "Last contact: Yesterday";
    } else {
      lastContactLabel = `Last contact: ${days} days ago`;
    }
  }

  return (
    <div className="rounded-2xl border border-line bg-card p-5 space-y-4 font-sans select-none">
      {/* Title & Last Contact Header */}
      <div className="flex items-center justify-between gap-2 border-b border-line/60 pb-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-muted flex items-center gap-2">
          <History className="h-4 w-4 text-accent" />
          Activity Log &amp; Timeline
        </h3>

        <span className="inline-flex items-center gap-1.5 rounded-lg bg-inset border border-line px-2.5 py-1 text-[11px] font-medium text-ink-subtle">
          <Clock className="h-3 w-3 text-accent" />
          {lastContactLabel}
        </span>
      </div>

      {/* Quick Fast-Log Actions Bar */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-medium text-ink-subtle uppercase tracking-wider">
          Quick Actions (1-Tap Log)
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            type="button"
            onClick={handleCall}
            disabled={logActivityMutation.isPending}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-blue-500/30 bg-blue-500/10 px-3 py-2 text-xs font-semibold text-blue-500 hover:bg-blue-500/20 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <PhoneCall className="h-3.5 w-3.5" />
            <span>Call</span>
          </button>

          <button
            type="button"
            onClick={handleWhatsApp}
            disabled={logActivityMutation.isPending}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-500 hover:bg-emerald-500/20 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            <span>WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={() => handleOpenNoteModal("visit")}
            disabled={logActivityMutation.isPending}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-purple-500/30 bg-purple-500/10 px-3 py-2 text-xs font-semibold text-purple-500 hover:bg-purple-500/20 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <MapPin className="h-3.5 w-3.5" />
            <span>Visit</span>
          </button>

          <button
            type="button"
            onClick={() => handleOpenNoteModal("note")}
            disabled={logActivityMutation.isPending}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs font-semibold text-amber-500 hover:bg-amber-500/20 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Note</span>
          </button>
        </div>
      </div>

      {/* Timeline List Section */}
      {isLoading ? (
        <div className="py-6 flex items-center justify-center gap-2 text-xs text-ink-subtle">
          <Loader2 className="h-4 w-4 animate-spin text-accent" />
          Loading activity timeline…
        </div>
      ) : isError ? (
        <p className="text-xs text-danger text-center py-4">
          Could not load activity log.
        </p>
      ) : !activities || activities.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line bg-inset/50 p-6 text-center text-xs text-ink-subtle">
          No activities logged yet. Use the quick buttons above to record a call or note.
        </div>
      ) : (
        <div className="relative border-l border-line/70 pl-4 space-y-4 my-2 ml-2">
          {activities.map((item) => {
            const config = TYPE_CONFIG[item.type] || TYPE_CONFIG.note;
            const Icon = config.icon;

            const dateStr = new Date(item.created_at).toLocaleString("en-IN", {
              day: "numeric",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div key={item.id} className="relative group">
                {/* Timeline Dot Icon */}
                <div
                  className={`absolute -left-[27px] top-0 flex h-6 w-6 items-center justify-center rounded-full border ${config.iconBg} shrink-0`}
                >
                  <Icon className="h-3 w-3" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className={`font-semibold ${config.textClass}`}>
                      {config.label}
                    </span>
                    <span className="text-[11px] text-ink-subtle">{dateStr}</span>
                  </div>

                  {item.note && (
                    <p className="text-xs text-ink bg-inset/60 rounded-xl p-2.5 border border-line/40 leading-relaxed">
                      {item.note}
                    </p>
                  )}

                  <p className="text-[11px] text-ink-subtle">
                    Logged by{" "}
                    <span className="font-medium text-ink">
                      {item.performed_by?.name || "System"}
                    </span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Inline Modal for Visit / Note */}
      {activeModalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl border border-line bg-card p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <h4 className="text-sm font-bold text-ink flex items-center gap-2">
                {activeModalType === "visit" ? (
                  <>
                    <MapPin className="h-4 w-4 text-purple-500" />
                    Log Showroom Visit
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4 text-amber-500" />
                    Add Activity Note
                  </>
                )}
              </h4>
              <button
                type="button"
                onClick={() => setActiveModalType(null)}
                className="text-ink-subtle hover:text-ink transition-colors p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitNoteModal} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-ink-muted">
                  Note / Remarks (Optional)
                </label>
                <textarea
                  rows={3}
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  placeholder={
                    activeModalType === "visit"
                      ? "e.g. Inspected Harrier, discussed exchange value..."
                      : "e.g. Customer requested price quote over phone..."
                  }
                  className="w-full rounded-xl border border-line bg-inset p-3 text-xs text-ink placeholder:text-ink-subtle/60 focus:border-accent focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModalType(null)}
                  className="rounded-xl border border-line px-3.5 py-2 text-xs font-medium text-ink hover:bg-hover transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={logActivityMutation.isPending}
                  className="flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2 text-xs font-semibold text-inverse shadow-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {logActivityMutation.isPending ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Send className="h-3.5 w-3.5" />
                  )}
                  <span>Save Activity</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
