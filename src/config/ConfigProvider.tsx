import { type ReactNode, useMemo } from "react";
import { ConfigContext } from "./ConfigContext";
import { DEFAULT_CONFIG } from "./default";
import { defaultTexts, otherTexts } from "./locales";
import { deepMerge, mergeTexts } from "@/utils/localeUtils";

interface ConfigProviderProps {
  children: ReactNode;
}

export function ConfigProvider({ children }: ConfigProviderProps) {
  const texts = useMemo(() => {
    const baseTexts = DEFAULT_CONFIG.customTexts
      ? mergeTexts(defaultTexts, DEFAULT_CONFIG.customTexts)
      : defaultTexts;
    return deepMerge(baseTexts, otherTexts);
  }, []);

  return (
    <ConfigContext.Provider value={{ ...DEFAULT_CONFIG, texts }}>
      {children}
    </ConfigContext.Provider>
  );
}
