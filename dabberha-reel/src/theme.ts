import { loadFont as loadChanga } from "@remotion/google-fonts/Changa";
import { loadFont as loadPlex } from "@remotion/google-fonts/IBMPlexSansArabic";

// Display face: Changa — the typeface the store itself uses (haxztd.zid.store).
const changa = loadChanga("normal", {
  weights: ["500", "700", "800"],
  subsets: ["arabic", "latin"],
});

// Text face: IBM Plex Sans Arabic — clean, highly legible on phones.
const plex = loadPlex("normal", {
  weights: ["400", "500", "600", "700"],
  subsets: ["arabic", "latin"],
});

export const fonts = {
  display: changa.fontFamily,
  text: plex.fontFamily,
} as const;

// Colors sampled from the store logo and the store theme CSS variables
// (--primary-color #21649b, --header-text-color #161070, --footer-text #16376a).
export const colors = {
  ink: "#060d1d", // deepest background
  night: "#0a1a38", // dark navy background
  navy: "#183a67", // logo wordmark navy
  royal: "#16376a", // store footer navy
  primary: "#21649b", // store primary
  teal: "#0e939a", // logo gradient end
  tealBright: "#2bc4c4", // highlight on dark
  gold: "#e3a63a", // logo accent (spark + arrow)
  ice: "#eef5f9", // light background
  mist: "#d7e1ee", // store light tint
  white: "#ffffff",
  textOnLight: "#0d2447",
  muted: "rgba(255,255,255,0.62)",
} as const;

export const gradients = {
  brand: `linear-gradient(135deg, ${colors.navy} 0%, ${colors.primary} 55%, ${colors.teal} 100%)`,
  brandText: `linear-gradient(90deg, ${colors.teal} 0%, ${colors.primary} 60%, ${colors.navy} 100%)`,
} as const;

export const video = {
  width: 1080,
  height: 1920,
  fps: 30,
  durationInFrames: 1800,
} as const;

// Reels safe zones: no important text in the top 250px or bottom 400px.
export const safe = {
  top: 250,
  bottom: 400,
  side: 80,
  // Usable band for key content
  get contentTop() {
    return this.top + 30;
  },
  get contentBottom() {
    return video.height - this.bottom - 30;
  },
} as const;

export const springs = {
  soft: { damping: 200 },
  snappy: { damping: 18, stiffness: 180, mass: 0.6 },
  bouncy: { damping: 11, stiffness: 160, mass: 0.7 },
} as const;

// Audio mix levels (linear gain)
export const db = (v: number) => Math.pow(10, v / 20);
export const mix = {
  voice: 1,
  musicBed: db(-18),
  musicDucked: db(-27),
  whoosh: db(-9),
  tick: db(-20),
  pop: db(-12),
  riser: db(-8),
  impact: db(-5),
  glitch: db(-14),
} as const;
