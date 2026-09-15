import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatBytes, formatUptime, getOSImage } from "@/utils";
import type { NodeData } from "@/types/pulse";
import { CpuIcon, MemoryStickIcon, HardDriveIcon } from "lucide-react";
import Flag from "./Flag";
import { Tag } from "../ui/tag";
import { useNodeCommons } from "@/hooks/useNodeCommons";
import { ProgressBar } from "../ui/progress-bar";
import { useAppConfig } from "@/config";
import { useLocale } from "@/config/hooks";

interface NodeGridContainerProps {
  nodes: NodeData[];
  enableSwap: boolean;
}

export const NodeGridContainer = ({
  nodes,
  enableSwap,
}: NodeGridContainerProps) => (
  <div className="grid grid-cols-[repeat(auto-fill,minmax(18rem,1fr))] gap-4">
    {nodes.map((node) => (
      <NodeGrid key={node.uuid} node={node} enableSwap={enableSwap} />
    ))}
  </div>
);

interface NodeGridProps {
  node: NodeData;
  enableSwap: boolean;
}

export const NodeGrid = ({ node, enableSwap }: NodeGridProps) => {
  const {
    stats,
    isOnline,
    tagList,
    cpuUsage,
    memUsage,
    swapUsage,
    diskUsage,
  } = useNodeCommons(node);
  const { isShowHWBarInCard, isShowValueUnderProgressBar } = useAppConfig();
  const { t } = useLocale();
  const formatTotal = (value: number) =>
    value > 0 ? formatBytes(value) : t("node.notAvailable");
  const formatCurrent = (value: number | undefined, isSpeed = false) =>
    stats ? formatBytes(value || 0, isSpeed) : t("node.notAvailable");

  return (
    <Card
      className={`flex flex-col mx-auto w-full max-w-sm ${
        isOnline
          ? ""
          : "striped-bg-red-translucent-diagonal ring-2 ring-red-500/50"
      }`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2 min-w-0">
          <Flag flag={node.region} />
          <img
            src={getOSImage(node.os)}
            alt={node.os}
            className="w-6 h-6 object-contain"
            loading="lazy"
          />
          <CardTitle className="text-base font-bold truncate">
            {node.name}
          </CardTitle>
        </div>
        <span
          className={`text-xs font-medium ${
            isOnline ? "text-green-600" : "text-red-500"
          }`}>
          {isOnline ? t("node.online") : t("node.offline")}
        </span>
      </CardHeader>
      <CardContent className="flex-grow space-y-3 text-sm text-nowrap">
        <Tag tags={tagList} />
        <div className="border-t border-(--accent-4)/50 my-2" />

        {isShowHWBarInCard && (
          <div className="flex items-center justify-around whitespace-nowrap">
            <div className="flex items-center gap-1">
              <CpuIcon className="size-4 text-blue-600 flex-shrink-0" />
              <span>
                {node.cpu_cores} {t("node.cores")}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <MemoryStickIcon className="size-4 text-green-600 flex-shrink-0" />
              <span>{formatTotal(node.mem_total)}</span>
            </div>
            <div className="flex items-center gap-1">
              <HardDriveIcon className="size-4 text-red-600 flex-shrink-0" />
              <span>{formatTotal(node.disk_total)}</span>
            </div>
          </div>
        )}

        <div className={isShowValueUnderProgressBar ? "mb-1" : ""}>
          <div className="flex items-center justify-between">
            <span>{t("node.cpu")}</span>
            <div className="w-3/4 flex items-center gap-2">
              <ProgressBar value={cpuUsage} />
              <span className="w-12 text-right">{cpuUsage.toFixed(0)}%</span>
            </div>
          </div>
        </div>

        <div className={isShowValueUnderProgressBar ? "mb-1" : ""}>
          <div className="flex items-center justify-between">
            <span>{t("node.mem")}</span>
            <div className="w-3/4 flex items-center gap-2">
              <ProgressBar value={memUsage} />
              <span className="w-12 text-right">{memUsage.toFixed(0)}%</span>
            </div>
          </div>
          {isShowValueUnderProgressBar && (
            <div className="flex text-xs items-center justify-between text-secondary-foreground">
              <span>{formatTotal(node.mem_total)}</span>
              <span>{formatCurrent(stats?.ram)}</span>
            </div>
          )}
        </div>

        {enableSwap && (
          <div className={isShowValueUnderProgressBar ? "mb-1" : ""}>
            <div className="flex items-center justify-between">
              <span>{t("node.swap")}</span>
              <div className="w-3/4 flex items-center gap-2">
                <ProgressBar value={swapUsage} />
                <span className="w-12 text-right">
                  {node.swap_total > 0
                    ? `${swapUsage.toFixed(0)}%`
                    : t("node.off")}
                </span>
              </div>
            </div>
            {isShowValueUnderProgressBar && (
              <div className="flex text-xs items-center justify-between text-secondary-foreground">
                <span>
                  {node.swap_total > 0
                    ? formatBytes(node.swap_total)
                    : t("node.notEnabled")}
                </span>
                <span>{formatCurrent(stats?.swap)}</span>
              </div>
            )}
          </div>
        )}

        <div className={isShowValueUnderProgressBar ? "mb-1" : ""}>
          <div className="flex items-center justify-between">
            <span>{t("node.disk")}</span>
            <div className="w-3/4 flex items-center gap-2">
              <ProgressBar value={diskUsage} />
              <span className="w-12 text-right">{diskUsage.toFixed(0)}%</span>
            </div>
          </div>
          {isShowValueUnderProgressBar && (
            <div className="flex text-xs items-center justify-between text-secondary-foreground">
              <span>{formatTotal(node.disk_total)}</span>
              <span>{formatCurrent(stats?.disk)}</span>
            </div>
          )}
        </div>

        <div className="border-t border-(--accent-4)/50 my-2" />
        <div className="flex justify-between text-xs">
          <span>{t("node.network")}</span>
          <div>
            <span>
              {t("node.uploadPrefix")} {formatCurrent(stats?.net_out, true)}
            </span>
            <span className="ml-2">
              {t("node.downloadPrefix")} {formatCurrent(stats?.net_in, true)}
            </span>
          </div>
        </div>
        <div className="flex justify-between text-xs">
          <span>{t("node.traffic")}</span>
          <div>
            <span>
              {t("node.uploadPrefix")} {formatCurrent(stats?.net_total_up)}
            </span>
            <span className="ml-2">
              {t("node.downloadPrefix")} {formatCurrent(stats?.net_total_down)}
            </span>
          </div>
        </div>
        <div className="flex justify-between text-xs">
          <span>{t("node.uptime")}</span>
          <span>
            {isOnline && stats
              ? formatUptime(stats.uptime)
              : t("node.offline")}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
