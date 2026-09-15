import {
  PULSE_EVENTS_URL,
  PULSE_RECONNECT_DELAY,
  PULSE_SHARE_TOKEN,
  PULSE_WITH_CREDENTIALS,
} from "@/config/default";
import type {
  NodeData,
  PulseNodeStatus,
  PulseNodeStatusMap,
  PulseSystem,
  PulseUpdate,
} from "@/types/pulse";

const BYTES_PER_MEGABYTE = 1024 * 1024;
const MAX_RECONNECT_DELAY = 60_000;

const byteUnits: Record<string, number> = {
  B: 1,
  KB: 1_000,
  MB: 1_000_000,
  GB: 1_000_000_000,
  TB: 1_000_000_000_000,
  KIB: 1024,
  MIB: 1024 ** 2,
  GIB: 1024 ** 3,
  TIB: 1024 ** 4,
  PIB: 1024 ** 5,
};

const toNumber = (value: unknown, fallback = 0): number => {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const clampPercentage = (value: unknown): number =>
  Math.min(100, Math.max(0, toNumber(value)));

const normalizeText = (value: unknown, fallback = ""): string => {
  if (typeof value !== "string") return fallback;
  const normalized = value.trim();
  return normalized || fallback;
};

export interface ParsedResourceInfo {
  used: number;
  total: number;
}

/** Parse Pulse values such as "487.62 MiB / 956.36 MiB" into bytes. */
export const parseResourceInfo = (value: unknown): ParsedResourceInfo => {
  if (typeof value !== "string") return { used: 0, total: 0 };

  const matches = [
    ...value.matchAll(
      /([\d]+(?:[.,][\d]+)?)\s*(B|KB|MB|GB|TB|KiB|MiB|GiB|TiB|PiB)\b/gi
    ),
  ];
  const values = matches.map((match) => {
    const amount = Number(match[1].replaceAll(",", ""));
    const unit = match[2].toUpperCase();
    return Number.isFinite(amount) ? amount * (byteUnits[unit] || 1) : 0;
  });

  return {
    used: values[0] || 0,
    total: values[1] || 0,
  };
};

/** Parse Pulse uptime strings such as "76d", "2h 15m", or "30s". */
export const parseUptime = (value: unknown): number => {
  if (typeof value !== "string") return toNumber(value);

  const normalized = value.trim().toLowerCase();
  const matches = [
    ...normalized.matchAll(
      /(\d+(?:\.\d+)?)\s*(d|day|days|h|hour|hours|m|min|mins|minute|minutes|s|sec|secs|second|seconds)\b/g
    ),
  ];
  if (!matches.length) return toNumber(normalized);

  const factors: Record<string, number> = {
    d: 86_400,
    day: 86_400,
    days: 86_400,
    h: 3_600,
    hour: 3_600,
    hours: 3_600,
    m: 60,
    min: 60,
    mins: 60,
    minute: 60,
    minutes: 60,
    s: 1,
    sec: 1,
    secs: 1,
    second: 1,
    seconds: 1,
  };

  return matches.reduce((total, match) => {
    const amount = Number(match[1]);
    return total + (Number.isFinite(amount) ? amount * factors[match[2]] : 0);
  }, 0);
};

export const normalizeTags = (value: unknown): string[] => {
  const rawTags = Array.isArray(value)
    ? value
    : typeof value === "string"
    ? value.split(",")
    : [];

  return Array.from(
    new Set(
      rawTags
        .map((tag) => normalizeText(tag))
        .filter((tag): tag is string => Boolean(tag))
    )
  );
};

const normalizeTimestamp = (value: unknown): string => {
  const text = normalizeText(value);
  if (text && !Number.isNaN(Date.parse(text))) {
    return new Date(text).toISOString();
  }
  return new Date().toISOString();
};

const getCpuCores = (cpuModel: string): number => {
  const match = cpuModel.match(/(\d+)\s+virtual\s+core/i);
  return match ? Math.max(1, Number(match[1])) : 1;
};

export const pulseSystemToNode = (system: PulseSystem): NodeData => {
  const cpuName = normalizeText(system.cpu_model, "Unknown CPU");
  const memory = parseResourceInfo(system.memory_info);
  const swap = parseResourceInfo(system.swap_info);
  const disk = parseResourceInfo(system.disk_info);
  const updatedAt = normalizeTimestamp(system.updated_at);

  return {
    uuid: String(system.id),
    name: normalizeText(system.name, String(system.id)),
    cpu_name: cpuName,
    cpu_cores: getCpuCores(cpuName),
    virtualization: normalizeText(system.virtualization_type, "N/A"),
    arch: "N/A",
    os: normalizeText(system.os, "Unknown"),
    region: normalizeText(system.location, "UN"),
    mem_total: memory.total,
    swap_total: swap.total,
    disk_total: disk.total,
    weight: toNumber(system.order),
    tags: normalizeTags(system.tags),
    agent_version: normalizeText(system.agent_version, "N/A"),
    updated_at: updatedAt,
  };
};

export const pulseSystemToStatus = (
  system: PulseSystem
): PulseNodeStatus => {
  const memory = parseResourceInfo(system.memory_info);
  const swap = parseResourceInfo(system.swap_info);
  const disk = parseResourceInfo(system.disk_info);
  const swapPercent =
    swap.total > 0 ? (swap.used / swap.total) * 100 : 0;

  return {
    client: String(system.id),
    time: normalizeTimestamp(system.updated_at),
    cpu: clampPercentage(system.cpu),
    ram: memory.used,
    ram_total: memory.total,
    ram_percent: clampPercentage(system.memory),
    swap: swap.used,
    swap_total: swap.total,
    swap_percent: clampPercentage(swapPercent),
    disk: disk.used,
    disk_total: disk.total,
    disk_percent: clampPercentage(system.disk),
    net_in: Math.max(0, toNumber(system.net_in_mb_s)) * BYTES_PER_MEGABYTE,
    net_out: Math.max(0, toNumber(system.net_out_mb_s)) * BYTES_PER_MEGABYTE,
    net_total_up: Math.max(0, toNumber(system.total_net_out_bytes)),
    net_total_down: Math.max(0, toNumber(system.total_net_in_bytes)),
    online: system.alert !== true,
    uptime: parseUptime(system.time),
    agent_version: normalizeText(system.agent_version, "N/A"),
  };
};

export const pulseUpdateToNodes = (update: PulseUpdate): NodeData[] =>
  (update.systems || [])
    .filter((system) => system && system.id !== undefined && system.id !== null)
    .map(pulseSystemToNode)
    .sort((a, b) => a.weight - b.weight || a.name.localeCompare(b.name));

export const pulseUpdateToStatusMap = (
  update: PulseUpdate
): PulseNodeStatusMap => {
  const statuses: PulseNodeStatusMap = {};
  for (const system of update.systems || []) {
    if (system && system.id !== undefined && system.id !== null) {
      statuses[String(system.id)] = pulseSystemToStatus(system);
    }
  }
  return statuses;
};

export const parsePulseUpdate = (value: string): PulseUpdate | null => {
  try {
    const parsed: unknown = JSON.parse(value);
    if (!parsed || typeof parsed !== "object") return null;
    const update = parsed as PulseUpdate;
    return Array.isArray(update.systems) ? update : null;
  } catch (error) {
    console.error("Failed to parse Pulse SSE update:", error);
    return null;
  }
};

export type PulseConnectionState = "idle" | "connecting" | "open" | "error";

export interface PulseConnectionStatus {
  state: PulseConnectionState;
  error: string | null;
}

type SnapshotListener = (update: PulseUpdate) => void;
type StatusListener = (status: PulseConnectionStatus) => void;

class PulseEventService {
  private eventSource: EventSource | null = null;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private reconnectAttempt = 0;
  private closedByConsumer = false;
  private snapshot: PulseUpdate | null = null;
  private readonly snapshotListeners = new Set<SnapshotListener>();
  private readonly statusListeners = new Set<StatusListener>();
  private status: PulseConnectionStatus = { state: "idle", error: null };

  subscribe(listener: SnapshotListener): () => void {
    this.snapshotListeners.add(listener);
    if (this.snapshot) listener(this.snapshot);
    this.connect();

    return () => {
      this.snapshotListeners.delete(listener);
      if (this.snapshotListeners.size === 0) this.disconnect();
    };
  }

  subscribeStatus(listener: StatusListener): () => void {
    this.statusListeners.add(listener);
    listener(this.status);
    return () => this.statusListeners.delete(listener);
  }

  reconnect(): void {
    if (this.snapshotListeners.size === 0) return;
    this.clearReconnectTimer();
    this.closedByConsumer = true;
    this.eventSource?.close();
    this.eventSource = null;
    this.reconnectAttempt = 0;
    this.closedByConsumer = false;
    this.connect();
  }

  private connect(): void {
    if (this.snapshotListeners.size === 0 || this.eventSource) return;
    if (!PULSE_EVENTS_URL) {
      this.setStatus("error", "VITE_PULSE_EVENTS_URL is not configured");
      return;
    }

    let eventUrl: string;
    try {
      const url = new URL(PULSE_EVENTS_URL, window.location.origin);
      if (PULSE_SHARE_TOKEN && !url.searchParams.has("token")) {
        url.searchParams.set("token", PULSE_SHARE_TOKEN);
      }
      eventUrl = url.toString();
    } catch (error) {
      console.error("Invalid Pulse SSE URL:", error);
      this.setStatus("error", "Invalid VITE_PULSE_EVENTS_URL");
      return;
    }

    this.closedByConsumer = false;
    this.setStatus("connecting", null);
    const source = new EventSource(eventUrl, {
      withCredentials: PULSE_WITH_CREDENTIALS,
    });
    this.eventSource = source;

    source.onopen = () => {
      this.reconnectAttempt = 0;
      this.setStatus("open", null);
    };

    source.addEventListener("update", (event: Event) => {
      const update = parsePulseUpdate((event as MessageEvent<string>).data);
      if (!update) return;
      this.snapshot = update;
      this.setStatus("open", null);
      this.snapshotListeners.forEach((listener) => listener(update));
    });

    source.onerror = () => {
      if (this.eventSource !== source || this.closedByConsumer) return;
      this.setStatus("error", "Pulse SSE connection lost");
      if (source.readyState === EventSource.CLOSED) {
        this.eventSource = null;
        this.scheduleReconnect();
      }
    };
  }

  private scheduleReconnect(): void {
    if (
      this.closedByConsumer ||
      this.snapshotListeners.size === 0 ||
      this.reconnectTimer
    ) {
      return;
    }

    const delay = Math.min(
      PULSE_RECONNECT_DELAY * 2 ** this.reconnectAttempt,
      MAX_RECONNECT_DELAY
    );
    this.reconnectAttempt = Math.min(this.reconnectAttempt + 1, 5);
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connect();
    }, delay);
  }

  private clearReconnectTimer(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  private disconnect(): void {
    this.clearReconnectTimer();
    this.closedByConsumer = true;
    this.eventSource?.close();
    this.eventSource = null;
    this.reconnectAttempt = 0;
    this.setStatus("idle", null);
  }

  private setStatus(state: PulseConnectionState, error: string | null): void {
    this.status = { state, error };
    this.statusListeners.forEach((listener) => listener(this.status));
  }
}

export const pulseEventService = new PulseEventService();
