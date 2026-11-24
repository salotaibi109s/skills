// الهوية البصرية لدبّرها — أي تعديل على الألوان أو الهوامش يكون هنا فقط.
export const COLORS = {
  navy: '#0F1B2D',
  navyLight: '#1A2C45',
  white: '#F5F5F0',
  gold: '#E8B04B',
  goldSoft: 'rgba(232, 176, 75, 0.32)',
  muted: 'rgba(245, 245, 240, 0.65)',
} as const;

export const FONT_FAMILY = 'Tajawal';

export const VIDEO = {
  width: 1080,
  height: 1920,
  fps: 30,
} as const;

// هامش أمان واجهة تيك توك/الشورتس: لا نص في هذه المناطق.
export const SAFE = {
  top: 250,
  bottom: 400,
  right: 120,
  left: 60,
} as const;

// منطقة المحتوى داخل الهامش
export const CONTENT = {
  top: SAFE.top,
  left: SAFE.left,
  width: VIDEO.width - SAFE.left - SAFE.right,
  height: VIDEO.height - SAFE.top - SAFE.bottom,
} as const;

// مدة دخول/خروج كل مشهد بالإطارات
export const ENTER_FRAMES = 12;
export const EXIT_FRAMES = 8;

export const BRAND = {
  name: 'دبّرها',
  handle: '@dabbirha2',
} as const;
