import { createContext } from "react";
import type { ConfigOptions } from "./default";
import { DEFAULT_CONFIG } from "./default";
import { defaultTexts } from "./locales";

export interface ConfigContextType extends ConfigOptions {
  texts: typeof defaultTexts;
}

export const ConfigContext = createContext<ConfigContextType>({
  ...DEFAULT_CONFIG,
  texts: defaultTexts,
});
