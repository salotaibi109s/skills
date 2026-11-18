#!/usr/bin/env python3
"""Build index.html (installable web app) from oud.html (the page source).

oud.html is a page fragment: its <title>/<meta>/<link>/<style> come first, then the
app markup and script. This wraps it in a full document with the iPhone home-screen
tags, the web-app manifest and the offline service worker.

Usage: python3 build.py
"""
from pathlib import Path

HERE = Path(__file__).parent
src = (HERE / "oud.html").read_text(encoding="utf-8")
cut = src.index('<div class="app"')
head, body = src[:cut].strip(), src[cut:].strip()

doc = f"""<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="عود المقامات">
<meta name="theme-color" content="#1E1915">
<meta name="description" content="عود تفاعلي لتعلّم المقامات العربية: أصوات مُحاكاة فيزيائياً، أسماء النغمات، خانة لكتابة النوتة، ومكتبة تمارين.">
<link rel="apple-touch-icon" href="icon-180.png">
<link rel="icon" type="image/png" sizes="192x192" href="icon-192.png">
<link rel="manifest" href="manifest.webmanifest">
<style>
:root{{color-scheme:light;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}}
body{{margin:0;font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}}
img{{max-width:100%}}
[hidden]{{display:none!important}}
</style>
{head}
</head>
<body>
{body}
<script>
if ("serviceWorker" in navigator && location.protocol === "https:") {{
  window.addEventListener("load", function () {{ navigator.serviceWorker.register("sw.js").catch(function () {{}}); }});
}}
</script>
</body>
</html>
"""
(HERE / "index.html").write_text(doc, encoding="utf-8")
print("wrote index.html")
