"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { X, Plus, Trash2, CheckCircle2, PhoneCall, User } from "lucide-react";

export interface BookDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BookDemoModal({ isOpen, onClose }: BookDemoModalProps) {
  const [fullName, setFullName] = React.useState("");
  const [phoneNumbers, setPhoneNumbers] = React.useState<string[]>([""]);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [error, setError] = React.useState("");

  // Lock scroll when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleAddNumber = () => {
    if (phoneNumbers.length < 3) {
      setPhoneNumbers([...phoneNumbers, ""]);
    }
  };

  const handleRemoveNumber = (index: number) => {
    if (phoneNumbers.length > 1) {
      setPhoneNumbers(phoneNumbers.filter((_, i) => i !== index));
    }
  };

  const handlePhoneChange = (index: number, value: string) => {
    const updated = [...phoneNumbers];
    updated[index] = value;
    setPhoneNumbers(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!phoneNumbers[0] || !phoneNumbers[0].trim()) {
      setError("Please enter at least one contact number.");
      return;
    }
    setError("");
    setIsSubmitted(true);
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    setFullName("");
    setPhoneNumbers([""]);
    setError("");
    onClose();
  };

  // Portal to <body> so a transformed/animated ancestor (e.g. the hero's
  // entrance animation) can't trap this fixed overlay inside its own box.
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={handleResetAndClose}
    >
      <div
        className="relative w-full max-w-md bg-card rounded-2xl border border-line shadow-float p-6 sm:p-8 text-ink"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={handleResetAndClose}
          className="absolute top-4 right-4 p-2 text-ink-muted hover:text-ink rounded-full hover:bg-inset transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSubmitted ? (
          <div>
            <div className="mb-6">
              <h3 className="font-heading text-2xl font-bold text-ink">
                Book a Free Demo
              </h3>
              <p className="text-sm text-ink-muted mt-1 leading-relaxed">
                Leave your name &amp; contact number. Our team will reach out to you shortly.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-danger-light border border-danger/20 text-danger text-xs font-medium">
                  {error}
                </div>
              )}

              {/* Full Name */}
              <div>
                <label className="block text-xs font-mono font-semibold text-ink-secondary mb-1.5 uppercase tracking-wider">
                  Full Name <span className="text-danger">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-subtle" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jabir / Showroom Owner"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-line bg-inset text-sm text-ink placeholder:text-ink-subtle focus:outline-2 focus:outline-accent"
                  />
                </div>
              </div>

              {/* Contact Numbers */}
              <div className="space-y-2">
                <label className="block text-xs font-mono font-semibold text-ink-secondary mb-1.5 uppercase tracking-wider">
                  Contact Number(s) <span className="text-danger">*</span>
                </label>

                {phoneNumbers.map((phone, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <PhoneCall className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-subtle" />
                      <input
                        type="tel"
                        required={idx === 0}
                        placeholder={idx === 0 ? "e.g. 98765 43210" : "Alternate contact number"}
                        value={phone}
                        onChange={(e) => handlePhoneChange(idx, e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-line bg-inset text-sm text-ink placeholder:text-ink-subtle focus:outline-2 focus:outline-accent"
                      />
                    </div>
                    {idx > 0 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveNumber(idx)}
                        className="p-2.5 rounded-xl text-ink-subtle hover:text-danger hover:bg-danger-light border border-line transition-colors cursor-pointer"
                        title="Remove number"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}

                {phoneNumbers.length < 3 && (
                  <button
                    type="button"
                    onClick={handleAddNumber}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:underline pt-1 cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add another number</span>
                  </button>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-full bg-cta text-cta-ink hover:bg-cta-hover font-semibold text-base shadow-sm transition-all cursor-pointer active:scale-[0.98]"
                >
                  We will reach you
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-4 space-y-4">
            <div className="h-12 w-12 rounded-full bg-lime-light text-lime-ink border border-lime/40 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-heading text-xl font-bold text-ink">
                We will reach you soon!
              </h3>
              <p className="text-sm text-ink-muted mt-2 leading-relaxed">
                Thank you, <span className="font-semibold text-ink">{fullName}</span>. We have received your details and our team will call you at{" "}
                <span className="font-mono text-ink font-semibold">{phoneNumbers.filter(Boolean).join(" / ")}</span>.
              </p>
            </div>
            <button
              type="button"
              onClick={handleResetAndClose}
              className="mt-4 px-6 py-2.5 rounded-full bg-cta text-cta-ink hover:bg-cta-hover text-sm font-semibold transition-all cursor-pointer"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
    ,
    document.body
  );
}
