/**
 * Global film-grain overlay. Neutral, sits above the page background via
 * soft-light blend. Pointer-events none so it never blocks interaction.
 */
export function Grain() {
  return <div className="grain-layer" aria-hidden="true" />;
}
