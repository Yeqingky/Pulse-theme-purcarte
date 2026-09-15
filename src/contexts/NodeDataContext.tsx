import {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
  type ReactNode,
} from "react";
import { pulseEventService, pulseUpdateToNodes } from "@/services/pulse";
import type { NodeData } from "@/types/pulse";

function useNodesInternal() {
  const [nodes, setNodes] = useState<NodeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribeSnapshot = pulseEventService.subscribe((update) => {
      setNodes(pulseUpdateToNodes(update));
      setLoading(false);
      setError(null);
    });
    const unsubscribeStatus = pulseEventService.subscribeStatus((status) => {
      if (status.state === "error") {
        setError(status.error || "Pulse SSE 连接失败");
      } else if (status.state === "open") {
        setError(null);
      }
    });

    return () => {
      unsubscribeSnapshot();
      unsubscribeStatus();
    };
  }, []);

  const refreshNodes = useCallback(() => {
    pulseEventService.reconnect();
  }, []);

  const getTags = useCallback(() => {
    return Array.from(new Set(nodes.flatMap((node) => node.tags))).sort(
      (a, b) => a.localeCompare(b)
    );
  }, [nodes]);

  return {
    nodes,
    loading,
    error,
    refreshNodes,
    getTags,
  };
}

export type NodeDataContextType = ReturnType<typeof useNodesInternal>;

const NodeDataContext = createContext<NodeDataContextType | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useNodeData = () => {
  const context = useContext(NodeDataContext);
  if (!context) {
    throw new Error("useNodeData must be used within a NodeDataProvider");
  }
  return context;
};

interface NodeDataProviderProps {
  children: ReactNode;
}

export const NodeDataProvider = ({ children }: NodeDataProviderProps) => {
  const nodeData = useNodesInternal();
  return (
    <NodeDataContext.Provider value={nodeData}>
      {children}
    </NodeDataContext.Provider>
  );
};
