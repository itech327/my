#!/usr/bin/env python3
"""Placeholder narration: silent clips and a timings.js in tts.py's format, paced by word count.

    python3 tools/svt-1ac/silent_timings.py content/svt-1ac/ch01/narration.ar.json site/svt-1ac/ch01/audio/ar [--wps 1.8]

Used while no voice can be synthesized. Each beat gets <beat>.mp3 (silence) and an entry
{dur, marks, cues, placeholder: true}. A real voice run (tts.py or eleven.py) overwrites both;
the page needs no change because beat ids and mark names stay the same.
"""
import argparse, json, re, subprocess
from pathlib import Path

MARK = re.compile(r"\[\[(\w+)\]\]")
SENT = re.compile(r"[^.؟?!:]+[.؟?!:]?")


def plan(text, wps, lead=0.3, tail=0.5):
    marks, words = {}, []
    tokens = re.split(r"(\[\[\w+\]\])", text)
    for tok in tokens:
        m = MARK.fullmatch(tok)
        if m:
            marks[m.group(1)] = len(words)
        else:
            words += tok.split()
    t = lambda i: round(lead + i / wps, 2)
    clean = re.sub(r"\s+", " ", MARK.sub("", text)).strip()
    cues, i = [], 0
    for s in SENT.findall(clean):
        s = s.strip()
        if s:
            cues.append([t(i), s])
            i += len(s.split())
    dur = round(lead + len(words) / wps + tail, 2)
    return dur, {k: t(v) for k, v in marks.items()}, cues


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("narration"); ap.add_argument("out")
    ap.add_argument("--wps", type=float, default=1.8)
    a = ap.parse_args()
    spec = json.loads(Path(a.narration).read_text(encoding="utf-8-sig"))
    out = Path(a.out); out.mkdir(parents=True, exist_ok=True)
    js = {}
    for beat, raw in spec["beats"].items():
        text = raw["text"] if isinstance(raw, dict) else raw
        dur, marks, cues = plan(text, a.wps)
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "lavfi", "-i", "anullsrc=r=24000:cl=mono",
                        "-t", str(dur), "-c:a", "libmp3lame", "-b:a", "32k", str(out / f"{beat}.mp3")], check=True)
        js[beat] = {"dur": dur, "marks": marks, "cues": cues, "placeholder": True}
        print(f"{beat}: {dur:.1f}s, {len(marks)} marks")
    (out / "timings.js").write_text("window.TIMINGS = " + json.dumps(js, ensure_ascii=False, indent=1) + ";\n", encoding="utf-8")
    print("total", round(sum(v["dur"] for v in js.values()), 1), "s")


if __name__ == "__main__":
    main()
