// قوالب الشكل. كل حلقة تختار قالبها بـ "theme" في ملف JSON (الافتراضي dabbirha).
export type ThemeName = 'dabbirha' | 'youtube';

export type Theme = {
  name: ThemeName;
  bg: string;
  bgLight: string;
  ink: string;
  muted: string;
  accent: string;
  accentSoft: string;
  onAccent: string; // لون النص فوق اللون المميّز
  card: string;
  border: string;
  font: string;
  weight: number; // وزن العناوين
  highlight: 'underline' | 'pill'; // شكل الكلمة المميّزة بـ *
  badgeRadius: number; // 999 = دائري
  chapters: boolean; // شريط فصول أعلى الشاشة (يوتيوب) بدل شريط التقدم السفلي
};

export const THEMES: Record<ThemeName, Theme> = {
  // هوية دبّرها: كحلي + ذهبي
  dabbirha: {
    name: 'dabbirha',
    bg: '#0F1B2D',
    bgLight: '#1A2C45',
    ink: '#F5F5F0',
    muted: 'rgba(245, 245, 240, 0.65)',
    accent: '#E8B04B',
    accentSoft: 'rgba(232, 176, 75, 0.32)',
    onAccent: '#0F1B2D',
    card: 'rgba(232, 176, 75, 0.06)',
    border: '#E8B04B',
    font: 'Tajawal',
    weight: 800,
    highlight: 'underline',
    badgeRadius: 999,
    chapters: false,
  },
  // طابع فيديوهات اليوتيوب (من مشروع dabberha-reel): أسود + أحمر، بدون شعارات
  youtube: {
    name: 'youtube',
    bg: '#0F0F0F',
    bgLight: '#1B1B1B',
    ink: '#F1F1F1',
    muted: '#AAAAAA',
    accent: '#FF0033',
    accentSoft: 'rgba(255, 0, 51, 0.16)',
    onAccent: '#FFFFFF',
    card: '#1B1B1B',
    border: '#383838',
    font: 'IBM Plex Sans Arabic',
    weight: 700,
    highlight: 'pill',
    badgeRadius: 30,
    chapters: true,
  },
};

export const THEME_NAMES = Object.keys(THEMES) as ThemeName[];
