/** Static markup for the intro curtain and the custom cursor. CSS keeps both hidden unless opted in. */
export function IntroOverlay({ label }: { label: string }) {
  return (
    <div className="intro-overlay flex-col items-start justify-end gap-4 p-[var(--gutter)]" aria-hidden="true">
      <span className="font-mono text-[0.72rem] uppercase tracking-[0.22em] text-bone">
        Daniel Chen<span className="text-signal">.</span>
      </span>
      <span className="font-mono text-[0.72rem] uppercase tracking-[0.18em] text-bone-3">{label}</span>
      <span className="relative h-px w-full bg-line">
        <span className="intro-bar absolute inset-0 bg-signal" />
      </span>
    </div>
  );
}

export function Cursor() {
  return (
    <div className="cursor" aria-hidden="true">
      <div data-cursor-ring className="cursor-ring">
        <div className="cursor-ring-inner">
          <span className="cursor-label">View</span>
        </div>
      </div>
      <div data-cursor-dot className="cursor-dot" />
    </div>
  );
}
