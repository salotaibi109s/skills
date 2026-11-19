"""Timeline for the vertical TikTok cut (script/short_script.json → script/short_timeline.json + subtitles).
Uses Nasser's real timings from build/audio/vo/s_*.alignment.json when present, otherwise an estimate."""
import json
import sys
from pathlib import Path

F = Path(__file__).resolve().parent.parent
WPS, GAP = 2.85, 0.2
SRC, OUT, SRT = (sys.argv[1:4] if len(sys.argv) > 3 else ("short_script.json", "short_timeline.json", "claude_tiktok.ar.srt"))
src = json.loads((F / "script" / SRC).read_text(encoding="utf-8"))
PROMPTS = {("s_analyze", 1)}  # cues shown as a typed prompt


def aligned(sid, lines):
    f = F / "build/audio/vo" / f"{sid}.alignment.json"
    if not f.exists():
        return None
    al = json.loads(f.read_text(encoding="utf-8")); al = al.get("alignment", al)
    chars, st, en = al["characters"], al["character_start_times_seconds"], al["character_end_times_seconds"]
    full, out, pos = "".join(chars), [], 0
    for text in lines:
        k = full.find(text[:12], pos)
        if k < 0:
            return None
        e = min(k + len(text) - 1, len(en) - 1); out.append((st[k], en[e])); pos = e + 1
    return out, en[-1]


def ts(t, sep=","):
    h, r = divmod(t, 3600); m, s = divmod(r, 60)
    return f"{int(h):02d}:{int(m):02d}:{int(s):02d}{sep}{int(round((s % 1) * 1000)):03d}"


t, scenes, cues = 0.0, [], []
for s in src["scenes"]:
    start = t; t += s["lead"]; sc = []; al = aligned(s["id"], s["cues"])
    for j, text in enumerate(s["cues"]):
        if al:
            a, b = al[0][j]; c0, c1 = start + s["lead"] + a, start + s["lead"] + b
        else:
            words = len(text.replace("…", " ").split()); d = words / WPS + .25 + (.3 if text.endswith(("…", "؟", "!", ":")) else 0)
            c0, c1 = t, t + d; t += d + GAP
        c = {"scene": s["id"], "i": j, "start": round(c0, 2), "end": round(c1, 2), "text": text, "prompt": (s["id"], j) in PROMPTS}
        sc.append(c); cues.append(c)
    if al:
        t = start + s["lead"] + al[1] + .15
    t += s["tail"]
    scenes.append({"id": s["id"], "start": round(start, 2), "end": round(t, 2), "cues": sc, "vo_offset": s["lead"] if al else None})
out = {"fps": 30, "duration": round(t, 2), "scenes": scenes}
(F / "script" / OUT).write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
(F / "subtitles" / SRT).write_text("".join(f"{k+1}\n{ts(c['start'])} --> {ts(c['end'])}\n{c['text']}\n\n" for k, c in enumerate(cues)), encoding="utf-8")
print(f"short total {t:.1f}s")
for s in scenes:
    print(f"  {s['id']:<12} {s['start']:6.1f} → {s['end']:6.1f}")
