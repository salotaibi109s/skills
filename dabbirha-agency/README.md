# دبّرها — فريق المحتوى في Claude Code

## التشغيل لأول مرة

1. **ثبّت المتطلبات** على جهازك:
   - Node.js 20 أو أحدث، و Claude Code (`npm i -g @anthropic-ai/claude-code`)
   - ffmpeg (لـ Remotion): `brew install ffmpeg` على الماك
   - rclone: `brew install rclone`

2. **اربط Google Drive بـ rclone** (عشان الفيديو يصير له رابط يقبله Metricool):
   ```bash
   rclone config        # اسم الريموت: gdrive ، النوع: drive
   rclone mkdir gdrive:dabbirha/renders
   ```

3. **افتح المشروع**:
   ```bash
   cd dabbirha-agency
   claude
   ```
   سجّل دخول بنفس حساب claude.ai. الموصلات المربوطة عندك (Metricool و vidIQ) تظهر تلقائياً في Claude Code. تأكد بالأمر `/mcp`.

4. ✅ **تيك توك (@dabbirha2) ويوتيوب مربوطين في Metricool** — لإدارة الربط: https://app.metricool.com/brands/connections?blogId=8268890

## الاستخدام

| الأمر | وش يسوي |
|---|---|
| `/produce` | فيديو واحد من أقوى فكرة في القائمة → جدولة |
| `/produce حيلة تنظيف الفرن بالبخار` | فيديو واحد من فكرتك |
| `/week` | دفعة الأسبوع كاملة |
| `/report` | تقرير الأداء الأسبوعي |

تقدر تكلم أي موظف مباشرة بعد، مثلاً: «خل المصمم يعيد فيديو episodes/… بخط أكبر».

## تغيير الإعدادات
كل شي (اللهجة، الجمهور، وضع النشر، العدد الأسبوعي) في جدول الإعدادات أعلى `CLAUDE.md`.

## هيكل المجلدات
```
.claude/agents/     الموظفين الأربعة
.claude/commands/   الأوامر /produce /week /report
ideas/backlog.md    قائمة الأفكار
episodes/<slug>/    كل فيديو: brief.md, video-vertical.mp4, cover.jpg, design.md, publish.json
reports/            التقارير الأسبوعية
studio/             مشروع Remotion (ينشئه المصمم أول مرة)
```
