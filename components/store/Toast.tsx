"use client";

import { useStore } from "@/components/store/StoreProvider";
import { cn } from "@/lib/cn";

/**
 * Transient confirmation for cart actions and the newsletter form.
 *
 * `aria-live="polite"` rather than `role="alert"`: adding to a cart is not an
 * emergency, and an alert would interrupt a screen reader mid-sentence.
 */
export function Toast() {
  const { toastMessage } = useStore();

  return (
    <p
      aria-live="polite"
      className={cn(
        "pad-safe-b fixed bottom-6 left-1/2 z-110 max-w-[calc(100vw-32px)] -translate-x-1/2",
        "rounded-[3px] border border-chrome-line bg-ink px-5 py-3",
        "font-mono text-[0.72rem] tracking-[0.05em] text-chrome-fg",
        "transition-[opacity,transform] duration-200",
        toastMessage
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0",
      )}
    >
      {toastMessage ?? ""}
    </p>
  );
}
