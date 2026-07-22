// src/features/cars/components/refurbishment/add-refurb-item-form.tsx

"use client";

import { useState } from "react";
import { Plus, Loader2, UploadCloud, FileText } from "lucide-react";
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
      <h3 className="font-heading text-xs font-semibold uppercase tracking-tight text-ink">
        Add Workshop Refurbishment Item
      </h3>

      {/* Preset Action Chips */}
      <div className="flex flex-wrap gap-1.5">
        {PREDEFINED_CHIPS.map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => setItemName(chip)}
            className={`rounded-lg border px-2.5 py-1 text-[11px] font-medium transition-colors cursor-pointer ${
              itemName === chip
                ? "bg-accent text-inverse border-accent"
                : "bg-inset border-line text-ink-muted hover:text-ink hover:bg-card"
            }`}
          >
            + {chip}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 pt-1">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div>
            <input
              type="text"
              placeholder="Item Name"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="w-full rounded-xl border border-line bg-inset px-3.5 py-2.5 text-xs text-ink focus:outline-none focus:border-accent"
            />
          </div>
          <div>
            <input
              type="number"
              placeholder="Cost (₹)"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              className="w-full rounded-xl border border-line bg-inset px-3.5 py-2.5 text-xs text-ink focus:outline-none focus:border-accent"
            />
          </div>
          <div>
            {/* Fixed alignment & vertical centering for the select element */}
            <select
              value={vendorType}
              onChange={(e) =>
                setVendorType(e.target.value as "inhouse" | "outside")
              }
              className="w-full h-[38px] rounded-xl border border-line bg-inset px-3 py-2 text-xs text-ink focus:outline-none focus:border-accent cursor-pointer"
            >
              <option value="inhouse">Inhouse Workshop</option>
              <option value="outside">Outside Vendor</option>
            </select>
          </div>
          <div>
            <button
              type="submit"
              disabled={addItemMutation.isPending || isCompressing}
              className="w-full h-[38px] inline-flex items-center justify-center gap-1.5 rounded-xl bg-accent px-4 text-xs font-bold text-inverse hover:bg-accent-hover transition-all cursor-pointer disabled:opacity-50"
            >
              {addItemMutation.isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Plus className="h-3.5 w-3.5 stroke-[2.5px]" />
              )}
              Add Item
            </button>
          </div>
        </div>

        {/* Conditional Outside Vendor & Bill Upload Row */}
        {vendorType === "outside" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <input
                type="text"
                placeholder="Outside Vendor Name (e.g. Sharma Motors)"
                value={vendorName}
                onChange={(e) => setVendorName(e.target.value)}
                className="w-full rounded-xl border border-line bg-inset px-3.5 py-2.5 text-xs text-ink focus:outline-none focus:border-accent"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="flex-1 h-[38px] flex items-center justify-center gap-2 rounded-xl border border-dashed border-line bg-inset px-3.5 text-xs text-ink-muted hover:border-accent cursor-pointer transition-colors">
                {isCompressing ? (
                  <Loader2 className="h-4 w-4 animate-spin text-accent" />
                ) : billFile ? (
                  <FileText className="h-4 w-4 text-emerald-600" />
                ) : (
                  <UploadCloud className="h-4 w-4 text-ink-subtle" />
                )}
                <span className="truncate">
                  {billFile ? billFile.name : "Attach Bill Image (Optional)"}
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
                  className="text-xs text-danger font-medium hover:underline px-2 cursor-pointer"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
