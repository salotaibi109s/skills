"""Collect REAL demo outputs into film/engine/data.json for the engine (logs, code, numbers)."""
import json
from pathlib import Path

F = Path(__file__).resolve().parent.parent
D = F / "demos"
tl = json.loads((F / "script/timeline.json").read_text(encoding="utf-8"))
log = D / "03_claude_code_orders/session_log"
fail = (log / "01_failing_tests.txt").read_text(encoding="utf-8").splitlines()
diff = [l for l in (log / "02_change.diff").read_text(encoding="utf-8").splitlines()
        if l.startswith(("+", "-")) and not l.startswith(("+++", "---"))]
ok = (log / "03_all_tests_pass.txt").read_text(encoding="utf-8").splitlines()
code = (D / "03_claude_code_orders/app/store.py").read_text(encoding="utf-8").splitlines()
analysis = json.loads((D / "01_data_analysis/analysis.json").read_text(encoding="utf-8"))
stl = F / "script/short_timeline.json"
bat = F / "script/before_after_timeline.json"
data = {"timeline": tl, "before_after": json.loads(bat.read_text(encoding="utf-8")) if bat.exists() else None, "short": json.loads(stl.read_text(encoding="utf-8")) if stl.exists() else None,
        "logs": {"fail": [l for l in fail if l.strip()][:2] + [l for l in fail if l.startswith(("FAIL", "ERROR", "AssertionError", "Ran", "FAILED"))],
                 "diff": diff[:26], "ok": ok},
        "code": [l for l in code if l.strip()],
        "analysis": analysis,
        "audio": {"mix": "mix.wav"} if (F / "build/audio/mix.wav").exists() else {},
        "audio_short": {"mix": "mix_short.wav"} if (F / "build/audio/mix_short.wav").exists() else {},
        "audio_ba": {"mix": "mix_ba.wav"} if (F / "build/audio/mix_ba.wav").exists() else {}}
(F / "engine/data.json").write_text(json.dumps(data, ensure_ascii=False), encoding="utf-8")
print("fail:", data["logs"]["fail"]); print("diff lines", len(diff)); print("ok tail:", ok[-3:])
