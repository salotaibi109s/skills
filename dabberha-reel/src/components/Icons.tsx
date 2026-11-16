import React from "react";

// Generic, original line icons. Deliberately NOT the logos of any government platform.
export type IconName =
  | "id"
  | "briefcase"
  | "shield"
  | "scale"
  | "store"
  | "home"
  | "family"
  | "document"
  | "loan"
  | "contract"
  | "building"
  | "bank"
  | "check"
  | "clock"
  | "bell"
  | "link"
  | "passport"
  | "cap"
  | "home2"
  | "palette"
  | "megaphone"
  | "chart"
  | "camera"
  | "mic"
  | "music"
  | "play"
  | "sparkle"
  | "image"
  | "globe"
  | "code"
  | "cart"
  | "user"
  | "star"
  | "rocket"
  | "bulb"
  | "layers"
  | "cursor"
  | "gear"
  | "box"
  | "heart"
  | "wand"
  | "ruler";

const paths: Record<IconName, React.ReactNode> = {
  id: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <circle cx="9" cy="11" r="2.2" />
      <path d="M5.8 16c.6-1.7 1.8-2.5 3.2-2.5s2.6.8 3.2 2.5M14.5 10h4M14.5 13.5h3" />
    </>
  ),
  briefcase: (
    <>
      <rect x="3" y="7" width="18" height="12" rx="2.5" />
      <path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7M3 12.5h18" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3l7.5 3v5.5c0 4.6-3.2 8.2-7.5 9.5-4.3-1.3-7.5-4.9-7.5-9.5V6L12 3z" />
      <path d="M8.8 12l2.2 2.2 4.4-4.4" />
    </>
  ),
  scale: (
    <>
      <path d="M12 4v16M7 20h10M5 7h14M12 4.5l-.01 0" />
      <path d="M5 7l-2.5 6a2.5 2.5 0 0 0 5 0L5 7zM19 7l-2.5 6a2.5 2.5 0 0 0 5 0L19 7z" />
    </>
  ),
  store: (
    <>
      <path d="M4 9.5L5.5 4h13L20 9.5M4 9.5h16v.5a3 3 0 0 1-5.3 1.9A3 3 0 0 1 12 13a3 3 0 0 1-2.7-1.1A3 3 0 0 1 4 10v-.5z" />
      <path d="M5.5 12.5V20h13v-7.5M10 20v-4h4v4" />
    </>
  ),
  home: (
    <>
      <path d="M3.5 11L12 4l8.5 7M6 9.5V20h12V9.5" />
      <path d="M10 20v-5h4v5" />
    </>
  ),
  family: (
    <>
      <circle cx="8" cy="7.5" r="2.5" />
      <circle cx="16.5" cy="9" r="2" />
      <path d="M3.5 19c0-3 2-5 4.5-5s4.5 2 4.5 5M13 19c0-2.4 1.5-4 3.5-4s3.5 1.6 3.5 4" />
    </>
  ),
  document: (
    <>
      <path d="M7 3h7l5 5v13H7z" />
      <path d="M14 3v5h5M10 12.5h6M10 16h6" />
    </>
  ),
  loan: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M14.8 9.2c-.5-.9-1.6-1.4-2.8-1.4-1.6 0-2.8.8-2.8 2s1.2 1.7 2.8 2 2.8.9 2.8 2.1-1.2 2-2.8 2c-1.3 0-2.4-.5-2.9-1.5M12 6.3v1.5M12 16.7v1.5" />
    </>
  ),
  contract: (
    <>
      <path d="M6 3h9l4 4v8M6 3v18h7" />
      <path d="M9 9h6M9 12.5h4M14 20.5l1.6-1.6 4.2-4.2a1.5 1.5 0 0 1 2.1 2.1l-4.2 4.2-2 .4z" />
    </>
  ),
  building: (
    <>
      <path d="M4 21V5.5L12 3v18M12 8.5l8 2.5v10M2.5 21h19" />
      <path d="M7 8h2M7 11.5h2M7 15h2M15 13.5h2M15 17h2" />
    </>
  ),
  bank: (
    <>
      <path d="M3 9.5L12 4l9 5.5H3zM5 9.5V17M9.5 9.5V17M14.5 9.5V17M19 9.5V17M3 20h18" />
    </>
  ),
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  bell: (
    <>
      <path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 1.5h-15L6 16.5z" />
      <path d="M10 20a2 2 0 0 0 4 0" />
    </>
  ),
  passport: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <circle cx="12" cy="10.5" r="3.2" />
      <path d="M8.8 10.5h6.4M12 7.3c-1 1-1.4 2-1.4 3.2s.4 2.2 1.4 3.2M12 7.3c1 1 1.4 2 1.4 3.2s-.4 2.2-1.4 3.2M9 17h6" />
    </>
  ),
  cap: (
    <>
      <path d="M2.5 9.5L12 5l9.5 4.5L12 14 2.5 9.5z" />
      <path d="M6.5 11.5V16c1.5 1.3 3.4 2 5.5 2s4-.7 5.5-2v-4.5M21.5 9.5V15" />
    </>
  ),
  home2: (
    <>
      <path d="M3.5 11L12 4l8.5 7M6 9.5V20h12V9.5" />
      <path d="M10 20v-5h4v5" />
    </>
  ),
  palette: (
    <>
      <path d="M12 3.5a8.5 8.5 0 1 0 0 17c1.2 0 1.8-.9 1.4-1.9-.5-1.1.3-2.3 1.5-2.3h1.9a3.7 3.7 0 0 0 3.7-3.7C20.5 7.4 16.7 3.5 12 3.5z" />
      <circle cx="7.8" cy="11" r="1.2" />
      <circle cx="10.5" cy="7.4" r="1.2" />
      <circle cx="15" cy="7.6" r="1.2" />
    </>
  ),
  megaphone: (
    <>
      <path d="M4 10v4h3l7 4V6l-7 4H4z" />
      <path d="M17.5 9a4 4 0 0 1 0 6M7 14l1.2 5h2.3L9.6 14" />
    </>
  ),
  chart: (
    <>
      <path d="M4 20V4M4 20h16" />
      <path d="M7 16l4-4 3 3 5-6" />
      <path d="M15.5 9H19v3.5" />
    </>
  ),
  camera: (
    <>
      <path d="M3 8.5A2 2 0 0 1 5 6.5h2.2l1.6-2h6.4l1.6 2H19a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <circle cx="12" cy="13" r="3.6" />
    </>
  ),
  mic: (
    <>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M8.5 21h7" />
    </>
  ),
  music: (
    <>
      <path d="M9 18V5.5l11-2V16" />
      <circle cx="6.5" cy="18" r="2.5" />
      <circle cx="17.5" cy="16" r="2.5" />
    </>
  ),
  play: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M10 8.5l5.5 3.5-5.5 3.5z" />
    </>
  ),
  sparkle: (
    <>
      <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />
      <path d="M18.5 15.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z" />
    </>
  ),
  image: (
    <>
      <rect x="3" y="4.5" width="18" height="15" rx="2.5" />
      <circle cx="9" cy="10" r="1.8" />
      <path d="M21 16l-5-5-8 8.5" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z" />
    </>
  ),
  code: <path d="M8.5 7.5L4 12l4.5 4.5M15.5 7.5L20 12l-4.5 4.5M13.5 5l-3 14" />,
  cart: (
    <>
      <path d="M3 4h2.5l2.2 10.5h10.6L20.5 7H7" />
      <circle cx="9.5" cy="19" r="1.5" />
      <circle cx="17" cy="19" r="1.5" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 20c.8-3.8 3.8-6 7.5-6s6.7 2.2 7.5 6" />
    </>
  ),
  star: <path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8-4.3-4.1 5.9-.8z" />,
  rocket: (
    <>
      <path d="M12 15l-3-3c1.2-4.6 4.4-8 10-8.5-.5 5.6-3.9 8.8-8.5 10z" />
      <path d="M9 12l-3.5.5L4 15l3 .5M12 15l-.5 3.5L9 20l-.5-3M14.5 9.5h.01" />
    </>
  ),
  bulb: (
    <>
      <path d="M9 17h6M10 20.5h4M12 3a6 6 0 0 0-3.5 10.9c.4.3.5.7.5 1.1V17h6v-2c0-.4.2-.8.5-1.1A6 6 0 0 0 12 3z" />
    </>
  ),
  layers: (
    <>
      <path d="M12 3l9 5-9 5-9-5z" />
      <path d="M3 12.5l9 5 9-5M3 17l9 5 9-5" />
    </>
  ),
  cursor: <path d="M5 3.5l13 6.5-5.6 1.6L10 17.5z M12.4 11.6l5 5" />,
  gear: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2.5v3M12 18.5v3M21.5 12h-3M5.5 12h-3M18.7 5.3l-2.1 2.1M7.4 16.6l-2.1 2.1M18.7 18.7l-2.1-2.1M7.4 7.4L5.3 5.3" />
    </>
  ),
  box: (
    <>
      <path d="M3.5 7.5L12 3l8.5 4.5v9L12 21l-8.5-4.5z" />
      <path d="M3.5 7.5L12 12l8.5-4.5M12 12v9" />
    </>
  ),
  heart: <path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z" />,
  wand: (
    <>
      <path d="M4 20L15 9M13 7l4 4" />
      <path d="M17 3v3M15.5 4.5h3M20 8v2M19 9h2" />
    </>
  ),
  ruler: (
    <>
      <rect x="2.5" y="8" width="19" height="8" rx="1.5" />
      <path d="M6 8v3M9.5 8v4M13 8v3M16.5 8v4" />
    </>
  ),
  link: (
    <>
      <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" />
      <path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />
    </>
  ),
};

export const Icon: React.FC<{ name: IconName; size?: number; color?: string; stroke?: number }> = ({
  name,
  size = 40,
  color = "currentColor",
  stroke = 1.7,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={stroke}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {paths[name]}
  </svg>
);
