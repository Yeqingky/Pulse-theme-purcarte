import {
  useState,
  useEffect,
  createContext,
  useContext,
  type ReactNode,
} from "react";
import {
  pulseEventService,
  pulseUpdateToStatusMap,
} from "@/services/pulse";
import type { PulseNodeStatusMap } from "@/types/pulse";

export interface LiveDataContextType {
  liveData: PulseNodeStatusMap | null;
}

const LiveDataContext = createContext<LiveDataContextType | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useLiveData = () => {
  const context = useContext(LiveDataContext);
  if (!context) {
    throw new Error("useLiveData must be used within a LiveDataProvider");
  }
  return context;
};

interface LiveDataProviderProps {
  children: ReactNode;
}

export const LiveDataProvider = ({ children }: LiveDataProviderProps) => {
  const [liveData, setLiveData] = useState<PulseNodeStatusMap | null>(null);

  useEffect(() => {
    return pulseEventService.subscribe((update) => {
      setLiveData(pulseUpdateToStatusMap(update));
    });
  }, []);

  return (
    <LiveDataContext.Provider value={{ liveData }}>
      {children}
    </LiveDataContext.Provider>
  );
};
