import { cn } from "@/lib/cn";

/** The dimmed backdrop behind a drawer. Rendered per drawer; only one is ever open. */
export function Scrim({ open, onClick }: { open: boolean; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      aria-hidden="true"
      className={cn(
        "fixed inset-0 z-90 bg-[rgba(6,9,6,0.62)] backdrop-blur-[3px] transition-opacity duration-300",
        open ? "opacity-100" : "pointer-events-none opacity-0",
      )}
    />
  );
}
