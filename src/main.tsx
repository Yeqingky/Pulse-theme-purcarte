import { StrictMode, useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Header } from "@/components/sections/Header";
import { ConfigProvider, useAppConfig } from "@/config";
import { DynamicContent } from "@/components/DynamicContent";
import { useThemeManager, useTheme } from "@/hooks/useTheme";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { NodeDataProvider } from "@/contexts/NodeDataContext";
import { LiveDataProvider } from "@/contexts/LiveDataContext";
import Footer from "@/components/sections/Footer";
import HomePage from "@/pages/Home";
import { useNodeListCommons } from "@/hooks/useNodeListCommons";
import type { StatsBarProps } from "./components/sections/StatsBar";

export const AppContent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const dashboard = useNodeListCommons(searchTerm);
  const {
    appearance,
    color,
    statusCardsVisibility,
    setStatusCardsVisibility,
  } = useTheme();
  const { selectedHeaderStyle, selectedFooterStyle } = useAppConfig();
  const [footerHeight, setFooterHeight] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(0);
  const footerRef = useRef<HTMLElement | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const resizeObserver = new ResizeObserver(() => {
      setHeaderHeight(header.offsetHeight);
    });
    resizeObserver.observe(header);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    const resizeObserver = new ResizeObserver(() => {
      setFooterHeight(footer.offsetHeight);
    });
    resizeObserver.observe(footer);
    return () => resizeObserver.disconnect();
  }, [selectedFooterStyle]);

  const statsBarProps: StatsBarProps = {
    displayOptions: statusCardsVisibility,
    setDisplayOptions: setStatusCardsVisibility,
    stats: dashboard.stats,
    loading: dashboard.loading,
    tags: dashboard.tags,
    selectedTag: dashboard.selectedTag,
    onSelectTag: dashboard.setSelectedTag,
    onSort: dashboard.handleSort,
    sortKey: dashboard.sortKey,
    sortDirection: dashboard.sortOrder,
  };

  return (
    <Theme
      appearance={appearance}
      accentColor={color}
      scaling="110%"
      style={{ backgroundColor: "transparent" }}>
      <DynamicContent>
        <div className="grid h-dvh overflow-hidden">
          <div className="flex flex-col text-sm flex-1 overflow-hidden">
            <Header
              ref={headerRef}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              {...statsBarProps}
            />
            <div className="flex-1 min-h-0">
              <ScrollArea className="h-full">
                <div className="flex flex-col min-h-screen">
                  <main
                    className="w-(--main-width) max-w-screen-2xl mx-auto h-full flex-grow"
                    style={{
                      paddingTop:
                        selectedHeaderStyle === "levitation"
                          ? headerHeight
                          : 0,
                      paddingBottom:
                        selectedFooterStyle === "levitation"
                          ? footerHeight
                          : 0,
                    }}>
                    <HomePage
                      searchTerm={searchTerm}
                      setSearchTerm={setSearchTerm}
                      filteredNodes={dashboard.filteredNodes}
                      selectedTag={dashboard.selectedTag}
                      setSelectedTag={dashboard.setSelectedTag}
                      stats={dashboard.stats}
                      tags={dashboard.tags}
                      handleSort={dashboard.handleSort}
                    />
                  </main>
                  {selectedFooterStyle === "followContent" && (
                    <Footer ref={footerRef} />
                  )}
                </div>
              </ScrollArea>
            </div>
            {selectedFooterStyle !== "followContent" &&
              selectedFooterStyle !== "hidden" && <Footer ref={footerRef} />}
          </div>
        </div>
      </DynamicContent>
    </Theme>
  );
};

export const App = () => {
  const themeManager = useThemeManager();

  return (
    <ThemeProvider value={themeManager}>
      <NodeDataProvider>
        <LiveDataProvider>
          <AppContent />
        </LiveDataProvider>
      </NodeDataProvider>
    </ThemeProvider>
  );
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConfigProvider>
      <App />
    </ConfigProvider>
  </StrictMode>
);
