import { Button } from "@/components/ui/button";
import { StatsBar } from "@/components/sections/StatsBar";
import { NodeGridContainer } from "@/components/sections/NodeGrid";
import { NodeCompactContainer } from "@/components/sections/NodeCompact";
import { NodeTable } from "@/components/sections/NodeTable";
import Loading from "@/components/loading";
import type { NodeWithStats } from "@/hooks/useNodeCommons";
import type { StatsSnapshot, SortKey } from "@/components/sections/StatsBar/types";
import { useNodeData } from "@/contexts/NodeDataContext";
import { useAppConfig } from "@/config";
import { useTheme } from "@/hooks/useTheme";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useIsMobile } from "@/hooks/useMobile";
import { useLocale } from "@/config/hooks";
import { cn } from "@/utils";

interface HomePageProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredNodes: NodeWithStats[];
  selectedTag: string;
  setSelectedTag: (tag: string) => void;
  stats: StatsSnapshot;
  tags: string[];
  handleSort: (key: SortKey, direction?: "asc" | "desc") => void;
}

const HomePage = ({
  searchTerm,
  setSearchTerm,
  filteredNodes,
  selectedTag,
  setSelectedTag,
  stats,
  tags,
  handleSort,
}: HomePageProps) => {
  const { viewMode, statusCardsVisibility, setStatusCardsVisibility } =
    useTheme();
  const { loading, error, refreshNodes } = useNodeData();
  const {
    enableTagsBar,
    enableStatsBar,
    enableSwap,
    enableListItemProgressBar,
    isShowStatsInHeader,
    mergeTagsWithStats,
  } = useAppConfig();
  const { t } = useLocale();
  const isMobile = useIsMobile();
  const hasSearchTerm = searchTerm.trim().length > 0;

  if (loading) return <Loading text={t("homePage.loadingData")} />;

  const renderContent = () => {
    if (viewMode === "grid") {
      return <NodeGridContainer nodes={filteredNodes} enableSwap={enableSwap} />;
    }
    if (viewMode === "compact") {
      return (
        <NodeCompactContainer nodes={filteredNodes} enableSwap={enableSwap} />
      );
    }
    return (
      <NodeTable
        nodes={filteredNodes}
        enableSwap={enableSwap}
        enableListItemProgressBar={enableListItemProgressBar}
      />
    );
  };

  return (
    <div className="fade-in my-4">
      {enableStatsBar && (!isShowStatsInHeader || isMobile) && (
        <StatsBar
          displayOptions={statusCardsVisibility}
          setDisplayOptions={setStatusCardsVisibility}
          stats={stats}
          loading={loading}
          isShowStatsInHeader={isShowStatsInHeader}
          enableTagsBar={enableTagsBar}
          tags={tags}
          selectedTag={selectedTag}
          onSelectTag={setSelectedTag}
          onSort={handleSort}
        />
      )}

      {enableTagsBar && !mergeTagsWithStats && (
        <div className="flex purcarte-blur theme-card-style overflow-auto whitespace-nowrap items-center min-w-[300px] text-primary space-x-4 px-4 my-4">
          <span>{t("tag.name")}</span>
          {tags.map((tag) => (
            <Button
              key={tag}
              variant={selectedTag === tag ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setSelectedTag(tag)}>
              {tag}
            </Button>
          ))}
        </div>
      )}

      <div className={cn("space-y-4", viewMode === "table" && "-mx-2 -mb-2")}>
        {filteredNodes.length > 0 ? (
          renderContent()
        ) : (
          <div className="flex flex-grow items-center justify-center">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">
                  {hasSearchTerm
                    ? t("search.notFound")
                    : error
                    ? t("homePage.errorFetchingNodes")
                    : t("homePage.noNodes")}
                </CardTitle>
                <CardDescription>
                  {hasSearchTerm
                    ? t("search.tryChangingFilters")
                    : error
                    ? t("homePage.retryFetchingNodes")
                    : t("homePage.waitingForData")}
                </CardDescription>
              </CardHeader>
              <CardFooter>
                {hasSearchTerm ? (
                  <Button onClick={() => setSearchTerm("")} className="w-full">
                    {t("search.clear")}
                  </Button>
                ) : (
                  <Button onClick={refreshNodes} className="w-full">
                    {t("search.retry")}
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
