import { cn, formatBytes } from "@/utils";
import type { NodeData } from "@/types/pulse";
import {
  CpuIcon,
  MemoryStickIcon,
  HardDriveIcon,
} from "lucide-react";
import Flag from "./Flag";
import { Tag } from "../ui/tag";
import { useNodeCommons } from "@/hooks/useNodeCommons";
import { ProgressBar } from "../ui/progress-bar";
import { useLocale } from "@/config/hooks";
import { Card } from "../ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NodeTableProps {
  nodes: NodeData[];
  enableSwap: boolean;
  enableListItemProgressBar: boolean;
}

export const NodeTable = ({
  nodes,
  enableSwap,
  enableListItemProgressBar,
}: NodeTableProps) => {
  const { t } = useLocale();
  const gridCols = enableSwap ? "grid-cols-8" : "grid-cols-7";

  return (
    <ScrollArea className="w-full" showHorizontalScrollbar>
      <div className="min-w-[1080px] px-2 pb-2">
        <div className="space-y-1">
          <Card
            className={`theme-card-style text-primary font-bold grid ${gridCols} text-center gap-4 p-2 items-center transition-colors duration-200`}>
            <div className="col-span-2">{t("node.name")}</div>
            <div>{t("node.cpu")}</div>
            <div>{t("node.mem")}</div>
            {enableSwap && <div>{t("node.swap")}</div>}
            <div>{t("node.disk")}</div>
            <div>{t("node.network")}</div>
            <div>{t("node.traffic")}</div>
          </Card>
          {nodes.map((node) => (
            <NodeTableRow
              key={node.uuid}
              node={node}
              enableSwap={enableSwap}
              enableListItemProgressBar={enableListItemProgressBar}
            />
          ))}
        </div>
      </div>
    </ScrollArea>
  );
};

interface NodeTableRowProps {
  node: NodeData;
  enableSwap: boolean;
  enableListItemProgressBar: boolean;
}

const NodeTableRow = ({
  node,
  enableSwap,
  enableListItemProgressBar,
}: NodeTableRowProps) => {
  const {
    stats,
    isOnline,
    tagList,
    cpuUsage,
    memUsage,
    swapUsage,
    diskUsage,
  } = useNodeCommons(node);
  const { t } = useLocale();
  const gridCols = enableSwap ? "grid-cols-8" : "grid-cols-7";
  const formatCurrent = (value: number | undefined, isSpeed = false) =>
    stats ? formatBytes(value || 0, isSpeed) : t("node.notAvailable");
  const formatTotal = (value: number) =>
    value > 0 ? formatBytes(value) : t("node.notAvailable");

  const renderUsage = (usage: number) =>
    enableListItemProgressBar ? (
      <div className="flex items-center gap-1">
        <ProgressBar value={usage} h="h-2" />
        <span className="w-10 text-right text-xs">
          {isOnline ? `${usage.toFixed(0)}%` : t("node.notAvailable")}
        </span>
      </div>
    ) : (
      <div>{isOnline ? `${usage.toFixed(0)}%` : t("node.notAvailable")}</div>
    );

  return (
    <Card
      className={cn(
        "grid text-center gap-4 p-2 text-nowrap items-center text-primary transition-colors duration-200",
        gridCols,
        !isOnline && "striped-bg-red-translucent-diagonal ring-2 ring-red-500/50"
      )}>
      <div className="col-span-2 flex items-center text-left min-w-0">
        <Flag flag={node.region} size="4" />
        <div className="ml-2 min-w-0 space-y-1">
          <div className="text-base font-bold truncate">{node.name}</div>
          <Tag className="text-xs" tags={tagList} />
          <div className={isOnline ? "text-green-600" : "text-red-500"}>
            {isOnline ? t("node.online") : t("node.offline")}
          </div>
        </div>
      </div>

      <div className="flex items-center text-left">
        <CpuIcon className="inline-block size-5 flex-shrink-0 text-blue-600" />
        <div className="ml-1 w-full">
          <div>
            {node.cpu_cores} {t("node.cores")}
          </div>
          {renderUsage(cpuUsage)}
        </div>
      </div>

      <div className="flex items-center text-left">
        <MemoryStickIcon className="inline-block size-5 flex-shrink-0 text-green-600" />
        <div className="ml-1 w-full">
          <div>{formatTotal(node.mem_total)}</div>
          {renderUsage(memUsage)}
        </div>
      </div>

      {enableSwap && (
        <div className="flex items-center text-left">
          <MemoryStickIcon className="inline-block size-5 flex-shrink-0 text-purple-600" />
          {node.swap_total > 0 ? (
            <div className="ml-1 w-full">
              <div>{formatTotal(node.swap_total)}</div>
              {renderUsage(swapUsage)}
            </div>
          ) : (
            <div className="ml-1 w-full">{t("node.off")}</div>
          )}
        </div>
      )}

      <div className="flex items-center text-left">
        <HardDriveIcon className="inline-block size-5 flex-shrink-0 text-red-600" />
        <div className="ml-1 w-full">
          <div>{formatTotal(node.disk_total)}</div>
          {renderUsage(diskUsage)}
        </div>
      </div>

      <div className="text-left">
        <div>
          {t("node.uploadPrefix")} {formatCurrent(stats?.net_out, true)}
        </div>
        <div>
          {t("node.downloadPrefix")} {formatCurrent(stats?.net_in, true)}
        </div>
      </div>

      <div className="text-left">
        <div>
          {t("node.uploadPrefix")} {formatCurrent(stats?.net_total_up)}
        </div>
        <div>
          {t("node.downloadPrefix")} {formatCurrent(stats?.net_total_down)}
        </div>
      </div>
    </Card>
  );
};
