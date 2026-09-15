import { forwardRef } from "react";
import { useAppConfig, useLocale } from "@/config/hooks";
import { Card } from "../ui/card";
import { cn } from "@/utils";

const Footer = forwardRef<HTMLElement>((_, ref) => {
  const { t } = useLocale();
  const { selectedFooterStyle } = useAppConfig();

  return (
    <footer
      ref={ref}
      className={cn(
        selectedFooterStyle === "levitation"
          ? "fixed"
          : selectedFooterStyle === "followContent"
          ? "mb-4 w-(--main-width) max-w-screen-2xl mx-auto"
          : "",
        "bottom-0 left-0 right-0 flex z-10"
      )}>
      <Card
        className={cn(
          selectedFooterStyle !== "followContent" ? "rounded-none" : "",
          "p-2 w-full flex items-center justify-center inset-shadow-sm inset-shadow-(color:--accent-a4)"
        )}>
        <p className="flex justify-center text-sm text-secondary-foreground theme-text-shadow whitespace-pre">
          {t("footer.poweredBy")} {" "}
          <a
            href="https://github.com/xhhcn/Pulse"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-600 transition-colors">
            Pulse
          </a>
          {" | "}
          {t("footer.themeBy")} {" "}
          <a
            href="https://github.com/Yeqingky/Pulse-theme-purcarte"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-600 transition-colors">
            PurCarte
          </a>
        </p>
      </Card>
    </footer>
  );
});

Footer.displayName = "Footer";

export default Footer;
