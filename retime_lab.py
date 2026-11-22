"""python3 retime_lab.py <dossier_wav> [out.mp4]
Dossier : 01.wav .. 08.wav (un fichier par ligne de voice-script.json, produits par l'outil vocal).
Écrit timings.json (fenêtres recalées), voices.wav (voix placée sur la timeline), puis rend la vidéo et mixe l'audio."""
import sys, os, json, wave, subprocess
d = sys.argv[1]; out = sys.argv[2] if len(sys.argv) > 2 else 'carre-qui-triche-voix.mp4'
here = os.path.dirname(os.path.abspath(__file__))
base = json.load(open(os.path.join(here, 'timings.json')))['lines']
GAP_IN, GAP, TAIL, MIN = 3.0, 0.45, 1.6, 2.2   # intro, pause entre lignes, queue finale, durée minimale d'une fenêtre
def dur(p):
    w = wave.open(p); return w.getnframes() / w.getframerate()
t = GAP_IN; lines = []; plan = []
for i, b in enumerate(base):
    p = os.path.join(d, f'{i+1:02d}.wav'); L = dur(p)
    win = max(MIN, L + 0.35)
    lines.append({'start': round(t, 3), 'end': round(t + win, 3), 'ar': b['ar'], 'fr': b['fr']}); plan.append((p, t + 0.12)); t += win + (GAP if i < len(base) - 1 else 0)
json.dump({'duration': round(t + TAIL, 3), 'lines': lines}, open(os.path.join(here, 'timings.voice.json'), 'w'), ensure_ascii=False, indent=1)
# voices.wav : on place chaque fichier à son départ avec ffmpeg adelay + amix
cmd = ['ffmpeg', '-y', '-loglevel', 'error']; flt = []
for k, (p, s) in enumerate(plan):
    cmd += ['-i', p]; flt.append(f'[{k}:a]aresample=44100,aformat=channel_layouts=mono,adelay={int(s*1000)}:all=1[a{k}]')
flt.append(''.join(f'[a{k}]' for k in range(len(plan))) + f'amix=inputs={len(plan)}:normalize=0,apad=whole_dur={t+TAIL}[o]')
subprocess.run(cmd + ['-filter_complex', ';'.join(flt), '-map', '[o]', '-t', str(t + TAIL), os.path.join(here, 'voices.wav')], check=True)
silent = os.path.join(here, '_silent.mp4')
subprocess.run(['python3', os.path.join(here, 'build_video.py'), silent, 'timings.voice.json'], check=True)
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', silent, '-i', os.path.join(here, 'voices.wav'), '-c:v', 'copy', '-c:a', 'aac', '-b:a', '160k', '-shortest', out], check=True)
print('ok', out)
