"""Score + SFX (+ Nasser VO when present) for the vertical TikTok cut → build/audio/mix_short.wav."""
import json
import os
import subprocess
from pathlib import Path

import numpy as np
from scipy.signal import butter, sosfilt

F = Path(__file__).resolve().parent.parent
SR = 48000
BA = bool(os.environ.get("BA"))
TL = json.loads((F / ("script/before_after_timeline.json" if BA else "script/short_timeline.json")).read_text(encoding="utf-8"))
DUR = TL["duration"]; N = int(DUR * SR) + SR
SC = {s["id"]: s for s in TL["scenes"]}
rng = np.random.default_rng(7)
BEAT = 60 / 112


def lp(x, hz): return sosfilt(butter(2, hz, "low", fs=SR, output="sos"), x)
def hp(x, hz): return sosfilt(butter(2, hz, "high", fs=SR, output="sos"), x)
def tv(s): return np.arange(int(s * SR)) / SR
def midi(m): return 440 * 2 ** ((m - 69) / 12)
def cue(sid, i): return SC[sid]["cues"][i]["start"]


def place(buf, sig, at, g=1.0, pan=0.0):
    i = int(at * SR)
    if i < 0: sig, i = sig[-i:], 0
    sig = sig[: max(0, len(buf) - i)]
    buf[i:i + len(sig), 0] += sig * g * np.cos((pan + 1) * np.pi / 4) * 1.414
    buf[i:i + len(sig), 1] += sig * g * np.sin((pan + 1) * np.pi / 4) * 1.414


if BA:  # before/after: no silence beat; groove from the first round; end card after the CTA
    stop, title, groove0, end_card = 0.0, 0.0, SC["ba_excel"]["start"], SC["ba_end"]["cues"][1]["end"] + .5
else:
    stop = cue("s_hook", 2) - .05; title = cue("s_hook", 3) + .9; groove0 = SC["s_analyze"]["start"]; end_card = SC["s_finale"]["cues"][2]["end"] + .6
music = np.zeros((N, 2)); sfx = np.zeros((N, 2))
# pad (Dm Bb F C), off during the silence
prog = [[62, 65, 69], [62, 65, 70], [65, 69, 72], [64, 67, 72]]
t0, k = 0.0, 0
while t0 < DUR:
    tt = tv(4 * BEAT * 2 + 1)
    sig = sum(np.sin(2 * np.pi * midi(m + d) * tt + rng.uniform(0, 6)) for m in prog[k % 4] + [prog[k % 4][0] - 12] for d in (-.1, 0, .1))
    sig = lp(sig * np.minimum(1, tt / 1.2) * np.minimum(1, (tt[-1] - tt) / 1.0) / 12, 2000)
    place(music, sig, t0); t0 += 8 * BEAT; k += 1
lvl = (np.interp(np.arange(N) / SR, [0, 1, DUR - 3, DUR - .3, DUR], [.4, .7, 1, 0, 0]) if BA else
       np.interp(np.arange(N) / SR, [0, stop - .05, stop, title - .3, title, DUR - 3, DUR - .3, DUR], [.5, .6, 0, 0, .8, 1, 0, 0]))
music *= lvl[:, None]
# groove
kt = tv(.4); kick = np.sin(2 * np.pi * (45 + 110 * np.exp(-kt * 18)) * kt) * np.exp(-kt * 7)
ht = tv(.05); hat = hp(rng.standard_normal(len(ht)), 7000) * np.exp(-ht * 80) * .25
rh = np.zeros((N, 2)); i = 0
while i * BEAT / 2 < DUR:
    at = i * BEAT / 2; root = [50, 46, 41, 48][int(at / (8 * BEAT)) % 4]; t8 = tv(BEAT / 2 * .9)
    place(rh, lp(np.sin(2 * np.pi * midi(root) * t8) * np.exp(-t8 * 8) * .4, 900), at)
    ta = tv(.2); note = prog[int(at / (8 * BEAT)) % 4][i % 3] + 12
    place(rh, lp((2 * np.abs(2 * ((midi(note) * ta) % 1) - 1) - 1) * np.exp(-ta * 16) * .12, 4000), at, pan=.3 if i % 2 else -.3)
    if i % 2: place(rh, hat, at, pan=.2)
    if i % 4 == 0: place(rh, kick, at, .9)
    i += 1
rl = np.interp(np.arange(N) / SR, [0, groove0 - .5, groove0, end_card - 1, end_card, DUR], [0, 0, .9, .9, 0, 0])
music += rh * rl[:, None]


def whoosh(sec=.6):
    tt = tv(sec); n = hp(rng.standard_normal(len(tt)), 800)
    return lp(n, 6000) * np.sin(np.pi * tt / sec) ** 2 * .5
def impact(g=1.0):
    tt = tv(2.0); return (np.sin(2 * np.pi * (32 + 70 * np.exp(-tt * 6)) * tt) * np.exp(-tt * 1.8) + lp(rng.standard_normal(len(tt)), 2500) * np.exp(-tt * 9) * .5) * g
def ping(f, f2):
    tt = tv(.3); return (np.sin(2 * np.pi * f * tt) * np.exp(-tt * 18) + np.sin(2 * np.pi * f2 * tt) * np.exp(-np.clip(tt - .06, 0, None) * 18) * (tt > .06)) * .25
def riser(sec):
    tt = tv(sec); return hp(rng.standard_normal(len(tt)), 1500) * (tt / sec) ** 2.5 * .35


for kk in range(0 if BA else 14):
    st = .2 + (stop - .5) * (1 - (1 - kk / 14) ** 1.7); place(sfx, ping(*((1318.5, 1760) if kk % 2 else (987.8, 1318.5))), st, .6, pan=rng.uniform(-.6, .6))
if not BA:
    place(sfx, riser(title - stop - .3), stop + .3, .5); place(sfx, impact(1.1), title, .8)
else:  # a "tick" on every قبل line, a bright riser + impact into every بعد line
    for s in TL["scenes"]:
        if s["id"] in ("ba_excel", "ba_app", "ba_policy"):
            b0, a0 = s["cues"][0]["start"], s["cues"][1]["start"]
            tk = b0
            while tk < a0 - .3:
                place(sfx, np.sin(2 * np.pi * 2600 * tv(.03)) * np.exp(-tv(.03) * 120) * .3, tk, .5, pan=.3); tk += .25
            place(sfx, riser(.8), a0 - .8, .5); place(sfx, impact(.8), a0, .6)
for s in TL["scenes"][1:]:
    place(sfx, whoosh(.7), s["start"] - .35, .7, pan=rng.uniform(-.4, .4)); place(sfx, impact(.6), s["start"], .45)
for s in TL["scenes"]:
    for q in s["cues"]:
        if q["prompt"]:
            t = q["start"]
            while t < q["end"] - .2:
                ct = tv(.03); place(sfx, hp(rng.standard_normal(len(ct)), 2500) * np.exp(-ct * 260) * .22, t, .5); t += rng.uniform(.05, .1)
place(sfx, impact(1.3), end_card, .9)

vo = np.zeros((N, 2)); have = False
for s in TL["scenes"]:
    mp3 = F / "build/audio/vo" / f"{s['id']}.mp3"
    if mp3.exists() and s.get("vo_offset") is not None:
        raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(mp3), "-f", "f32le", "-ac", "1", "-ar", str(SR), "-"], capture_output=True, check=True).stdout
        place(vo, np.frombuffer(raw, dtype=np.float32).astype(np.float64), s["start"] + s["vo_offset"]); have = True
nm = lambda x, p: x * (p / np.abs(x).max()) if np.abs(x).max() > 0 else x
if have:
    e = np.convolve(np.abs(vo[:, 0]), np.ones(int(.25 * SR)) / int(.25 * SR), mode="same")
    music *= (1 - .55 * np.clip(e / (e.max() * .25 + 1e-9), 0, 1))[:, None]
mix = nm(music, .5) * (.55 if have else .8) + nm(sfx, .6) * .55 + (nm(vo, .95) if have else 0)
mix = np.tanh(mix * 1.2) / np.tanh(1.2)
out = F / "build/audio"; out.mkdir(parents=True, exist_ok=True)
subprocess.run(["ffmpeg", "-y", "-v", "error", "-f", "s16le", "-ar", str(SR), "-ac", "2", "-i", "-", "-af",
                f"loudnorm=I={-14 if have else -16}:TP=-1.5:LRA=11,alimiter=limit=0.89", "-ar", str(SR), "-c:a", "pcm_s16le", str(out / ("mix_ba.wav" if BA else "mix_short.wav"))],
               input=(np.clip(mix, -1, 1) * 32767).astype("<i2").tobytes(), check=True)
print(f"short audio ok — {DUR:.1f}s, voice: {'Nasser' if have else 'not yet'}")
