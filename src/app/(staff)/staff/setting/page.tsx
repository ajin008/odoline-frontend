import { Settings, Sparkles } from "lucide-react";

export default function StaffSettingPage() {
  return (
    <div className="w-full space-y-5 font-sans select-none">
      <div className="space-y-1 border-b border-line/60 pb-4">
        <h1 className="text-xl font-bold tracking-tight text-ink font-sans">
          Staff Account Settings
        </h1>
        <p className="text-xs text-ink-muted">
          Manage personal profile details, security PIN, and account preferences.
        </p>
      </div>

      <div className="rounded-xl border border-dashed border-line bg-inset p-8 text-center space-y-3">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-card border border-line text-ink-subtle">
          <Settings className="h-6 w-6 stroke-[2px]" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-1.5">
            <Sparkles className="h-4 w-4 text-accent" />
            <h3 className="text-sm font-bold text-ink font-sans">
              Staff Settings Engine Coming Next
            </h3>
          </div>
          <p className="text-xs text-ink-subtle max-w-sm mx-auto">
            Staff profile preferences and PIN change tools will be available here.
          </p>
        </div>
      </div>
    </div>
  );
}
