"""Original music bed for the Dabberha reel — synthesized from scratch, no samples, no licence needed.

Ambient corporate, 104 BPM, IV–V–iii–vi in C (Fmaj7 – G6 – Em7 – Am7).
The groove (kick, hats, pluck arpeggio, sub) enters on a downbeat placed exactly
on the logo impact of scene 3 (13.1 s); before that only soft pads play.

    python3 scripts/compose-music.py           # writes public/audio/music/bed.mp3
"""
import json
import subprocess
import sys
import wave
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parent.parent
SR = 44100
BPM = 104
BEAT = 60 / BPM
BAR = 4 * BEAT
LENGTH = 62.0

# Put a downbeat on the logo impact (scene 3 start + lead), read from the timeline.
timeline = json.loads((ROOT / "src/data/timeline.json").read_text())
s3 = next(s for s in timeline["scenes"] if s["id"] == "S3-Reveal")
IMPACT = (s3["from"] + s3["words"][0]["start"]) / timeline["fps"]
OFFSET = IMPACT - 5 * BAR  # bar 5 starts on the impact
while OFFSET < 0:
    OFFSET += BAR
GROOVE_START = IMPACT

N = int(LENGTH * SR)
t = np.arange(N) / SR
rng = np.random.default_rng(7)


def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)


CHORDS = [  # (bass root, chord tones) — Fmaj7, G6, Em7, Am7
    (41, [53, 57, 60, 64]),
    (43, [55, 59, 62, 64]),
    (40, [52, 55, 59, 62]),
    (45, [57, 60, 64, 67]),
]


def env_adsr(n, a, d, s, r, sustain_len):
    a_n, d_n, r_n = int(a * SR), int(d * SR), int(r * SR)
    s_n = max(int(sustain_len * SR) - a_n - d_n, 0)
    e = np.concatenate(
        [
            np.linspace(0, 1, a_n, endpoint=False),
            np.linspace(1, s, d_n, endpoint=False),
            np.full(s_n, s),
            np.linspace(s, 0, r_n),
        ]
    )
    return e[:n] if len(e) >= n else np.pad(e, (0, n - len(e)))


def add(buf, start_s, sig):
    i = int(start_s * SR)
    if i >= len(buf):
        return
    j = min(len(buf), i + len(sig))
    if i < 0:
        sig = sig[-i:]
        i = 0
    buf[i:j] += sig[: j - i]


pads = np.zeros(N)
pluck = np.zeros(N)
bass = np.zeros(N)
kick = np.zeros(N)
hats = np.zeros(N)
clap = np.zeros(N)

# ------------------------------------------------------------------ pads
bar_starts = np.arange(OFFSET - BAR, LENGTH, BAR)
for k, b0 in enumerate(bar_starts):
    root, tones = CHORDS[k % 4]
    dur = BAR + 1.2
    n = int(dur * SR)
    tt = np.arange(n) / SR
    sig = np.zeros(n)
    bright = 0.35 if b0 < GROOVE_START - 0.01 else 1.0
    for note in tones:
        f = midi(note)
        for det in (-0.08, 0.0, 0.07):
            ff = f * 2 ** (det / 12)
            # soft additive "warm saw": few harmonics, darker before the groove
            for h, amp in ((1, 1.0), (2, 0.35 * bright), (3, 0.16 * bright), (4, 0.07 * bright)):
                sig += amp * np.sin(2 * np.pi * ff * h * tt + rng.uniform(0, 6.28))
    sig *= env_adsr(n, 0.9, 0.6, 0.85, 1.2, dur - 1.2)
    sig *= 1 + 0.08 * np.sin(2 * np.pi * 0.25 * tt)  # slow movement
    add(pads, b0, sig)

# ------------------------------------------------------------------ groove
beats = np.arange(OFFSET, LENGTH, BEAT)
for i, b in enumerate(beats):
    if b < GROOVE_START - 1e-3:
        continue
    bar_i = int(round((b - OFFSET) / BAR))
    in_bar = int(round((b - OFFSET) / BEAT)) % 4
    root, tones = CHORDS[bar_i % 4]

    # kick on 1 and 3
    if in_bar in (0, 2):
        n = int(0.45 * SR)
        tt = np.arange(n) / SR
        f = 45 + 75 * np.exp(-tt * 28)
        ph = 2 * np.pi * np.cumsum(f) / SR
        add(kick, b, np.sin(ph) * np.exp(-tt * 7.5))
    # soft clap on 2 and 4
    if in_bar in (1, 3):
        n = int(0.25 * SR)
        tt = np.arange(n) / SR
        noise = rng.standard_normal(n)
        noise = noise - np.concatenate([[0], noise[:-1]]) * 0.6  # tilt brighter
        add(clap, b, noise * np.exp(-tt * 22) * 0.5)
    # closed hats on the off-beat 8ths
    for off in (BEAT / 2,):
        n = int(0.06 * SR)
        tt = np.arange(n) / SR
        noise = rng.standard_normal(n)
        hp = noise - np.concatenate([[0], noise[:-1]])
        add(hats, b + off, hp * np.exp(-tt * 70))
    # sub bass: root on each beat, ducked after the kick
    n = int(BEAT * SR)
    tt = np.arange(n) / SR
    f = midi(root - 12 + 12)
    sb = np.sin(2 * np.pi * f * tt) * (1 - np.exp(-tt * 40)) * np.exp(-tt * 1.2)
    add(bass, b, sb)
    # pluck arpeggio in 8ths, chord tones up an octave
    for e8 in range(2):
        idx = (in_bar * 2 + e8) % 4
        order = [0, 2, 1, 3]
        note = tones[order[idx]] + 12
        n = int(0.6 * SR)
        tt = np.arange(n) / SR
        f = midi(note)
        sig = (
            np.sin(2 * np.pi * f * tt)
            + 0.45 * np.sin(2 * np.pi * 2 * f * tt) * np.exp(-tt * 9)
            + 0.2 * np.sin(2 * np.pi * 3 * f * tt) * np.exp(-tt * 14)
        )
        sig *= np.exp(-tt * 6.5) * (1 - np.exp(-tt * 400))
        add(pluck, b + e8 * BEAT / 2, sig)

# sidechain: pads and bass breathe with the kick
side = np.ones(N)
for b in beats:
    if b < GROOVE_START - 1e-3:
        continue
    i = int(b * SR)
    n = int(0.35 * SR)
    curve = 1 - 0.45 * np.exp(-np.arange(n) / SR * 9)
    j = min(N, i + n)
    side[i:j] = np.minimum(side[i:j], curve[: j - i])

mix = (
    pads / np.max(np.abs(pads)) * 0.36 * side
    + pluck / max(np.max(np.abs(pluck)), 1e-9) * 0.22
    + bass / max(np.max(np.abs(bass)), 1e-9) * 0.30 * side
    + kick / max(np.max(np.abs(kick)), 1e-9) * 0.42
    + clap / max(np.max(np.abs(clap)), 1e-9) * 0.10
    + hats / max(np.max(np.abs(hats)), 1e-9) * 0.07
)
# gentle fade in at the very top
fade = np.clip(t / 1.5, 0, 1)
mix *= fade
mix = np.tanh(mix * 1.2) / np.tanh(1.2)

stereo = np.stack([mix, mix], axis=1)
# small stereo width on the pluck for air
delay = int(0.012 * SR)
pl = pluck / max(np.max(np.abs(pluck)), 1e-9) * 0.06
stereo[delay:, 1] += pl[:-delay]
stereo = np.clip(stereo, -1, 1)

out_dir = ROOT / "public/audio/music"
out_dir.mkdir(parents=True, exist_ok=True)
raw = out_dir / "bed-raw.wav"
with wave.open(str(raw), "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((stereo * 32767).astype("<i2").tobytes())

# light room reverb + mastered loudness so the -18 dB mix gain behaves like a normal track
subprocess.run(
    [
        "ffmpeg", "-y", "-loglevel", "error", "-i", str(raw),
        "-af", "aecho=0.8:0.6:70|130|210:0.22|0.14|0.08,highpass=f=30,loudnorm=I=-14:TP=-1:LRA=9",
        "-ar", "44100", "-c:a", "libmp3lame", "-b:a", "192k", str(out_dir / "bed.mp3"),
    ],
    check=True,
)
raw.unlink()

src_file = ROOT / "public/audio/sources.json"
sources = json.loads(src_file.read_text()) if src_file.exists() else {}
sources["music"] = {
    "provider": "Original composition, synthesized in code (scripts/compose-music.py)",
    "reason": "ElevenLabs Music API requires a paid plan on this account",
    "bpm": BPM,
    "progression": "Fmaj7 - G6 - Em7 - Am7",
    "groove_downbeat_at_seconds": round(IMPACT, 3),
    "license": "Original work created for this project; no third-party samples",
}
src_file.write_text(json.dumps(sources, indent=2, ensure_ascii=False))
print(f"bed.mp3 written; groove downbeat at {IMPACT:.2f}s, offset {OFFSET:.2f}s", file=sys.stderr)
