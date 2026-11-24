# دبّرها — فريق المحتوى في Claude Code

## التشغيل لأول مرة

1. **ثبّت المتطلبات** على جهازك:
   - Node.js 20 أو أحدث، و Claude Code (`npm i -g @anthropic-ai/claude-code`)
   - rclone: `brew install rclone`

2. **اربط Google Drive بـ rclone** (عشان الفيديو يصير له رابط يقبله Metricool):
   ```bash
   rclone config        # اسم الريموت: gdrive ، النوع: drive
   rclone mkdir gdrive:dabbirha/renders
   ```

3. **ثبّت الاستوديو** (مرة وحدة): `cd studio && npm install && cd ..`
   جرّبه: `cd studio && npm run render -- demo-oven-steam` → يطلع فيديو في `episodes/demo-oven-steam/`.
   معاينة حيّة وتعديل: `cd studio && npm run studio`

4. **افتح المشروع**:
   ```bash
   cd dabbirha-agency
   claude
   ```
   سجّل دخول بنفس حساب claude.ai. الموصلات المربوطة عندك (Metricool و vidIQ) تظهر تلقائياً في Claude Code. تأكد بالأمر `/mcp`.

5. ✅ **تيك توك (@dabbirha2) ويوتيوب مربوطين في Metricool** — لإدارة الربط: https://app.metricool.com/brands/connections?blogId=8268890

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
episodes/<id>/      كل فيديو: brief.md, video-vertical.mp4, cover.jpg, design.md, publish.json, checks/
studio/             استوديو Remotion — كل حلقة ملف JSON في studio/src/episodes/
reports/            التقارير الأسبوعية
```
