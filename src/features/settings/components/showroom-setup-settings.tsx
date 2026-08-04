"use client";

import { Building2, Sparkles, ShieldCheck } from "lucide-react";

export function ShowroomSetupSettings() {
  return (
    <div className="space-y-5 select-none font-sans max-w-2xl">
      {/* Showroom Setup Structure Placeholder Card */}
      <div className="rounded-xl border border-dashed border-accent/40 bg-accent/5 p-6 text-center space-y-3.5 shadow-bento">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-accent text-inverse shadow-sm">
          <Building2 className="h-6 w-6 stroke-[2.5px]" />
        </div>

        <div className="space-y-1 max-w-md mx-auto">
          <div className="flex items-center justify-center gap-1.5">
            <Sparkles className="h-4 w-4 text-accent" />
            <h3 className="text-base font-bold text-ink font-sans">
              Showroom Configuration Engine
            </h3>
          </div>
          <p className="text-xs text-ink-muted leading-relaxed">
            Showroom operating hours, secondary branch profiles, GST registry, and branding customization settings will be available here.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/15 px-3 py-1 text-xs font-mono font-bold text-accent">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>STRUCTURE PLACEHOLDER</span>
        </div>
      </div>
    </div>
  );
}
