#!/usr/bin/env python3
"""Design one Gemini voice per speaking mode and gender (Voice design API).

    gemini_design_voices.py OUT.json [--samples DIR]

Accent is a permanent trait, so it goes in the voice design, not in the
per-request style text (Google docs, voice-design page, read 2026-11-21).
POST /v1beta/voices, type "prompted", store true, language_code ar-MA.
Key: GEMINI_API_KEY. In the cloud session the network proxy injects it instead.
Existing ids in OUT.json are kept, so the script can be rerun after a 429.
"""
import argparse
import base64
import json
import os
import time
import urllib.error
import urllib.request

URL = 'https://generativelanguage.googleapis.com/v1beta/voices'
MODEL = 'gemini-3.8-flash-tts'

# Two speaking modes (the user's priority): general Darija for explaining and
# talking, and Standard Arabic read the way Moroccans read it. Regional accents
# were tested too (they work) but are not needed: general Darija is enough.
REGIONS = {
    'darija': 'speaking simple, general Moroccan Darija that every Moroccan understands',
    # first fusha prompt drifted into Darija words (ear test): now the voice became
    # the Darija female voice, and the prompt insists on reading word for word
    'fusha': ('a Moroccan news anchor on national television who reads Modern Standard Arabic (Fusha) word for word'
              ' exactly as written, never switching to Darija, with a Moroccan voice and intonation'),
}
PERSON = {'female': 'A warm young woman in her late 20s', 'male': 'A warm, friendly man in his early 30s'}


def post(body: dict) -> dict:
    for i in range(6):
        req = urllib.request.Request(URL, json.dumps(body).encode(),
                                     {'Content-Type': 'application/json', 'x-goog-api-key': os.environ.get('GEMINI_API_KEY', 'proxy-injected')})
        try:
            return json.load(urllib.request.urlopen(req, timeout=120))
        except urllib.error.HTTPError as e:
            if e.code not in (429, 500, 503):
                raise SystemExit(f'{e.code}: {e.read()[:300]!r}')
            time.sleep(20 * (i + 1))
    raise SystemExit('gave up after retries')


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('out')
    ap.add_argument('--samples')
    a = ap.parse_args()
    ids = json.load(open(a.out)) if os.path.exists(a.out) else {}
    for region, where in REGIONS.items():
        for gender, person in PERSON.items():
            key = f'{region}-{gender}'
            if key in ids:
                continue
            d = post({'store': True, 'voice': {
                'model': MODEL, 'type': 'prompted', 'display_name': f'Sada {region} {gender}',
                'gender': gender, 'language_code': 'ar-MA',
                'prompted': {'input': f'{person} {where}, like a native Moroccan.'}}})
            ids[key] = d['id']
            json.dump(ids, open(a.out, 'w'), indent=2, sort_keys=True)
            if a.samples and d.get('sample_audio', {}).get('data'):
                os.makedirs(a.samples, exist_ok=True)
                open(os.path.join(a.samples, f'{key}.wav'), 'wb').write(base64.b64decode(d['sample_audio']['data']))
            print(key, d['id'], flush=True)
            time.sleep(5)


if __name__ == '__main__':
    main()
