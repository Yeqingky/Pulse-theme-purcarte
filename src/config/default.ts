export type ColorType =
  | "ruby"
  | "gray"
  | "gold"
  | "bronze"
  | "brown"
  | "yellow"
  | "amber"
  | "orange"
  | "tomato"
  | "red"
  | "crimson"
  | "pink"
  | "plum"
  | "purple"
  | "violet"
  | "iris"
  | "indigo"
  | "blue"
  | "cyan"
  | "teal"
  | "jade"
  | "green"
  | "grass"
  | "lime"
  | "mint"
  | "sky";

export const allColors: ColorType[] = [
  "ruby",
  "gray",
  "gold",
  "bronze",
  "brown",
  "yellow",
  "amber",
  "orange",
  "tomato",
  "red",
  "crimson",
  "pink",
  "plum",
  "purple",
  "violet",
  "iris",
  "indigo",
  "blue",
  "cyan",
  "teal",
  "jade",
  "green",
  "grass",
  "lime",
  "mint",
  "sky",
];

export type AppearanceType = "light" | "dark" | "system";
export const allAppearance: AppearanceType[] = ["light", "dark", "system"];

export type ViewModeType = "grid" | "table" | "compact";
const allViews: ViewModeType[] = ["grid", "table", "compact"];

export type HeaderStyle = "fixed" | "levitation";
export type FooterStyle = "fixed" | "levitation" | "followContent" | "hidden";
const allHeaderStyles: HeaderStyle[] = ["fixed", "levitation"];
const allFooterStyles: FooterStyle[] = [
  "fixed",
  "levitation",
  "followContent",
  "hidden",
];

export interface ConfigOptions {
  mainWidth: number;
  backgroundImage: string;
  backgroundImageMobile: string;
  enableVideoBackground: boolean;
  videoBackgroundUrl: string;
  videoBackgroundUrlMobile: string;
  backgroundAlignment: string;
  blurValue: number;
  blurBackgroundColor: string;
  enableTransparentTags: boolean;
  tagDefaultColorList: string;
  selectThemeColor: ColorType;
  enableLocalStorage: boolean;
  selectedDefaultView: ViewModeType;
  selectedDefaultAppearance: AppearanceType;
  statusCardsVisibility: string;
  selectedHeaderStyle: HeaderStyle;
  enableLogo: boolean;
  logoUrl: string;
  enableTitle: boolean;
  titleText: string;
  enableSearchButton: boolean;
  selectedFooterStyle: FooterStyle;
  isShowStatsInHeader: boolean;
  mergeTagsWithStats: boolean;
  enableStatsBar: boolean;
  enableSortControl: boolean;
  isOfflineNodesBehind: boolean;
  enableTagsBar: boolean;
  defaultSelectedTag: string;
  selectMobileDefaultView: ViewModeType;
  enableSwap: boolean;
  isShowHWBarInCard: boolean;
  isShowValueUnderProgressBar: boolean;
  enableListItemProgressBar: boolean;
  customTexts: string;
}

const readEnv = (key: string): string | undefined => {
  const value = import.meta.env[key];
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
};

const readBoolean = (key: string, fallback: boolean): boolean => {
  const value = readEnv(key)?.toLowerCase();
  if (value === "true" || value === "1" || value === "yes") return true;
  if (value === "false" || value === "0" || value === "no") return false;
  return fallback;
};

const readNumber = (
  key: string,
  fallback: number,
  minimum?: number,
  maximum?: number
): number => {
  const parsed = Number(readEnv(key));
  if (!Number.isFinite(parsed)) return fallback;
  if (minimum !== undefined && parsed < minimum) return fallback;
  if (maximum !== undefined && parsed > maximum) return fallback;
  return parsed;
};

const readEnum = <T extends string>(
  key: string,
  fallback: T,
  values: readonly T[]
): T => {
  const value = readEnv(key) as T | undefined;
  return value && values.includes(value) ? value : fallback;
};

const defaultStatusCards =
  "currentTime:true,currentOnline:true,regionOverview:true,trafficOverview:true,networkSpeed:true";

export const PULSE_EVENTS_URL =
  readEnv("VITE_PULSE_EVENTS_URL") ||
  "https://example.com/api/events";
export const PULSE_SHARE_TOKEN = readEnv("VITE_PULSE_SHARE_TOKEN") || "";
export const PULSE_WITH_CREDENTIALS = readBoolean(
  "VITE_PULSE_WITH_CREDENTIALS",
  false
);
export const PULSE_RECONNECT_DELAY = readNumber(
  "VITE_PULSE_RECONNECT_DELAY",
  3000,
  1000,
  60000
);
export const SITE_DESCRIPTION =
  readEnv("VITE_SITE_DESCRIPTION") || "Pulse server monitoring dashboard.";

export const DEFAULT_CONFIG: ConfigOptions = {
  mainWidth: readNumber("VITE_MAIN_WIDTH", 85, 40, 100),
  backgroundImage:
    readEnv("VITE_BACKGROUND_IMAGE") || "/assets/Moonlit-Scenery.webp",
  backgroundImageMobile: readEnv("VITE_BACKGROUND_IMAGE_MOBILE") || "",
  enableVideoBackground: readBoolean("VITE_ENABLE_VIDEO_BACKGROUND", false),
  videoBackgroundUrl:
    readEnv("VITE_VIDEO_BACKGROUND_URL") ||
    "/assets/LanternRivers_1080p15fps2Mbps3s.mp4",
  videoBackgroundUrlMobile:
    readEnv("VITE_VIDEO_BACKGROUND_URL_MOBILE") || "",
  backgroundAlignment:
    readEnv("VITE_BACKGROUND_ALIGNMENT") || "cover,top",
  blurValue: readNumber("VITE_BLUR_VALUE", 10, 0, 100),
  blurBackgroundColor:
    readEnv("VITE_BLUR_BACKGROUND_COLOR") ||
    "rgba(255, 255, 255, 0.5)|rgba(0, 0, 0, 0.5)",
  enableTransparentTags: readBoolean("VITE_ENABLE_TRANSPARENT_TAGS", true),
  tagDefaultColorList:
    readEnv("VITE_TAG_DEFAULT_COLOR_LIST") ||
    "ruby,gray,gold,bronze,brown,yellow,amber,orange,tomato,red",
  selectThemeColor: readEnum("VITE_THEME_COLOR", "violet", allColors),
  enableLocalStorage: readBoolean("VITE_ENABLE_LOCAL_STORAGE", true),
  selectedDefaultView: readEnum("VITE_DEFAULT_VIEW", "grid", allViews),
  selectedDefaultAppearance: readEnum(
    "VITE_DEFAULT_APPEARANCE",
    "system",
    allAppearance
  ),
  statusCardsVisibility:
    readEnv("VITE_STATUS_CARDS_VISIBILITY") || defaultStatusCards,
  selectedHeaderStyle: readEnum(
    "VITE_HEADER_STYLE",
    "fixed",
    allHeaderStyles
  ),
  enableLogo: readBoolean("VITE_ENABLE_LOGO", false),
  logoUrl: readEnv("VITE_LOGO_URL") || "/assets/logo.png",
  enableTitle: readBoolean("VITE_ENABLE_TITLE", true),
  titleText: readEnv("VITE_SITE_TITLE") || "Pulse-theme-purcarte",
  enableSearchButton: readBoolean("VITE_ENABLE_SEARCH", true),
  selectedFooterStyle: readEnum("VITE_FOOTER_STYLE", "fixed", allFooterStyles),
  isShowStatsInHeader: readBoolean("VITE_SHOW_STATS_IN_HEADER", false),
  mergeTagsWithStats: readBoolean("VITE_MERGE_TAGS_WITH_STATS", false),
  enableStatsBar: readBoolean("VITE_ENABLE_STATS_BAR", true),
  enableSortControl: readBoolean("VITE_ENABLE_SORT_CONTROL", true),
  isOfflineNodesBehind: readBoolean("VITE_OFFLINE_NODES_BEHIND", true),
  enableTagsBar: readBoolean("VITE_ENABLE_TAGS_BAR", true),
  defaultSelectedTag: readEnv("VITE_DEFAULT_TAG") || "",
  selectMobileDefaultView: readEnum(
    "VITE_MOBILE_DEFAULT_VIEW",
    "grid",
    allViews
  ),
  enableSwap: readBoolean("VITE_ENABLE_SWAP", true),
  isShowHWBarInCard: readBoolean("VITE_SHOW_HARDWARE_BAR", true),
  isShowValueUnderProgressBar: readBoolean(
    "VITE_SHOW_VALUE_UNDER_PROGRESS",
    false
  ),
  enableListItemProgressBar: readBoolean("VITE_ENABLE_LIST_PROGRESS", true),
  customTexts: readEnv("VITE_CUSTOM_TEXTS") || "",
};
