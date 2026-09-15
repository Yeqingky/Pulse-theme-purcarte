import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatBytes, formatUptime, getOSImage } from "@/utils";
import type { NodeData } from "@/types/pulse";
import {
  CpuIcon,
  MemoryStickIcon,
  HardDriveIcon,
  ArrowUpDownIcon,
  GaugeIcon,
} from "lucide-react";
import Flag from "./Flag";
import { Tag } from "../ui/tag";
import { useNodeCommons } from "@/hooks/useNodeCommons";
import { useLocale } from "@/config/hooks";

interface NodeCompactContainerProps {
  nodes: NodeData[];
  enableSwap: boolean;
}

export const NodeCompactContainer = ({
  nodes,
  enableSwap,
}: NodeCompactContainerProps) => (
  <div className="grid grid-cols-[repeat(auto-fill,minmax(18rem,1fr))] gap-4">
    {nodes.map((node) => (
      <NodeCompact key={node.uuid} node={node} enableSwap={enableSwap} />
    ))}
  </div>
);

interface NodeCompactProps {
  node: NodeData;
  enableSwap: boolean;
}

export const NodeCompact = ({ node, enableSwap }: NodeCompactProps) => {
  const { stats, isOnline, tagList, cpuUsage, memUsage, swapUsage, diskUsage } =
    useNodeCommons(node);
  const { t } = useLocale();
  const formatCurrent = (value: number | undefined, isSpeed = false) =>
    stats ? formatBytes(value || 0, isSpeed) : t("node.notAvailable");

  return (
    <Card
      className={`flex flex-col mx-auto w-full max-w-sm ${
        isOnline
          ? ""
          : "striped-bg-red-translucent-diagonal ring-2 ring-red-500/50"
      }`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
        <div className="flex items-center gap-2 min-w-0">
          <Flag flag={node.region} size="4" />
          <img
            src={getOSImage(node.os)}
            alt={node.os}
            className="size-4 object-contain"
            loading="lazy"
          />
          <CardTitle className="text-sm font-bold truncate">
            {node.name}
          </CardTitle>
        </div>
        <span className={isOnline ? "text-green-600" : "text-red-500"}>
          {isOnline ? t("node.online") : t("node.offline")}
        </span>
      </CardHeader>
      <CardContent className="flex-grow space-y-1 text-xs flex-shrink-0">
        <Tag tags={tagList} />
        <div className="border-t border-(--accent-4)/50 my-1" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <CpuIcon className="size-4 text-blue-600" />
            <span>{cpuUsage.toFixed(0)}%</span>
          </div>
          <div className="flex items-center gap-1">
            <MemoryStickIcon className="size-4 text-green-600" />
            <span>{memUsage.toFixed(0)}%</span>
          </div>
          {enableSwap && (
            <div className="flex items-center gap-1">
              <MemoryStickIcon className="size-4 text-purple-600" />
              <span>
                {node.swap_total > 0 ? `${swapUsage.toFixed(0)}%` : t("node.off")}
              </span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <HardDriveIcon className="size-4 text-red-600" />
            <span>{diskUsage.toFixed(0)}%</span>
          </div>
        </div>
        <div className="flex grid grid-cols-2">
          <div className="flex items-center col-span-1">
            <GaugeIcon className="size-5 text-(--accent-11) mr-2" />
            <div>
              <div>
                {t("node.uploadPrefix")} {formatCurrent(stats?.net_out, true)}
              </div>
              <div>
                {t("node.downloadPrefix")} {formatCurrent(stats?.net_in, true)}
              </div>
            </div>
          </div>
          <div className="flex items-center col-span-1">
            <ArrowUpDownIcon className="size-5 text-(--accent-11) mr-2" />
            <div>
              <div>
                {t("node.uploadPrefix")} {formatCurrent(stats?.net_total_up)}
              </div>
              <div>
                {t("node.downloadPrefix")} {formatCurrent(stats?.net_total_down)}
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span>{t("node.uptime")}</span>
          <span>
            {isOnline && stats ? formatUptime(stats.uptime) : t("node.offline")}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
