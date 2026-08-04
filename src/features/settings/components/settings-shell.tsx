/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { User, Building2, Download } from "lucide-react";
import { ProfileSettings } from "./profile-settings";
import { ShowroomSetupSettings } from "./showroom-setup-settings";
import { ExportDataSettings } from "./export-data-settings";

const SETTINGS_TABS = [
  { key: "profile", label: "Profile", icon: User },
  { key: "showroom", label: "Showroom Setup", icon: Building2 },
  { key: "export", label: "Export Data", icon: Download },
] as const;

type SettingsTabKey = (typeof SETTINGS_TABS)[number]["key"];

export function SettingsShell() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const tabParam = searchParams.get("tab") as SettingsTabKey | null;
  const initialTab: SettingsTabKey =
    tabParam && SETTINGS_TABS.some((t) => t.key === tabParam)
      ? tabParam
      : "profile";

  const [activeTab, setActiveTab] = useState<SettingsTabKey>(initialTab);

  useEffect(() => {
    if (tabParam && SETTINGS_TABS.some((t) => t.key === tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const handleTabChange = (key: SettingsTabKey) => {
    setActiveTab(key);
    router.replace(`/owner/settings?tab=${key}`, { scroll: false });
  };

  return (
    <div className="w-full space-y-6 select-none font-sans">
      {/* Settings Header & Navigation Bar */}
      <div className="space-y-4 border-b border-line/40 pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-ink font-sans">
            Terminal Settings
          </h1>
          <p className="mt-0.5 text-xs font-medium text-ink-muted">
            Manage owner profile credentials, showroom setups, security privileges, and inventory
            data exports.
          </p>
        </div>

        {/* Minimalist Sub-tabs Navigation */}
        <div className="flex gap-1 overflow-x-auto rounded-lg bg-inset p-1 border border-line/40 w-fit no-scrollbar">
          {SETTINGS_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={[
                  "flex items-center gap-2 rounded-md px-3.5 py-1.5 text-xs font-bold tracking-tight font-sans transition-all duration-200 cursor-pointer whitespace-nowrap",
                  isActive
                    ? "bg-accent text-inverse shadow-xs"
                    : "text-ink-muted hover:text-ink",
                ].join(" ")}
              >
                <Icon
                  className={`h-3.5 w-3.5 ${
                    isActive ? "stroke-[2.5px]" : "stroke-[2px]"
                  }`}
                />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Tab View Content */}
      <div>
        {activeTab === "profile" && <ProfileSettings />}
        {activeTab === "showroom" && <ShowroomSetupSettings />}
        {activeTab === "export" && <ExportDataSettings />}
      </div>
    </div>
  );
}
