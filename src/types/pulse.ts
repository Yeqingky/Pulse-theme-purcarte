export interface PulseSystem {
  id: string | number;
  name?: string;
  time?: string;
  location?: string;
  virtualization_type?: string;
  os?: string;
  os_icon?: string;
  cpu?: number;
  cpu_model?: string;
  memory?: number;
  memory_info?: string;
  swap_info?: string;
  disk?: number;
  disk_info?: string;
  net_in_mb_s?: number;
  net_out_mb_s?: number;
  total_net_in_bytes?: number;
  total_net_out_bytes?: number;
  agent_version?: string;
  order?: number;
  alert?: boolean;
  updated_at?: string;
  tags?: string[] | null;
}

export interface PulseUpdate {
  type?: string;
  view?: string;
  count?: number;
  systems?: PulseSystem[];
}

export interface NodeData {
  uuid: string;
  name: string;
  cpu_name: string;
  cpu_cores: number;
  virtualization: string;
  arch: string;
  os: string;
  region: string;
  mem_total: number;
  swap_total: number;
  disk_total: number;
  weight: number;
  tags: string[];
  agent_version: string;
  updated_at: string;
}

export interface PulseNodeStatus {
  client: string;
  time: string;
  cpu: number;
  ram: number;
  ram_total: number;
  ram_percent: number;
  swap: number;
  swap_total: number;
  swap_percent: number;
  disk: number;
  disk_total: number;
  disk_percent: number;
  net_in: number;
  net_out: number;
  net_total_up: number;
  net_total_down: number;
  online: boolean;
  uptime: number;
  agent_version: string;
}

export type PulseNodeStatusMap = Record<string, PulseNodeStatus>;
