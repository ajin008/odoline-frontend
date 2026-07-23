// src/features/cars/components/refurbishment/add-refurb-item-form.tsx

"use client";

import { useState } from "react";
import {
  Plus,
  Loader2,
  UploadCloud,
  FileText,
  ChevronDown,
} from "lucide-react";
import imageCompression from "browser-image-compression";
import { toast } from "sonner";
import { useAddRefurbItem } from "../../hooks/use-refurbishment";

interface AddRefurbItemFormProps {
  carId: string;
}

const PREDEFINED_CHIPS = [
  "Car Wash & Detailing",
  "Denting & Painting",
  "Tyre Replacement",
  "Battery Replacement",
  "Engine Service",
  "Interior Dry Cleaning",
];

export function AddRefurbItemForm({ carId }: AddRefurbItemFormProps) {
  const addItemMutation = useAddRefurbItem(carId);

  const [itemName, setItemName] = useState("");
  const [cost, setCost] = useState("");
  const [vendorType, setVendorType] = useState<"inhouse" | "outside">(
    "inhouse"
  );
  const [vendorName, setVendorName] = useState("");
  const [billFile, setBillFile] = useState<File | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsCompressing(true);
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        initialQuality: 0.8,
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(file, options);
      setBillFile(compressedFile);
      toast.success("Bill attached and optimized");
    } catch {
      toast.error("Failed to process bill image");
    } finally {
      setIsCompressing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim() || !cost) {
      toast.error("Please enter item name and cost");
      return;
    }

    addItemMutation.mutate(
      {
        item_name: itemName.trim(),
        cost,
        vendor_type: vendorType,
        vendor_name: vendorType === "outside" ? vendorName.trim() : undefined,
        bill: billFile,
      },
      {
        onSuccess: () => {
          setItemName("");
          setCost("");
          setVendorName("");
          setBillFile(null);
        },
      }
    );
  };

  return (
    <div className="space-y-4 select-none font-sans">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-ink font-mono">
          Add Workshop Refurbishment Task
        </h3>
        <span className="text-[11px] text-ink-muted font-medium">
          Select quick preset or enter details
        </span>
      </div>

      {/* Preset Action Chips: Touch-friendly horizontal scroll container */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar -mx-1 px-1">
        {PREDEFINED_CHIPS.map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => setItemName(chip)}
            className={`shrink-0 rounded-xl border px-3 py-1.5 text-xs font-medium transition-all active:scale-95 cursor-pointer ${
              itemName === chip
                ? "bg-accent text-inverse border-accent shadow-sm"
                : "bg-inset border-line text-ink-muted hover:text-ink hover:bg-card"
            }`}
          >
            + {chip}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Item Name Input */}
          <div>
            <label className="block text-[10px] font-bold text-ink-muted uppercase font-mono mb-1">
              Task / Item Name
            </label>
            <input
              type="text"
              placeholder="e.g. Brake Pad Replacement"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="w-full min-h-[44px] rounded-xl border border-line bg-inset px-3.5 py-2.5 text-xs text-ink placeholder:text-ink-subtle focus:outline-none focus:border-accent focus:bg-card transition-all"
            />
          </div>

          {/* Cost Input */}
          <div>
            <label className="block text-[10px] font-bold text-ink-muted uppercase font-mono mb-1">
              Cost (₹)
            </label>
            <input
              type="number"
              placeholder="e.g. 2500"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              className="w-full min-h-[44px] rounded-xl border border-line bg-inset px-3.5 py-2.5 text-xs text-ink placeholder:text-ink-subtle focus:outline-none focus:border-accent focus:bg-card transition-all font-mono"
            />
          </div>

          {/* Vendor Type Dropdown */}
          <div>
            <label className="block text-[10px] font-bold text-ink-muted uppercase font-mono mb-1">
              Vendor Source
            </label>
            <div className="relative">
              <select
                value={vendorType}
                onChange={(e) =>
                  setVendorType(e.target.value as "inhouse" | "outside")
                }
                className="w-full min-h-[44px] appearance-none rounded-xl border border-line bg-inset px-3.5 py-2.5 pr-8 text-xs text-ink focus:outline-none focus:border-accent focus:bg-card transition-all cursor-pointer"
              >
                <option value="inhouse">Inhouse Workshop</option>
                <option value="outside">Outside Vendor</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted" />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-end">
            <button
              type="submit"
              disabled={addItemMutation.isPending || isCompressing}
              className="w-full min-h-[44px] inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-xs font-bold text-inverse hover:bg-accent-hover active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
            >
              {addItemMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4 stroke-[2.5px]" />
              )}
              Add Refurbishment Task
            </button>
          </div>
        </div>

        {/* Conditional Outside Vendor & Bill Upload Row */}
        {vendorType === "outside" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-[10px] font-bold text-ink-muted uppercase font-mono mb-1">
                Outside Vendor Name
              </label>
              <input
                type="text"
                placeholder="e.g. Sharma Motors"
                value={vendorName}
                onChange={(e) => setVendorName(e.target.value)}
                className="w-full min-h-[44px] rounded-xl border border-line bg-inset px-3.5 py-2.5 text-xs text-ink focus:outline-none focus:border-accent focus:bg-card transition-all"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-ink-muted uppercase font-mono mb-1">
                Attach Bill Receipt
              </label>
              <div className="flex items-center gap-2 min-h-[44px]">
                <label className="flex-1 flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-dashed border-line bg-inset px-3.5 text-xs text-ink-muted hover:border-accent hover:bg-card cursor-pointer transition-all">
                  {isCompressing ? (
                    <Loader2 className="h-4 w-4 animate-spin text-accent" />
                  ) : billFile ? (
                    <FileText className="h-4 w-4 text-emerald-600 shrink-0" />
                  ) : (
                    <UploadCloud className="h-4 w-4 text-ink-subtle shrink-0" />
                  )}
                  <span className="truncate">
                    {billFile ? billFile.name : "Attach Bill Photo (Optional)"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                {billFile && (
                  <button
                    type="button"
                    onClick={() => setBillFile(null)}
                    className="text-xs text-danger font-medium hover:underline px-2 cursor-pointer shrink-0"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
