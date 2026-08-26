"use client";

import { useState } from "react";
import { UserPlus } from "lucide-react";
import { useMe } from "@/src/features/auth/hooks/use-me";
import { LeadModal } from "@/src/features/leads/components/lead-modal";
import { LeadList } from "@/src/features/leads/components/lead-list";

export default function StaffLeadsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: user } = useMe();
  const isCro = user?.role === "cro";

  return (
    <div className="w-full space-y-5 font-sans select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line/60 pb-4">
        <div className="space-y-1">
          <h1 className="text-xl font-bold tracking-tight text-ink font-sans">
            Customer Leads &amp; Enquiries
          </h1>
          <p className="text-xs text-ink-muted">
            Manage buyer leads, follow-ups, test drives, and customer contacts.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="hidden sm:inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-xs font-semibold text-inverse shadow-sm hover:opacity-90 transition-opacity shrink-0 cursor-pointer"
        >
          <UserPlus className="h-4 w-4 stroke-[2.5px]" />
          <span>Add Lead</span>
        </button>
      </div>

      {/* Infinite Leads List */}
      <LeadList showStaffFilter={isCro} showAssignedRep={isCro} />

      {/* Add Lead Modal */}
      <LeadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
