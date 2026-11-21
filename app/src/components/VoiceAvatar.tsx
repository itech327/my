// Generated pattern from the voice id. No photos.
function hash(s: string) { let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h; }

export function VoiceAvatar({ id }: { id: string }) {
  const h = hash(id);
  const bars = [0, 1, 2, 3, 4].map((i) => 6 + ((h >>> (i * 3)) % 7) * 2); // unsigned shift: never a negative bar
  return (
    <svg viewBox="0 0 48 48" className="size-avatar shrink-0 rounded-pill bg-accent-soft text-accent" aria-hidden>
      {bars.map((b, i) => <rect key={i} x={10 + i * 6} y={24 - b} width="3" height={b * 2} rx="1.5" fill="currentColor" />)}
    </svg>
  );
}
