"""Cut the 4K master into one clip per scene (separate scene assets) + export scene key frames."""
import json
import subprocess
from pathlib import Path

F = Path(__file__).resolve().parent.parent
master = F / "output/claude_beyond_the_chat_4k.mp4"
tl = json.loads((F / "script/timeline.json").read_text(encoding="utf-8"))
out = F / "output/scenes"
out.mkdir(parents=True, exist_ok=True)
for k, s in enumerate(tl["scenes"], 1):
    name = f"{k:02d}_{s['id']}"
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-ss", str(s["start"]), "-to", str(s["end"]), "-i", str(master),
                    "-vf", "scale=1920:1080:flags=lanczos", "-c:v", "libx264", "-crf", "22", "-preset", "fast",
                    "-c:a", "aac", "-b:a", "192k", str(out / f"{name}.mp4")], check=True)
    mid = (s["start"] + s["end"]) / 2
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-ss", str(mid), "-i", str(master), "-frames:v", "1",
                    str(out / f"{name}_keyframe.jpg")], check=True)
    print("scene", name)
