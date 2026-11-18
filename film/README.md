# CLAUDE — BEYOND THE CHAT · فيلم تعليمي سينمائي

فيلم Motion Graphics تعليمي عن قدرات Claude باللهجة السعودية: **6:39 دقيقة، 16:9، 4K (3840×2160)، 30 إطاراً/ثانية**، مبني بـ **Remotion**. فيه شخصيتان ثابتتان (راشد وكلود)، وثمانية مشاهد، وترجمة عربية متزامنة، وموسيقى ومؤثرات أصلية، وتعليق صوتي بصوت **ناصر الجبيلي (ElevenLabs)**.

## ما الحقيقي وما التوضيحي؟
كل «عرض عملي» في الفيلم مأخوذ من مخرجات حقيقية نُفذت في هذه الجلسة، وعليه شارة **LIVE CAPTURE · لقطة حقيقية**:

| المشهد | العرض العملي | المصدر الحقيقي |
|---|---|---|
| 02 تحليل البيانات | ملف Excel فيه 5,000 عملية (بيانات **مصطنعة** غير سرية)، وتحليل فعلي، ورسوم بيانية، واتجاهات شاذة، وتوصيات، وافتراضات | `demos/01_data_analysis/` (`generate_data.py`، `analyze.py`، `report.html`) |
| 03 Artifacts | تطبيق مهام عربي تفاعلي، والتفاعل معه (إضافة وإنجاز وتصفية ووضع ليلي وجوال) | `demos/02_artifact_task_app/task-app.html`، **منشور كـ Artifact:** https://claude.ai/artifact/PFfY9bCJHpBbzFPw98Ks52 |
| 04 Claude Code | نظام إدارة طلبات (تسجيل دخول، لوحة تحكم، حالات، عملاء). تعديل على مشروع قائم: اختبار يفشل، ثم diff، ثم 13/13 ناجحة | `demos/03_claude_code_orders/` + `session_log/` |
| 05 Projects & Skills | Skill لمراجعة سياسات المستشفى، استُخدمت على مهمتين مختلفتين، + تعليمات Project تسويقي | `demos/04_projects_and_skills/` |
| 06 التفويض | مهمة مفوّضة بقراءة فقط: مراجعة مجلد المشروع وتقرير ومهام مقترحة دون أي تعديل | `demos/05_delegation_folder_review/` |
| 07 البحث والربط | بحث ويب حقيقي (18 نوفمبر 2026) مع فصل **المعلومات ذات المصدر** عن **التحليل المولَّد** | `demos/06_web_research/` |

**توضيحي (عليه وسم ILLUSTRATION):** واجهة سطح المكتب والنوافذ وبطاقة طلب الصلاحية في المشهد 06، ولوحة التحكم التي يرسمها راشد في الهواء في المشهد 03. هي رسوم حركية عامة وليست لقطات منتج.

**صراحة:** لم يُسجَّل في الفيلم Claude Cowork أو Computer Use على سطح مكتب حقيقي، لأن هذه الجلسة سحابية بلا سطح مكتب. المشهد 06 يعرض مهمة مفوّضة حقيقية نُفذت عبر Claude Code. لعرض Cowork نفسه، سجّل الشاشة من بيئة مدعومة واستبدل اللقطة `review_md`. لم تُستخدم صور المراجع الخارجية الثمانية في الطلب، لأن ترخيصها غير مؤكد، واستُبدلت بمشاهد أصلية مرسومة بالكود.

## الهيكل
```
film/
  script/      timeline.json (مصدر التوقيت الوحيد) · voiceover_script_ar.md · vo_request.json
  subtitles/   claude_beyond_the_chat.ar.srt / .vtt
  engine/      core.js · characters.js (راشد وكلود) · scenes.js (8 مشاهد + انتقالات + ترجمة) · preview.html
  remotion/    مشروع Remotion (Composition: ClaudeBeyondTheChat و ClaudeBeyondTheChatClean بلا ترجمة)
  demos/       العروض العملية الحقيقية
  production/  character_bible.md · shot_list.md
  tools/       capture_demos.mjs · build_timeline.py · build_data.py · audio.py · elevenlabs_vo.py · make_all.sh
  output/      (غير مرفوع إلى git) الماستر 4K + نسخة 1080p + مقاطع المشاهد
```

## التشغيل
```bash
# المعاينة والتعديل في Remotion Studio
cd film/remotion && npm install && npm run studio

# بناء كل شيء من الصفر: لقطات ← توقيت ← صوت ← ماستر 4K ← 1080p ← مقاطع المشاهد
bash film/tools/make_all.sh

# مع توليد صوت ناصر من ElevenLabs أولاً (يحتاج المفتاح)
ELEVENLABS_API_KEY=... WITH_VO=1 bash film/tools/make_all.sh
```
عند وجود ملفات المحاذاة `build/audio/vo/*.alignment.json` يعيد `build_timeline.py` ضبط توقيت كل سطر وكل حركة بصرية وكل ترجمة **على صوت ناصر الفعلي**، وتنخفض الموسيقى تلقائياً تحت التعليق.

## الترخيص والأصول
- الخطوط: Tajawal وSpace Grotesk وJetBrains Mono (SIL OFL)، مضمّنة في `engine/fonts`.
- الموسيقى والمؤثرات: مولّدة بالكامل في `tools/audio.py`، بلا عينات خارجية.
- Remotion: مجاني للأفراد والشركات حتى 3 موظفين، وما فوق ذلك يحتاج ترخيص شركة من remotion.dev.
- كل الأرقام في المشهد 02 مصدرها ملف تجريبي مصطنع. لا بيانات حقيقية لأي جهة.
