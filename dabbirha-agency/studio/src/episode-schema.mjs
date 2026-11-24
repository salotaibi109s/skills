// مخطط ملف الحلقة — يستخدمه الاستوديو وسكربتات الفحص والرندر.
// لا تعتمد على أي مكتبة عشان يشتغل في المتصفح وفي Node.

export const FPS = 30;

export const SCENE_TYPES = ['hook', 'step', 'tip', 'result', 'outro'];

export const ICONS = [
  'oven', 'lemon', 'drop', 'spray', 'sparkle', 'clock', 'check', 'bulb',
  'alert', 'bookmark', 'shirt', 'brush', 'fridge', 'coin', 'sponge', 'home',
  'box', 'washer', 'trash', 'heart', 'shoe', 'paper', 'wrench', 'bag', 'packet',
];

export const LIMITS = {
  minTotalSec: 15,
  maxTotalSec: 60,
  minSceneSec: 2,
  maxSceneSec: 8,
  maxLines: 2,
  maxWordsPerLine: 6,
  maxCharsPerLine: 28,
};

// معرّف الحلقة = اسم مجلدها: YYYY-MM-DD-slug أو demo-slug
export const ID_PATTERN = /^(\d{4}-\d{2}-\d{2}|demo)-[a-z0-9]+(-[a-z0-9]+)*$/;

const stripMarks = (line) => line.replace(/\*/g, '');

/**
 * يرجّع قائمة أخطاء بالعربي. قائمة فاضية = الحلقة سليمة.
 * @param {any} ep
 * @param {string} [fileId] اسم الملف بدون .json — لازم يطابق ep.id
 */
export function validateEpisode(ep, fileId) {
  const errors = [];
  if (!ep || typeof ep !== 'object') return ['الملف ليس كائن JSON'];

  if (typeof ep.id !== 'string' || !ID_PATTERN.test(ep.id)) {
    errors.push(`id غير صالح: "${ep.id}" — الشكل المطلوب YYYY-MM-DD-slug بحروف إنجليزية صغيرة وشرطات`);
  }
  if (fileId && ep.id !== fileId) {
    errors.push(`id ("${ep.id}") لا يطابق اسم الملف ("${fileId}.json")`);
  }
  if (typeof ep.title !== 'string' || !ep.title.trim()) {
    errors.push('title مطلوب (عنوان داخلي بالعربي)');
  }
  if (!Array.isArray(ep.scenes) || ep.scenes.length < 3) {
    errors.push('scenes لازم تكون قائمة فيها 3 مشاهد على الأقل');
    return errors;
  }

  ep.scenes.forEach((s, i) => {
    const at = `المشهد ${i + 1}`;
    if (!SCENE_TYPES.includes(s.type)) {
      errors.push(`${at}: type "${s.type}" غير معروف — المسموح: ${SCENE_TYPES.join(', ')}`);
    }
    if (typeof s.durationSec !== 'number' || s.durationSec < LIMITS.minSceneSec || s.durationSec > LIMITS.maxSceneSec) {
      errors.push(`${at}: durationSec لازم رقم بين ${LIMITS.minSceneSec} و ${LIMITS.maxSceneSec}`);
    }
    if (!Array.isArray(s.lines) || s.lines.length < 1 || s.lines.length > LIMITS.maxLines) {
      errors.push(`${at}: lines لازم فيها سطر أو سطرين`);
    } else {
      s.lines.forEach((line, j) => {
        if (typeof line !== 'string' || !line.trim()) {
          errors.push(`${at} السطر ${j + 1}: فاضي`);
          return;
        }
        const plain = stripMarks(line).trim();
        const words = plain.split(/\s+/).length;
        if (words > LIMITS.maxWordsPerLine) {
          errors.push(`${at} السطر ${j + 1}: ${words} كلمات (الحد ${LIMITS.maxWordsPerLine})`);
        }
        if (plain.length > LIMITS.maxCharsPerLine) {
          errors.push(`${at} السطر ${j + 1}: ${plain.length} حرف (الحد ${LIMITS.maxCharsPerLine})`);
        }
        if ((line.match(/\*/g) || []).length % 2 !== 0) {
          errors.push(`${at} السطر ${j + 1}: علامات * غير مقفلة (التمييز يكون *هكذا*)`);
        }
      });
    }
    if (s.audio !== undefined && (typeof s.audio !== 'string' || !/^voiceovers\/[a-z0-9-]+\/[\w-]+\.mp3$/.test(s.audio))) {
      errors.push(`${at}: audio لازم مسار مثل voiceovers/<id>/01.mp3 داخل public/`);
    }
    if (s.icon !== undefined && !ICONS.includes(s.icon)) {
      errors.push(`${at}: icon "${s.icon}" غير موجود — المتاح: ${ICONS.join(', ')}`);
    }
  });

  const first = ep.scenes[0];
  const last = ep.scenes[ep.scenes.length - 1];
  if (first && first.type !== 'hook') errors.push('أول مشهد لازم يكون type: "hook"');
  if (last && last.type !== 'outro') errors.push('آخر مشهد لازم يكون type: "outro"');
  if (ep.scenes.filter((s) => s.type === 'hook').length > 1) errors.push('مسموح hook واحد فقط');
  if (ep.scenes.filter((s) => s.type === 'outro').length > 1) errors.push('مسموح outro واحد فقط');

  const total = totalSeconds(ep);
  if (total < LIMITS.minTotalSec || total > LIMITS.maxTotalSec) {
    errors.push(`المدة الكلية ${total} ثانية — لازم بين ${LIMITS.minTotalSec} و ${LIMITS.maxTotalSec}`);
  }
  return errors;
}

export function totalSeconds(ep) {
  return ep.scenes.reduce((sum, s) => sum + (Number(s.durationSec) || 0), 0);
}

export function sceneFrames(scene) {
  return Math.round(scene.durationSec * FPS);
}

export function totalFrames(ep) {
  return ep.scenes.reduce((sum, s) => sum + sceneFrames(s), 0);
}

/** بداية كل مشهد بالإطارات */
export function sceneStarts(ep) {
  const starts = [];
  let t = 0;
  for (const s of ep.scenes) {
    starts.push(t);
    t += sceneFrames(s);
  }
  return starts;
}
