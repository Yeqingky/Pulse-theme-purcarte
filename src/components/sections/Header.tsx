import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Grid3X3,
  Table2,
  Rows3,
  Moon,
  Sun,
  SunMoon,
  Menu,
} from "lucide-react";
import { forwardRef, useEffect, useState } from "react";
import { useAppConfig } from "@/config";
import { SITE_DESCRIPTION } from "@/config/default";
import { useTheme } from "@/hooks/useTheme";
import { useIsMobile } from "@/hooks/useMobile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLocale } from "@/config/hooks";
import { StatsBar } from "../sections/StatsBar";
import type { StatsBarProps } from "../sections/StatsBar";
import { Card } from "../ui/card";

interface HeaderProps extends Partial<StatsBarProps> {
  searchTerm?: string;
  setSearchTerm?: (term: string) => void;
}

const ViewModeIcons = {
  grid: Grid3X3,
  compact: Rows3,
  table: Table2,
};

const ThemeIcons = {
  light: Sun,
  dark: Moon,
  system: SunMoon,
};

const ViewMenuItems = ({
  setViewMode,
}: {
  setViewMode: (mode: "grid" | "compact" | "table") => void;
}) => {
  const { t } = useLocale();
  return (
    <>
      <DropdownMenuItem onClick={() => setViewMode("grid")}>
        <Grid3X3 className="size-4 mr-2 text-primary" />
        <span>{t("header.grid")}</span>
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => setViewMode("compact")}>
        <Rows3 className="size-4 mr-2 text-primary" />
        <span>{t("header.compact")}</span>
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => setViewMode("table")}>
        <Table2 className="size-4 mr-2 text-primary" />
        <span>{t("header.table")}</span>
      </DropdownMenuItem>
    </>
  );
};

const ThemeMenuItems = ({
  setAppearance,
}: {
  setAppearance: (appearance: "light" | "dark" | "system") => void;
}) => {
  const { t } = useLocale();
  return (
    <>
      <DropdownMenuItem onClick={() => setAppearance("light")}>
        <Sun className="size-4 mr-2 text-primary" />
        <span>{t("header.lightMode")}</span>
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => setAppearance("dark")}>
        <Moon className="size-4 mr-2 text-primary" />
        <span>{t("header.darkMode")}</span>
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => setAppearance("system")}>
        <SunMoon className="size-4 mr-2 text-primary" />
        <span>{t("header.systemMode")}</span>
      </DropdownMenuItem>
    </>
  );
};

const ViewModeSwitcher = ({ isMobile }: { isMobile?: boolean }) => {
  const { viewMode, setViewMode } = useTheme();
  const { t } = useLocale();
  const Icon = ViewModeIcons[viewMode];

  if (isMobile) {
    return (
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>
          <Icon className="size-4 mr-2 text-primary" />
          <span>{t("header.toggleView")}</span>
        </DropdownMenuSubTrigger>
        <DropdownMenuSubContent className="purcarte-blur border-(--accent-4)/50 rounded-xl">
          <ViewMenuItems setViewMode={setViewMode} />
        </DropdownMenuSubContent>
      </DropdownMenuSub>
    );
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Icon className="size-5 text-primary" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="purcarte-blur mt-[.5rem] border-(--accent-4)/50 rounded-xl">
        <ViewMenuItems setViewMode={setViewMode} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const ThemeSwitcher = ({ isMobile }: { isMobile?: boolean }) => {
  const { rawAppearance, setAppearance } = useTheme();
  const { t } = useLocale();
  const Icon = ThemeIcons[rawAppearance];

  if (isMobile) {
    return (
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>
          <Icon className="size-4 mr-2 text-primary" />
          <span>{t("header.toggleTheme")}</span>
        </DropdownMenuSubTrigger>
        <DropdownMenuSubContent className="purcarte-blur border-(--accent-4)/50 rounded-xl">
          <ThemeMenuItems setAppearance={setAppearance} />
        </DropdownMenuSubContent>
      </DropdownMenuSub>
    );
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Icon className="size-5 text-primary" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="purcarte-blur mt-[.5rem] border-(--accent-4)/50 rounded-xl">
        <ThemeMenuItems setAppearance={setAppearance} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const SearchBar = ({
  isMobile,
  searchTerm,
  setSearchTerm,
}: {
  isMobile?: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}) => {
  const { t } = useLocale();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { enableSearchButton } = useAppConfig();

  if (!enableSearchButton) return null;

  if (isMobile) {
    return (
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative group">
            <Search className="size-5 text-primary" />
            {searchTerm && (
              <span className="absolute top-0 right-0 w-1.5 h-1.5 rounded-full bg-(--accent-indicator) transform -translate-x-1/2" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="purcarte-blur border-(--accent-4)/50 rounded-xl w-[90vw] translate-x-[5vw] mt-[.5rem] max-w-screen-2xl">
          <div className="p-2">
            <Input
              type="search"
              placeholder={t("search.placeholder")}
              className="w-full"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <>
      <div
        className={`flex items-center transition-all duration-300 ease-in-out overflow-hidden transform ${
          isSearchOpen ? "w-48 opacity-100" : "w-0 opacity-0"
        }`}>
        <Input
          type="search"
          placeholder={t("search.placeholder")}
          className={`transition-all duration-300 ease-in-out ${
            !isSearchOpen && "invisible"
          }`}
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="relative group"
        onClick={() => setIsSearchOpen((open) => !open)}>
        <Search className="size-5 text-primary" />
        {searchTerm && (
          <span className="absolute top-0 right-0 w-1.5 h-1.5 rounded-full bg-(--accent-indicator) transform -translate-x-1/2" />
        )}
      </Button>
    </>
  );
};

export const Header = forwardRef<HTMLElement, HeaderProps>((props, ref) => {
  const { searchTerm = "", setSearchTerm = () => {} } = props;
  const {
    selectedHeaderStyle,
    enableTitle,
    titleText,
    enableLogo,
    logoUrl,
    faviconUrl,
    isShowStatsInHeader,
    enableStatsBar,
  } = useAppConfig();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (titleText) document.title = titleText;
    const description = document.querySelector('meta[name="description"]');
    description?.setAttribute("content", SITE_DESCRIPTION);

    let favicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (!favicon) {
      favicon = document.createElement("link");
      favicon.rel = "icon";
      document.head.appendChild(favicon);
    }
    favicon.href = faviconUrl;
  }, [titleText, faviconUrl]);

  return (
    <header
      ref={ref}
      className={`${selectedHeaderStyle === "levitation" ? "fixed" : "sticky"} top-0 left-0 right-0 flex z-10`}>
      <Card className="rounded-none w-full flex items-center justify-center">
        <div className="w-(--main-width) max-w-screen-2xl py-2 flex items-center justify-between">
          <div className="flex items-center theme-text-shadow text-accent-foreground min-w-0">
            <a
              href="/"
              className="flex items-center gap-2 text-2xl font-bold min-w-0">
              {enableLogo && logoUrl && (
                <img src={logoUrl} alt="logo" className="h-8" />
              )}
              {enableTitle && <span className="truncate">{titleText}</span>}
            </a>
          </div>

          {enableStatsBar && isShowStatsInHeader && !isMobile && (
            <div className="flex-1 flex justify-center">
              <StatsBar {...(props as Required<StatsBarProps>)} />
            </div>
          )}

          <div className="flex items-center space-x-2">
            {isMobile ? (
              <>
                <SearchBar
                  isMobile
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                />
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative group">
                      <Menu className="size-5 text-primary transition-transform duration-300 group-data-[state=open]:rotate-180" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="purcarte-blur mt-[.5rem] border-(--accent-4)/50 rounded-xl">
                    <ViewModeSwitcher isMobile />
                    <ThemeSwitcher isMobile />
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <SearchBar
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                />
                <ViewModeSwitcher />
                <ThemeSwitcher />
              </>
            )}
          </div>
        </div>
      </Card>
    </header>
  );
});
