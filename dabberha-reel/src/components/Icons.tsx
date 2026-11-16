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
  | "home2";

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
