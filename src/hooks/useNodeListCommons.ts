import { useCallback, useMemo, useState } from "react";
import { useNodeData } from "@/contexts/NodeDataContext";
import { useLiveData } from "@/contexts/LiveDataContext";
import type { NodeData, PulseNodeStatus } from "@/types/pulse";
import { useLocale, useAppConfig } from "@/config/hooks";
import type { SortKey } from "@/components/sections/StatsBar/types";

export const useNodeListCommons = (searchTerm: string) => {
  const { nodes: staticNodes, loading, error, getTags, refreshNodes } =
    useNodeData();
  const { liveData } = useLiveData();
  const { t } = useLocale();
  const { defaultSelectedTag, isOfflineNodesBehind } = useAppConfig();
  const [selectedTag, setSelectedTag] = useState(
    defaultSelectedTag || t("tag.all")
  );
  const [sortKey, setSortKey] = useState<SortKey>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const tags = useMemo(() => [t("tag.all"), ...getTags()], [getTags, t]);

  const handleSort = useCallback(
    (key: SortKey, direction?: "asc" | "desc") => {
      if (key === null) {
        setSortKey(null);
        setSortOrder("desc");
        return;
      }

      if (direction) {
        setSortKey(key);
        setSortOrder(direction);
        return;
      }

      if (sortKey === key) {
        setSortOrder((previous) => (previous === "asc" ? "desc" : "asc"));
      } else {
        setSortKey(key);
        setSortOrder("desc");
      }
    },
    [sortKey]
  );

  const combinedNodes = useMemo(() => {
    return staticNodes.map((node: NodeData) => ({
      ...node,
      stats: liveData?.[node.uuid] as PulseNodeStatus | undefined,
    }));
  }, [staticNodes, liveData]);

  const filteredNodes = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const allTag = t("tag.all");
    const nodes = combinedNodes
      .filter(
        (node) => selectedTag === allTag || node.tags.includes(selectedTag)
      )
      .filter((node) => {
        if (!normalizedSearch) return true;
        return [node.name, node.region, node.os, ...node.tags].some((value) =>
          value.toLowerCase().includes(normalizedSearch)
        );
      });

    if (isOfflineNodesBehind || sortKey) {
      nodes.sort((a, b) => {
        if (isOfflineNodesBehind) {
          const aOnline = a.stats?.online ?? false;
          const bOnline = b.stats?.online ?? false;
          if (aOnline !== bOnline) return aOnline ? -1 : 1;
        }

        if (!sortKey) return a.weight - b.weight;

        const sortMap: Record<Exclude<SortKey, null>, keyof PulseNodeStatus> = {
          trafficUp: "net_total_up",
          trafficDown: "net_total_down",
          speedUp: "net_out",
          speedDown: "net_in",
        };
        const statsKey = sortMap[sortKey];
        const aValue = Number(a.stats?.[statsKey] || 0);
        const bValue = Number(b.stats?.[statsKey] || 0);
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      });
    }

    return nodes;
  }, [
    combinedNodes,
    isOfflineNodesBehind,
    searchTerm,
    selectedTag,
    sortKey,
    sortOrder,
    t,
  ]);

  const stats = useMemo(() => {
    return {
      onlineCount: filteredNodes.filter((node) => node.stats?.online).length,
      totalCount: filteredNodes.length,
      uniqueRegions: new Set(
        filteredNodes.map((node) => node.region).filter(Boolean)
      ).size,
      totalTrafficUp: filteredNodes.reduce(
        (total, node) => total + (node.stats?.net_total_up || 0),
        0
      ),
      totalTrafficDown: filteredNodes.reduce(
        (total, node) => total + (node.stats?.net_total_down || 0),
        0
      ),
      currentSpeedUp: filteredNodes.reduce(
        (total, node) => total + (node.stats?.net_out || 0),
        0
      ),
      currentSpeedDown: filteredNodes.reduce(
        (total, node) => total + (node.stats?.net_in || 0),
        0
      ),
    };
  }, [filteredNodes]);

  return {
    loading,
    error,
    refreshNodes,
    tags,
    filteredNodes,
    stats,
    selectedTag,
    setSelectedTag,
    handleSort,
    sortKey,
    sortOrder,
  };
};
