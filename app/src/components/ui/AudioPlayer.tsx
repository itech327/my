'use client';
import { useEffect, useRef, useState } from 'react';
import { Download, Loader2, Pause, Play, RotateCcw } from 'lucide-react';
import { formatSeconds } from '@/lib/text';
import { cn } from '@/lib/cn';

const STOP_OTHERS = 'player:play';

export function AudioPlayer({ src, label, downloadName, initialDuration, className }: {
  src: string; label: string; downloadName?: string; initialDuration?: number; className?: string;
}) {
  const ref = useRef<HTMLAudioElement>(null);
  const [state, setState] = useState<'idle' | 'loading' | 'playing' | 'paused' | 'ended' | 'error'>('idle');
  const [t, setT] = useState(0);
  const [dur, setDur] = useState(initialDuration ?? 0);

  useEffect(() => {
    const stop = (e: Event) => { if ((e as CustomEvent).detail !== ref.current) ref.current?.pause(); };
    window.addEventListener(STOP_OTHERS, stop);
    return () => window.removeEventListener(STOP_OTHERS, stop);
  }, []);

  const toggle = async () => {
    const a = ref.current; if (!a) return;
    if (state === 'playing') { a.pause(); return; }
    window.dispatchEvent(new CustomEvent(STOP_OTHERS, { detail: a }));
    if (state === 'ended') a.currentTime = 0;
    setState('loading');
    try { await a.play(); } catch { setState('error'); }
  };

  const seek = (v: number) => { const a = ref.current; if (a && dur) { a.currentTime = v; setT(v); } };
  const stateLabel = state === 'playing' ? 'إيقاف' : 'تشغيل';

  return (
    <div className={cn('flex items-center gap-12 rounded-md bg-surface-sunken p-12', className)}>
      <audio
        ref={ref}
        src={src}
        preload="none"
        onPlaying={() => setState('playing')}
        onPause={() => setState((s) => (s === 'ended' ? s : 'paused'))}
        onEnded={() => setState('ended')}
        onError={() => setState('error')}
        onTimeUpdate={(e) => setT(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDur(e.currentTarget.duration)}
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={`${stateLabel}: ${label}`}
        className="grid size-control-md shrink-0 place-items-center rounded-pill bg-ink text-on-ink"
      >
        {state === 'loading' ? <Loader2 className="size-icon-lg animate-spin" aria-hidden />
          : state === 'playing' ? <Pause className="size-icon-lg" aria-hidden />
          : state === 'ended' ? <RotateCcw className="size-icon-lg" aria-hidden />
          : <Play className="size-icon-lg" aria-hidden />}
      </button>
      <div className="min-w-0 flex-1">
        {state === 'error' ? (
          <p className="text-sm text-danger">تعذّر تحميل الصوت. <button type="button" className="underline" onClick={() => { ref.current?.load(); setState('idle'); }}>إعادة المحاولة</button></p>
        ) : (
          <>
            <input
              type="range" min={0} max={dur || 0} step={0.1} value={Math.min(t, dur || 0)} dir="ltr"
              onChange={(e) => seek(Number(e.target.value))}
              aria-label={`موضع التشغيل: ${label}`}
              aria-valuetext={`${formatSeconds(Math.floor(t))} من ${formatSeconds(Math.floor(dur))}`}
              className="h-badge w-full cursor-pointer accent-ink"
            />
            <div className="flex justify-between text-xs tabular-nums text-text-muted" dir="ltr">
              <span>{formatSeconds(Math.floor(t))}</span>
              <span>{dur ? formatSeconds(Math.round(dur)) : '--:--'}</span>
            </div>
          </>
        )}
      </div>
      {downloadName && (
        <a href={`${src}${src.includes('?') ? '&' : '?'}download=1`} download={downloadName}
          className="grid size-control-md shrink-0 place-items-center rounded-pill border border-border bg-surface text-text hover:bg-bg"
          aria-label={`تنزيل: ${label}`}>
          <Download className="size-icon-lg" aria-hidden />
        </a>
      )}
    </div>
  );
}
