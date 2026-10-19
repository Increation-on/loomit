/* eslint-disable @next/next/no-img-element */
export function GlitchLine() {
  return (
    <div className="pointer-events-none absolute bottom-0 left-0 w-full px-4">
      <img src="/glitch-line.png" alt="glitch line" className="z-20 h-0.5 w-full object-cover" />
    </div>
  );
}
