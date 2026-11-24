#!/usr/bin/env python3
"""python3 build_voiced.py [muet.mp4] [sortie.mp4]
Télécharge les 9 voix d'Akram (voice-script.json) si 01.wav ... 09.wav manquent,
les place à leur instant de départ et les ajoute à la vidéo muette sans la réencoder."""
import json, os, sys, subprocess, urllib.request
here = os.path.dirname(os.path.abspath(__file__))
src = sys.argv[1] if len(sys.argv) > 1 else os.path.join(here, 'pythagore-3ac-muet.mp4')
out = sys.argv[2] if len(sys.argv) > 2 else os.path.join(here, 'pythagore-3ac-akram.mp4')
cfg = json.load(open(os.path.join(here, 'voice-script.json'), encoding='utf-8'))
segs = cfg['segments']; wav = lambda s: os.path.join(here, 'wav', s['n'] + '.wav')
os.makedirs(os.path.join(here, 'wav'), exist_ok=True)
for s in segs:
    if not os.path.exists(wav(s)):
        urllib.request.urlretrieve(cfg['links_base'] + s['audio_id'], wav(s)); print('téléchargé', s['n'])
cmd = ['ffmpeg', '-y', '-loglevel', 'error', '-i', src]
for s in segs: cmd += ['-i', wav(s)]
fl = ';'.join('[%d:a]aresample=48000,adelay=%d:all=1[a%d]' % (k + 1, int(s['start'] * 1000), k) for k, s in enumerate(segs))
fl += ';' + ''.join('[a%d]' % k for k in range(len(segs))) + 'amix=inputs=%d:normalize=0,apad[aout]' % len(segs)
tmp = out[:-4] + '.part.mp4'
cmd += ['-filter_complex', fl, '-map', '0:v', '-map', '[aout]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '160k', '-shortest', '-movflags', '+faststart', tmp]
subprocess.run(cmd, check=True); os.replace(tmp, out); print('done', out)
