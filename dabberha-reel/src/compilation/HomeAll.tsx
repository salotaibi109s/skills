import React from "react";
import { Kid } from "../joanna/chars";
import { Kitten } from "../home/kit";
import { framesOf, SeriesCompilation, type SeriesConfig } from "./Series";

export const HOME_ALL: SeriesConfig = {
  name: "حكايات بيتنا",
  subtitle: "الموسم الأول كامل",
  blurb: "٦ حكايات · قصص عائلية تشد وتعلّم 🏠",
  episodes: [
    { file: "hekayat-beitna-ep01.mp4", frames: 1680, title: "في شي تحت سريري!", emoji: "🐱" },
    { file: "hekayat-beitna-ep02.mp4", frames: 1560, title: "مين أكل كعكة الضيوف؟", emoji: "🍰" },
    { file: "hekayat-beitna-ep03.mp4", frames: 1890, title: "صندوق جدتي المقفول", emoji: "📦" },
    { file: "hekayat-beitna-ep04.mp4", frames: 1720, title: "فيصل ضاع في السوق!", emoji: "🛍️" },
    { file: "hekayat-beitna-ep05.mp4", frames: 1680, title: "الكهرباء طفت!", emoji: "🔦" },
    { file: "hekayat-beitna-ep06.mp4", frames: 1860, title: "طاخ! مين كسرها؟", emoji: "🏺" },
  ],
  bg: "linear-gradient(135deg, #FBE3D3 0%, #F6E6D0 50%, #FFF1DE 100%)",
  icons: ["🏠", "🤍", "⭐", "🐱", "🔑", "🌙"],
  iconOpacity: 0.2,
  titleColor: "#C0574B",
  titleShadow: "0 6px 0 #fff",
  ink: "#3A2414",
  soft: "#6B4523",
  badge: "#2E7D7A",
  badgeText: "#fff",
  sideIcon: "🏠",
  introArt: (f, k) => (
    <g>
      <Kid x={300} y={1040 + (1 - k) * 300} s={0.78} who="joanna" glasses="pink" expr="happy" blink={0} look={[1, -0.2]} armR={{ a: 150, b: 170 }} />
      <Kid x={560} y={1040 + (1 - k) * 300} s={0.6} who="boy" hair="#151010" skinTone="J" expr="laugh" blink={0} look={[-0.6, -0.4]} />
      <Kitten x={560} y={1040 + (1 - k) * 300 - 0.6 * 960} s={0.5} f={f} />
    </g>
  ),
  next: [
    { label: "يوميات جوانا", bg: "#D9508A", color: "#fff" },
    { label: "سرّ الغرفة 404", bg: "#1E2A44", color: "#5CF2FF" },
  ],
  introMusic: "audio/homea/music/theme.mp3",
  outroMusic: "audio/homef/music/theme.mp3",
};
export const HOME_ALL_FRAMES = framesOf(HOME_ALL);
export const HomeAll: React.FC = () => <SeriesCompilation c={HOME_ALL} />;
