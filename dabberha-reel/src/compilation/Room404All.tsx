import React from "react";
import { Kid } from "../joanna/chars";
import { Zero } from "../room404/kit";
import { framesOf, SeriesCompilation, type SeriesConfig } from "./Series";

export const ROOM404_ALL: SeriesConfig = {
  name: "سرّ الغرفة 404",
  subtitle: "الجزء الأول كامل",
  blurb: "٦ حلقات · ألغاز وتشويق مع جوانا وفيصل وزيرو 🤖",
  episodes: [
    { file: "room404-ep1.mp4", frames: 1800, title: "باب ما كان موجود أمس!", emoji: "🚪" },
    { file: "room404-ep2.mp4", frames: 1800, title: "رسالة من سنة ٢٠٦٠!", emoji: "⚡" },
    { file: "room404-ep3.mp4", frames: 1800, title: "هل زيرو صديق أم عدو؟", emoji: "🤖" },
    { file: "room404-ep4.mp4", frames: 2100, title: "زيرو طفى… ورسالة «أنا تأخرت»", emoji: "😨" },
    { file: "room404-ep5.mp4", frames: 2100, title: "زيرو نسي جوانا وفيصل", emoji: "💔" },
    { file: "room404-ep6.mp4", frames: 2250, title: "كل الشاشات تطالعهم!", emoji: "👁️" },
  ],
  bg: "radial-gradient(90% 80% at 50% 40%, #1E2A55 0%, #0B1024 100%)",
  icons: ["🔍", "💡", "⚡", "🔢", "🗝️", "✨"],
  iconOpacity: 0.16,
  titleColor: "#5CF2FF",
  titleShadow: "0 0 24px rgba(92,242,255,0.6)",
  ink: "#FFFFFF",
  soft: "#B9C7FF",
  badge: "#FFD23F",
  badgeText: "#1E2A44",
  sideIcon: "🚪",
  introArt: (f, k) => (
    <g>
      <Kid x={300} y={1040 + (1 - k) * 300} s={0.78} who="joanna" glasses="pink" expr="shock" blink={0} look={[1, -0.2]} />
      <Kid x={560} y={1040 + (1 - k) * 300} s={0.6} who="boy" hair="#151010" skinTone="J" expr="happy" blink={0} look={[-0.6, -0.4]} armR={{ a: 150, b: 170 }} />
      <Zero x={640} y={330} s={0.7} f={f} mood="happy" />
    </g>
  ),
  next: [
    { label: "يوميات جوانا", bg: "#D9508A", color: "#fff" },
    { label: "حكايات بيتنا", bg: "#C0574B", color: "#fff" },
  ],
  introMusic: "audio/r404a/music/theme.mp3",
  outroMusic: "audio/r404f/music/theme.mp3",
};
export const ROOM404_ALL_FRAMES = framesOf(ROOM404_ALL);
export const Room404All: React.FC = () => <SeriesCompilation c={ROOM404_ALL} />;
