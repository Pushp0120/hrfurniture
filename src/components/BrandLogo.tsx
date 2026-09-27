import { cn } from "@/lib/utils";

/**
 * The H R FURNITURE logo mark — a wordmark badge in the brand palette
 * (espresso + gold). Replace the SVG with a client-provided logo image
 * by changing the `src` below to e.g. "/hr-logo.png".
 */
export function BrandLogo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "flex size-11 shrink-0 select-none items-center justify-center rounded-xl bg-primary text-primary-foreground ring-1 ring-accent/50",
        className,
      )}
      aria-label="H R Furniture logo"
    >
      <svg viewBox="0 0 32 32" className="size-7" aria-hidden="true">
        <text
          x="16"
          y="21"
          textAnchor="middle"
          fontSize="13"
          fontWeight="700"
          fontFamily="Georgia, 'Times New Roman', serif"
          fill="currentColor"
        >
          HR
        </text>
      </svg>
    </span>
  );
}
