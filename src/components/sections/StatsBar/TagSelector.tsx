import { memo } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Tags } from "lucide-react";
import { cn } from "@/utils";
import type { StatsBarProps } from "./types";
import { useLocale } from "@/config/hooks";

export const TagSelector = memo(
  ({
    tags,
    selectedTag,
    onSelectTag,
  }: Pick<StatsBarProps, "tags" | "selectedTag" | "onSelectTag">) => {
    const { t } = useLocale();
    if (!tags?.length || !onSelectTag) return null;

    return (
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="default"
            size="sm"
            className="h-7 shrink-0 rounded-full px-2 text-xs font-semibold">
            <Tags className="mr-1.5 h-3.5 w-3.5" />
            {selectedTag}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center">
          <DropdownMenuLabel>{t("tag.selectTitle")}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {tags.map((tag) => (
            <DropdownMenuItem
              key={tag}
              className={cn(
                "cursor-pointer text-sm",
                selectedTag === tag && "bg-secondary/30 font-semibold"
              )}
              onSelect={() => onSelectTag(tag)}>
              {tag}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
);
