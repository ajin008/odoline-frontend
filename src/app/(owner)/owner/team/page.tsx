import { Users, Sparkles, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Team | Owner Terminal",
  description: "Manage dealership staff roles, sales agents, and access permissions.",
};

/**
 * Server Component: Owner Team Structure Placeholder Page
 */
export default function TeamPage() {
  return (
    <div className="w-full space-y-6 select-none font-sans">
      {/* Team Header */}
      <div className="space-y-4 border-b border-line/40 pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-ink font-sans">
            Team Management
          </h1>
          <p className="mt-0.5 text-xs font-medium text-ink-muted">
            Manage dealership staff members, sales representatives, and access privileges.
          </p>
        </div>
      </div>

      {/* Structure Placeholder Container */}
      <div className="rounded-xl border border-dashed border-accent/40 bg-accent/5 p-8 text-center space-y-4 max-w-2xl shadow-bento">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-accent text-inverse shadow-sm">
          <Users className="h-6 w-6 stroke-[2.5px]" />
        </div>

        <div className="space-y-1.5 max-w-md mx-auto">
          <div className="flex items-center justify-center gap-1.5">
            <Sparkles className="h-4 w-4 text-accent" />
            <h3 className="text-base font-bold text-ink font-sans">
              Team & Access Control Engine
            </h3>
          </div>
          <p className="text-xs text-ink-muted leading-relaxed">
            Staff invitations, role-based access management, and sales performance modules will be available here.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/15 px-3.5 py-1 text-xs font-mono font-bold text-accent">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>STRUCTURE PLACEHOLDER</span>
        </div>
      </div>
    </div>
  );
}
