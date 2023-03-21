import React from "react";

import { LogBoxLog } from "./LogBoxLog";

// Context provider for Array<LogBoxLog>

export const LogContext = React.createContext<{
  selectedLogIndex: number;
  isDisabled: boolean;
  logs: LogBoxLog[];
}>({
  selectedLogIndex: -1,
  isDisabled: false,
  logs: [],
});

export function useLogs() {
  const logs = React.useContext(LogContext);
  if (!logs) {
    throw new Error("useLogs must be used within a LogProvider");
  }
  return logs;
}

export function useSelectedLog() {
  const { selectedLogIndex, logs } = useLogs();
  return logs[selectedLogIndex];
}
