// src/features/cars/components/refurbishment/refurb-task-list.tsx
"use client";

import { useState } from "react";
import { Wrench, Trash2, Loader2, Eye } from "lucide-react";
import { toast } from "sonner";
import {
  RefurbishmentItem,
  refurbishmentApi,
} from "../../api/refurbishment-api";
import {
  useUpdateRefurbItem,
  useDeleteRefurbItem,
} from "../../hooks/use-refurbishment";
import { formatCurrency } from "../../utils/refurbishment-helpers";

interface RefurbTaskListProps {
  carId: string;
  items: RefurbishmentItem[];
  progressPercentage: number;
  onViewBill: (url: string) => void;
}

export function RefurbTaskList({
  carId,
  items,
  progressPercentage,
  onViewBill,
}: RefurbTaskListProps) {
  const updateItemMutation = useUpdateRefurbItem();
  const deleteItemMutation = useDeleteRefurbItem(carId);

  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);
  const [loadingBillId, setLoadingBillId] = useState<string | null>(null);

  // Stable client-side sort order to prevent items from swapping rows when updated
  const sortedItems = [...items].sort((a, b) => {
    const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
    const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
    if (timeA !== timeB) return timeA - timeB;
    return a.id.localeCompare(b.id);
  });

  const handleStatusUpdate = (
    itemId: string,
    newStatus: "pending" | "in_progress" | "done"
  ) => {
    setUpdatingItemId(itemId);
    updateItemMutation.mutate(
      {
        itemId,
        data: { status: newStatus },
      },
      {
        onSettled: () => setUpdatingItemId(null),
      }
    );
  };

  const handleViewBill = async (itemId: string) => {
    setLoadingBillId(itemId);
    try {
      const url = await refurbishmentApi.getBillUrl(itemId);
      onViewBill(url);
    } catch {
      toast.error("Failed to generate secure bill preview");
    } finally {
      setLoadingBillId(null);
    }
  };

  return (
    <div className="space-y-3 select-none font-sans">
      {/* Updated Heading Styling */}
      <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-ink">
        Workshop Task List ({sortedItems.length}) • {progressPercentage}%
        Completed
      </h4>

      {sortedItems.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-card p-8 text-center text-ink-subtle text-xs">
          No refurbishment tasks registered yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {sortedItems.map((item) => {
            const isDone = item.status === "done";
            const isThisRowUpdating = updatingItemId === item.id;

            return (
              <div
                key={item.id}
                className={`relative flex flex-col gap-4 rounded-xl border p-4 transition-all ${
                  isDone
                    ? "border-emerald-500/30 bg-emerald-500/[0.02]"
                    : "border-line bg-card"
                }`}
              >
                {/* Top Row: Icon, Title, Vendor, and Delete Button Inside Card */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                        isDone
                          ? "bg-emerald-600 text-white"
                          : "bg-inset text-ink-subtle border border-line"
                      }`}
                    >
                      <Wrench className="h-4 w-4 stroke-[2px]" />
                    </div>
                    <div className="min-w-0">
                      <h5 className="text-xs font-bold text-ink tracking-tight truncate">
                        {item.item_name}
                      </h5>
                      <div className="flex flex-wrap items-center gap-2 mt-0.5">
                        <p className="text-[11px] font-mono text-ink-muted">
                          Vendor:{" "}
                          <span className="text-ink">
                            {item.vendor_type === "inhouse"
                              ? "Inhouse"
                              : item.vendor_name || "Outside"}
                          </span>
                        </p>
                        {item.bill_url && (
                          <button
                            type="button"
                            onClick={() => handleViewBill(item.id)}
                            disabled={loadingBillId === item.id}
                            className="text-[10px] font-mono font-bold text-accent hover:underline inline-flex items-center gap-1 bg-accent-light/50 px-1.5 py-0.5 rounded border border-accent/20 cursor-pointer disabled:opacity-50"
                          >
                            {loadingBillId === item.id ? (
                              <Loader2 className="h-3 w-3 animate-spin stroke-[2.5px]" />
                            ) : (
                              <Eye className="h-3 w-3 stroke-[2.5px]" />
                            )}
                            View Bill
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Inside Delete Button */}
                  <button
                    type="button"
                    onClick={() => deleteItemMutation.mutate(item.id)}
                    disabled={deleteItemMutation.isPending}
                    className="text-ink-subtle hover:text-danger transition-colors cursor-pointer p-1.5 rounded-lg hover:bg-inset shrink-0"
                    title="Delete task"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Bottom Row: Price & Status Control Tabs */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-line/60">
                  <div className="text-xs font-mono font-bold text-ink">
                    Cost:{" "}
                    <span className="text-sm">
                      ₹{formatCurrency(item.cost)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 bg-inset p-1 rounded-xl border border-line w-full sm:w-auto overflow-x-auto">
                    <button
                      type="button"
                      disabled={isThisRowUpdating}
                      onClick={() => handleStatusUpdate(item.id, "pending")}
                      className={`flex-1 sm:flex-initial px-3 py-1 text-[10px] font-bold rounded-lg transition-colors cursor-pointer disabled:opacity-50 ${
                        item.status === "pending"
                          ? "bg-[#f5b023] text-white"
                          : "text-ink-muted hover:text-ink"
                      }`}
                    >
                      Pending
                    </button>
                    <button
                      type="button"
                      disabled={isThisRowUpdating}
                      onClick={() => handleStatusUpdate(item.id, "in_progress")}
                      className={`flex-1 sm:flex-initial px-3 py-1 text-[10px] font-bold rounded-lg transition-colors cursor-pointer disabled:opacity-50 ${
                        item.status === "in_progress"
                          ? "bg-blue-600 text-white"
                          : "text-ink-muted hover:text-ink"
                      }`}
                    >
                      In Progress
                    </button>
                    <button
                      type="button"
                      disabled={isThisRowUpdating}
                      onClick={() => handleStatusUpdate(item.id, "done")}
                      className={`flex-1 sm:flex-initial px-3 py-1 text-[10px] font-bold rounded-lg transition-colors cursor-pointer disabled:opacity-50 ${
                        item.status === "done"
                          ? "bg-emerald-600 text-white"
                          : "text-ink-muted hover:text-ink"
                      }`}
                    >
                      Done
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
