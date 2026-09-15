import { useMemo } from "react";
import type { NodeData, PulseNodeStatus } from "@/types/pulse";
import { useLiveData } from "@/contexts/LiveDataContext";

export type NodeWithStats = NodeData & { stats?: PulseNodeStatus };

export const useNodeCommons = (node: NodeWithStats) => {
  const { liveData } = useLiveData();
  const stats = node.stats ?? liveData?.[node.uuid];
  const isOnline = stats?.online ?? false;

  const tagList = useMemo(() => node.tags, [node.tags]);
  const cpuUsage = isOnline ? stats?.cpu ?? 0 : 0;
  const memUsage = isOnline ? stats?.ram_percent ?? 0 : 0;
  const swapUsage = isOnline ? stats?.swap_percent ?? 0 : 0;
  const diskUsage = isOnline ? stats?.disk_percent ?? 0 : 0;

  return {
    stats,
    isOnline,
    tagList,
    cpuUsage,
    memUsage,
    swapUsage,
    diskUsage,
  };
};
