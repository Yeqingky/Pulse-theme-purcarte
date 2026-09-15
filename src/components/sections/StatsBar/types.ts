export type DisplayOptions = {
  currentTime: boolean;
  currentOnline: boolean;
  regionOverview: boolean;
  trafficOverview: boolean;
  networkSpeed: boolean;
};

export type StatsSnapshot = {
  onlineCount: number;
  totalCount: number;
  uniqueRegions: number;
  totalTrafficUp: number;
  totalTrafficDown: number;
  currentSpeedUp: number;
  currentSpeedDown: number;
};

export type SortKey =
  | "trafficUp"
  | "trafficDown"
  | "speedUp"
  | "speedDown"
  | null;

export interface StatsBarProps {
  displayOptions: DisplayOptions;
  setDisplayOptions: (options: Partial<DisplayOptions>) => void;
  stats: StatsSnapshot;
  loading: boolean;
  enableTagsBar?: boolean;
  tags?: string[];
  selectedTag?: string;
  onSelectTag?: (tag: string) => void;
  isShowStatsInHeader?: boolean;
  onSort?: (key: SortKey, direction: "asc" | "desc") => void;
  sortKey?: SortKey;
  sortDirection?: "asc" | "desc";
}
