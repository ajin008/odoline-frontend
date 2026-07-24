// src/features/cars/components/refurbishment/refurb-task-list.tsx
"use client";

import { useState } from "react";
import { Wrench, Trash2, Loader2, Eye, CheckCircle2, Clock, PlayCircle } from "lucide-react";
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
import { ConfirmModal } from "@/src/components/ui/confirm-modal";

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
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const handleConfirmDelete = () => {
    if (!deleteTargetId) return;
    deleteItemMutation.mutate(deleteTargetId, {
      onSettled: () => setDeleteTargetId(null),
    });
  };

  // Stable client-side sort order
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
    <div className="space-y-4 select-none font-sans">
      {/* Header with Visual Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-ink">
            Workshop Task List ({sortedItems.length})
          </h4>
          <span className="font-mono text-xs font-bold text-accent">
            {progressPercentage}% Completed
          </span>
        </div>

        {/* Animated Visual Progress Bar */}
        <div className="h-2 w-full rounded-full bg-inset border border-line overflow-hidden">
          <div
            className="h-full bg-accent transition-all duration-500 ease-out rounded-full"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {sortedItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-inset p-8 text-center space-y-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-card border border-line text-ink-subtle">
            <Wrench className="h-5 w-5 stroke-[1.75px]" />
          </div>
          <p className="text-xs font-bold text-ink">No refurbishment tasks added yet</p>
          <p className="text-[11px] text-ink-muted max-w-sm">
            Add workshop items above to track repairs, vendor costs, and calculate total landing price.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {sortedItems.map((item) => {
            const isDone = item.status === "done";
            const isInProgress = item.status === "in_progress";
            const isThisRowUpdating = updatingItemId === item.id;

            return (
              <div
                key={item.id}
                className={`relative flex flex-col justify-between gap-3.5 rounded-2xl border p-4 transition-all duration-200 ${
                  isDone
                    ? "border-emerald-500/30 bg-emerald-500/[0.02] shadow-sm"
                    : isInProgress
                    ? "border-blue-500/30 bg-blue-500/[0.02]"
                    : "border-line bg-card hover:border-line-focus"
                }`}
              >
                {/* Top Section: Icon, Title, Vendor Tag & Delete Action */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors ${
                        isDone
                          ? "bg-emerald-600 text-white"
                          : isInProgress
                          ? "bg-blue-600 text-white"
                          : "bg-inset text-ink-subtle border border-line"
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="h-4 w-4 stroke-[2.5px]" />
                      ) : isInProgress ? (
                        <PlayCircle className="h-4 w-4 stroke-[2px]" />
                      ) : (
                        <Clock className="h-4 w-4 stroke-[2px]" />
                      )}
                    </div>

                    <div className="min-w-0 space-y-1">
                      <h5 className="text-xs font-bold text-ink truncate">
                        {item.item_name}
                      </h5>

                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-inset border border-line text-ink-muted">
                          Vendor:{" "}
                          <strong className="ml-1 text-ink">
                            {item.vendor_type === "inhouse"
                              ? "Inhouse"
                              : item.vendor_name || "Outside"}
                          </strong>
                        </span>

                        {item.bill_url && (
                          <button
                            type="button"
                            onClick={() => handleViewBill(item.id)}
                            disabled={loadingBillId === item.id}
                            className="text-[10px] font-mono font-bold text-accent hover:underline inline-flex items-center gap-1 bg-accent-light px-2 py-0.5 rounded-md border border-accent/20 cursor-pointer disabled:opacity-50"
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

                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={() => setDeleteTargetId(item.id)}
                    disabled={deleteItemMutation.isPending}
                    className="text-ink-subtle hover:text-danger transition-colors cursor-pointer p-2 rounded-xl hover:bg-inset shrink-0 min-h-[36px] min-w-[36px] flex items-center justify-center"
                    title="Delete task"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Bottom Section: Cost & Mobile Segmented Status Switcher */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-line/60">
                  <div className="flex items-baseline gap-1 text-xs font-mono font-bold text-ink">
                    <span className="text-ink-muted text-[11px] font-normal uppercase">Cost:</span>
                    <span className="text-sm text-ink font-bold">
                      ₹{formatCurrency(item.cost)}
                    </span>
                  </div>

                  {/* Segmented Control Touch Switcher */}
                  <div className="flex items-center gap-1 bg-inset p-1 rounded-xl border border-line w-full sm:w-auto">
                    <button
                      type="button"
                      disabled={isThisRowUpdating}
                      onClick={() => handleStatusUpdate(item.id, "pending")}
                      className={`flex-1 sm:flex-initial min-h-[36px] px-3 py-1 text-[11px] font-bold rounded-lg transition-all active:scale-95 cursor-pointer disabled:opacity-50 ${
                        item.status === "pending"
                          ? "bg-amber-500 text-white shadow-sm"
                          : "text-ink-muted hover:text-ink"
                      }`}
                    >
                      Pending
                    </button>
                    <button
                      type="button"
                      disabled={isThisRowUpdating}
                      onClick={() => handleStatusUpdate(item.id, "in_progress")}
                      className={`flex-1 sm:flex-initial min-h-[36px] px-3 py-1 text-[11px] font-bold rounded-lg transition-all active:scale-95 cursor-pointer disabled:opacity-50 ${
                        item.status === "in_progress"
                          ? "bg-blue-600 text-white shadow-sm"
                          : "text-ink-muted hover:text-ink"
                      }`}
                    >
                      In Progress
                    </button>
                    <button
                      type="button"
                      disabled={isThisRowUpdating}
                      onClick={() => handleStatusUpdate(item.id, "done")}
                      className={`flex-1 sm:flex-initial min-h-[36px] px-3 py-1 text-[11px] font-bold rounded-lg transition-all active:scale-95 cursor-pointer disabled:opacity-50 ${
                        item.status === "done"
                          ? "bg-emerald-600 text-white shadow-sm"
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

      <ConfirmModal
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleConfirmDelete}
        isLoading={deleteItemMutation.isPending}
        title="Delete Workshop Task"
        description="Are you sure you want to delete this refurbishment task? The cost will be removed from your vehicle landing calculations."
        confirmText="Delete Task"
        cancelText="Cancel"
        variant="danger"
        icon={<Trash2 className="h-5.5 w-5.5 stroke-[2.25px]" />}
      />
    </div>
  );
}
