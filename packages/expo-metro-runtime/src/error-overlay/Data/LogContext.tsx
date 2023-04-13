import React from "react";
import { Platform } from "react-native";

import { LogBoxLog } from "./LogBoxLog";

// Context provider for Array<LogBoxLog>

export const LogContext = React.createContext<{
  selectedLogIndex: number;
  isDisabled: boolean;
  logs: LogBoxLog[];
} | null>(null);

export function useLogs() {
  const logs = React.useContext(LogContext);
  if (!logs) {
    if (Platform.OS === "web" && typeof window !== "undefined") {
      const raw = JSON.parse(
        document.getElementById("_expo-static-error").textContent
      );
      return {
        ...raw,
        logs: raw.logs.map((raw) => {
          const log = new LogBoxLog(raw);
          log.symbolicate("stack");
          return log;
        }),
      };
    }

    throw new Error("useLogs must be used within a LogProvider");
  }
  return logs;
}

export function useSelectedLog() {
  const { selectedLogIndex, logs } = useLogs();
  return logs[selectedLogIndex];
}
