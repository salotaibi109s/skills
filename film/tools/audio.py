"""Procedural score + sound design for CLAUDE — BEYOND THE CHAT, driven by script/timeline.json.

Outputs (film/build/audio/): music.wav, sfx.wav, vo.wav (if voice files exist), mix.wav.
Everything is synthesised here (no third-party samples), so the soundtrack is licence-free.

Arc: subtle suspense → notification chaos → total silence → reveal swell + impact
→ electronic pulse under the demonstrations → inspiring orchestral-electronic climax.
Music is ducked under the narration whenever a voice track is present.
"""
import json
import subprocess
from pathlib import Path

import numpy as np
from scipy.signal import butter, sosfilt

F = Path(__file__).resolve().parent.parent
SR = 48000
TL = json.loads((F / "script/timeline.json").read_text(encoding="utf-8"))
DUR = TL["duration"]
N = int(DUR * SR) + SR
SC = {s["id"]: s for s in TL["scenes"]}
rng = np.random.default_rng(2026)
BPM = 110.0
BEAT = 60 / BPM


def t_of(scene, i):
    return SC[scene]["cues"][i]["start"]


def lp(x, hz, order=2):
    return sosfilt(butter(order, hz, "low", fs=SR, output="sos"), x)


def hp(x, hz, order=2):
    return sosfilt(butter(order, hz, "high", fs=SR, output="sos"), x)


def bp(x, lo, hi):
    return sosfilt(butter(2, [lo, hi], "band", fs=SR, output="sos"), x)


def place(buf, sig, at, gain=1.0, pan=0.0):
    i = int(at * SR)
    if i >= len(buf) or i + len(sig) <= 0:
        return
    if i < 0:
        sig, i = sig[-i:], 0
    sig = sig[: len(buf) - i]
    l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    buf[i:i + len(sig), 0] += sig * gain * l * 1.414
    buf[i:i + len(sig), 1] += sig * gain * r * 1.414


def env_adsr(n, a, d, s, r):
    a, d, r = int(a * SR), int(d * SR), int(r * SR)
    e = np.full(n, s, dtype=np.float64)
    e[:a] = np.linspace(0, 1, max(a, 1))[:a]
    e[a:a + d] = np.linspace(1, s, max(d, 1))[: len(e[a:a + d])]
    if r:
        e[-r:] *= np.linspace(1, 0, r)
    return e


def tvec(sec):
    return np.arange(int(sec * SR)) / SR


def midi(m):
    return 440.0 * 2 ** ((m - 69) / 12)


# ---------- automation curves (per-sample) ----------
def curve(points):
    """Piecewise-linear automation from [(time, value), ...]."""
    xs, ys = zip(*points)
    return np.interp(np.arange(N) / SR, xs, ys)


s = {k: (v["start"], v["end"]) for k, v in SC.items()}
hook_stop = t_of("hook", 6)  # "والأغرب؟" → total silence
reveal = hook_stop + 0.7
title = t_of("hook", 10) + 0.2

# overall intensity of the bed (0..1) and of the rhythm section
pad_lvl = curve([(0, .0), (2, .25), (hook_stop - .05, .35), (hook_stop, 0), (reveal, 0), (title, .7), (s["hook"][1], .55),
                 (s["analyze"][1], .5), (s["artifacts"][1], .55), (s["code"][1], .55), (s["skills"][1], .55),
                 (s["delegate"][1], .55), (s["connect"][1], .6), (s["finale"][0] + 20, .5), (t_of("finale", 13), .75),
                 (t_of("finale", 16), 1.0), (DUR - 6, 1.0), (DUR - .5, 0), (DUR, 0)])
rhythm = curve([(0, 0), (s["analyze"][0] + 2, 0), (s["analyze"][0] + 6, .55), (s["artifacts"][0], .7), (s["code"][0], .85),
                (s["skills"][0], .7), (s["delegate"][0], .85), (s["connect"][0], .9), (s["finale"][0], .4),
                (t_of("finale", 7), 0), (t_of("finale", 13), 0), (t_of("finale", 13) + 2, .9), (DUR - 9, .9), (DUR - 7.5, 0), (DUR, 0)])

# ---------- MUSIC ----------
music = np.zeros((N, 2))
prog = [(50, [62, 65, 69]), (46, [62, 65, 70]), (41, [65, 69, 72]), (48, [64, 67, 72])]  # Dm Bb F C
bar = 4 * BEAT
t0 = 0.0
k = 0
while t0 < DUR:
    root, chord = prog[(k // 2) % 4]
    length = 2 * bar
    tt = tvec(length + 1.5)
    sig = np.zeros_like(tt)
    for m in chord + [chord[0] + 12]:
        for det in (-0.12, 0.0, 0.11):
            f = midi(m + det)
            sig += 0.5 * np.sin(2 * np.pi * f * tt + rng.uniform(0, 6)) + 0.18 * np.sin(4 * np.pi * f * tt)
    sig *= env_adsr(len(tt), 1.4, .1, 1, 1.5) / 14
    sig = lp(sig, 2200)
    place(music, sig, t0, 1.0, pan=-0.2)
    place(music, sig, t0 + 0.013, 1.0, pan=0.2)
    # sub bass sustained
    sub = np.sin(2 * np.pi * midi(root - 12) * tt) * env_adsr(len(tt), .3, .1, 1, 1.2) * .22
    place(music, sub, t0, 1.0)
    t0 += length
    k += 1
music *= pad_lvl[:, None]

# rhythm section: pulsing bass 8ths, arpeggio 16ths, hats, kicks
rhy = np.zeros((N, 2))
step = BEAT / 2
kick_t = tvec(.45)
kick = np.sin(2 * np.pi * (45 + 110 * np.exp(-kick_t * 18)) * kick_t) * np.exp(-kick_t * 7)
hat_t = tvec(.06)
hat = hp(rng.standard_normal(len(hat_t)), 7000) * np.exp(-hat_t * 70) * .25
i = 0
tt8 = tvec(step * .9)
while i * step < DUR:
    at = i * step
    bi = int(at / (2 * bar)) % 4
    root, chord = prog[bi]
    # bass pulse
    b = np.sin(2 * np.pi * midi(root) * tt8) * np.exp(-tt8 * 9) * .35
    b += .15 * np.sign(np.sin(2 * np.pi * midi(root) * tt8)) * np.exp(-tt8 * 14)
    place(rhy, lp(b, 900), at, 1.0)
    # arpeggio (16ths)
    for h in range(2):
        a16 = at + h * step / 2
        note = (chord + [chord[0] + 12])[(i * 2 + h) % 4] + 12
        ta = tvec(.22)
        ar = (2 * np.abs(2 * ((midi(note) * ta) % 1) - 1) - 1) * np.exp(-ta * 16) * .12
        place(rhy, lp(ar, 4200), a16, 1.0, pan=.35 if h else -.35)
    if i % 2 == 1:
        place(rhy, hat, at, 1.0, pan=.25)
    if i % 4 == 0:
        place(rhy, kick, at, .9)
    i += 1
music += rhy * rhythm[:, None]

# hook suspense drone (before silence)
dt = tvec(hook_stop)
drone = (np.sin(2 * np.pi * 36.7 * dt) * .3 + lp(rng.standard_normal(len(dt)), 300) * .25) * np.linspace(0, 1, len(dt)) ** 1.5
place(music, drone, 0, .8)

# finale climax: brass-like swell + timpani hits on the last line and the final card
fin0 = t_of("finale", 13)
ft = tvec(DUR - fin0)
swell = np.zeros_like(ft)
for m in (50, 57, 62, 65, 69, 74):
    f = midi(m)
    swell += sum(np.sin(2 * np.pi * f * h * ft) / h ** 1.3 for h in range(1, 6))
swell = lp(swell, 2600) * np.clip(ft / 10, 0, 1) ** 1.5 * .05
swell *= np.clip((DUR - fin0 - ft) / 3.0, 0, 1)
place(music, swell, fin0, 1.0, pan=-.1)
place(music, swell, fin0 + .017, 1.0, pan=.1)

# ---------- SFX ----------
sfx = np.zeros((N, 2))


def whoosh(sec=.9, up=True):
    tt = tvec(sec)
    n = rng.standard_normal(len(tt))
    f0, f1 = (300, 5000) if up else (5000, 300)
    out = np.zeros_like(n)
    seg = 8
    for j in range(seg):
        a, b = j * len(n) // seg, (j + 1) * len(n) // seg
        fc = f0 * (f1 / f0) ** (j / seg)
        out[a:b] = bp(n, fc * .6, min(fc * 1.6, 20000))[a:b]
    return out * np.sin(np.pi * tt / sec) ** 2 * .5


def impact(gain=1.0):
    tt = tvec(2.5)
    boom = np.sin(2 * np.pi * (32 + 70 * np.exp(-tt * 6)) * tt) * np.exp(-tt * 1.6)
    crack = lp(rng.standard_normal(len(tt)), 2500) * np.exp(-tt * 9) * .5
    return (boom + crack) * gain


def riser(sec=2.0):
    tt = tvec(sec)
    n = rng.standard_normal(len(tt))
    return hp(n, 1500) * (tt / sec) ** 2.5 * .35 + np.sin(2 * np.pi * (200 + 800 * (tt / sec) ** 2) * tt) * (tt / sec) ** 3 * .12


def ping(f=1318.5, f2=1760.0):
    tt = tvec(.35)
    return (np.sin(2 * np.pi * f * tt) * np.exp(-tt * 18) + np.sin(2 * np.pi * f2 * tt) * np.exp(-(tt - .07).clip(0) * 18) * (tt > .07)) * .25


def blip(f=2200):
    tt = tvec(.08)
    return np.sin(2 * np.pi * f * tt) * np.exp(-tt * 50) * .2


def key_click():
    tt = tvec(.03)
    return hp(rng.standard_normal(len(tt)), 2500) * np.exp(-tt * 260) * .22


def glitch(sec=.5):
    tt = tvec(sec)
    x = np.sign(np.sin(2 * np.pi * rng.uniform(80, 900) * tt)) * .2
    x *= (rng.random(len(tt) // 400 + 1).repeat(400)[: len(tt)] > .4)
    return x + hp(rng.standard_normal(len(tt)), 3000) * .15 * (rng.random(len(tt) // 800 + 1).repeat(800)[: len(tt)] > .6)


# hook: accelerating notifications (same schedule as the engine's toasts), clock ticks, papers
a0, a1, n = .25, t_of("hook", 3), 22
for kk in range(n):
    st = a0 + (a1 - a0) * (1 - (1 - kk / n) ** 1.8)
    place(sfx, ping(*(1318.5, 1760.0) if kk % 2 else (987.8, 1318.5)), st, .55 + .02 * kk, pan=rng.uniform(-.7, .7))
tk = .5
while tk < a1:
    place(sfx, blip(3200), tk, .35, pan=.4)
    tk += max(.08, .5 - tk * .03)
for cut in np.arange(.5, a1, .72):
    place(sfx, whoosh(.35), cut - .15, .25, pan=rng.uniform(-.5, .5))
place(sfx, glitch(.35), hook_stop - .35, .6)
# reveal swell + title impact
place(sfx, riser(title - reveal), reveal, .5)
place(sfx, impact(1.1), title, .8)
place(sfx, glitch(.4), title, .35)

# scene transitions: each with its own sound
kinds = {1: ("burst", 1.0), 2: ("shards", .8), 3: ("pixel", .8), 4: ("door", .9), 5: ("zoom", .9), 6: ("glitch", .8), 7: ("converge", .9)}
for kk, sc in enumerate(TL["scenes"][1:], start=1):
    b = sc["start"]
    kind, g = kinds[kk]
    place(sfx, riser(1.6), b - 1.6, .35 * g)
    if kind in ("burst", "door", "converge"):
        place(sfx, impact(.9), b, .7 * g)
    if kind in ("shards", "zoom", "burst"):
        place(sfx, whoosh(1.0), b - .5, .8 * g, pan=-.3)
    if kind in ("pixel", "glitch"):
        place(sfx, glitch(.6), b - .3, .7 * g)
    if kind == "zoom":
        place(sfx, whoosh(1.2, up=False), b, .5 * g, pan=.3)

# prompt typing: keyboard clicks while each prompt line types on screen
for sc in TL["scenes"]:
    for cue in sc["cues"]:
        if cue["prompt"]:
            tk = cue["start"]
            while tk < cue["end"] - .2:
                place(sfx, key_click(), tk, .5, pan=rng.uniform(-.2, .2))
                tk += rng.uniform(.055, .11)
            place(sfx, blip(1600), cue["end"] - .15, .4)

# interface accents on scene beats
for sid, idx in [("analyze", 12), ("artifacts", 1), ("artifacts", 11), ("code", 1), ("code", 14), ("skills", 1), ("skills", 8),
                 ("delegate", 4), ("delegate", 11), ("connect", 2), ("connect", 5), ("finale", 8), ("finale", 13)]:
    place(sfx, whoosh(.6), t_of(sid, idx) - .3, .35, pan=rng.uniform(-.4, .4))
    place(sfx, blip(1800), t_of(sid, idx), .4)
for sid, idx in [("code", 1), ("finale", 8)]:
    place(sfx, impact(.7), t_of(sid, idx), .5)
# final card impact
fin_card = SC["finale"]["cues"][16]["end"] + .9
place(sfx, impact(1.2), fin_card, .9)
place(sfx, glitch(.3), fin_card, .3)

# ---------- VOICE (Nasser, ElevenLabs) if available ----------
vo = np.zeros((N, 2))
vo_dir = F / "build/audio/vo"
have_vo = False
for sc in TL["scenes"]:
    mp3 = vo_dir / f"{sc['id']}.mp3"
    if mp3.exists() and sc.get("vo_offset") is not None:
        raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(mp3), "-f", "f32le", "-ac", "1", "-ar", str(SR), "-"],
                             capture_output=True, check=True).stdout
        x = np.frombuffer(raw, dtype=np.float32).astype(np.float64)
        place(vo, x, sc["start"] + sc["vo_offset"], 1.0)
        have_vo = True

# ---------- mix ----------
if have_vo:
    m = np.abs(vo[:, 0])
    k = int(.25 * SR)
    envv = np.convolve(m, np.ones(k) / k, mode="same")
    duck = 1 - .55 * np.clip(envv / (envv.max() * .25 + 1e-9), 0, 1)
    music_d = music * duck[:, None]
else:
    music_d = music


def norm(x, peak=.9):
    p = np.abs(x).max()
    return x * (peak / p) if p > 0 else x


music_s, sfx_s = norm(music_d, .5), norm(sfx, .6)
mix = music_s * (.55 if have_vo else .8) + sfx_s * .55 + (norm(vo, .95) if have_vo else 0)
mix = np.tanh(mix * 1.2) / np.tanh(1.2)
out = F / "build/audio"
out.mkdir(parents=True, exist_ok=True)


def write(name, x):
    x = np.clip(x, -1, 1)
    data = (x * 32767).astype("<i2").tobytes()
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-f", "s16le", "-ar", str(SR), "-ac", "2", "-i", "-", str(out / name)],
                   input=data, check=True)


write("music.wav", music_s)
write("sfx.wav", sfx_s)
if have_vo:
    write("vo.wav", norm(vo, .95))
write("mix_raw.wav", mix)
subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", str(out / "mix_raw.wav"), "-af", f"loudnorm=I={-14 if have_vo else -16}:TP=-1.5:LRA=11,alimiter=limit=0.89",
                "-ar", str(SR), "-c:a", "pcm_s16le", str(out / "mix.wav")], check=True)
(out / "mix_raw.wav").unlink()
print(f"audio ok — {DUR:.1f}s, voice: {'Nasser (ElevenLabs)' if have_vo else 'not yet'}")
