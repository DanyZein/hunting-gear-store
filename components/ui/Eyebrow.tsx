import { cn } from "@/lib/cn";

/**
 * The small mono label above a headline. `tone` picks the ink rather than a
 * className override, because two colour utilities on one element have an
 * unpredictable winner in Tailwind.
 */
export function Eyebrow({
  tone = "paper",
  className,
  children,
}: {
  tone?: "paper" | "chrome";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <p
      className={cn(
        "font-mono text-[0.66rem] font-medium tracking-[0.2em] uppercase",
        tone === "paper" ? "text-fg-3" : "text-chrome-fg-2",
        className,
      )}
    >
      {children}
    </p>
  );
}
