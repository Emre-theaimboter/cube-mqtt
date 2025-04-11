/*
 * Cube MQTT
 * Copyright (C) 2025 Mahyar
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */


import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo } from "react";
import * as FileSystem from "expo-file-system";

/**
 * Shape of a single log entry.
 */
interface LogEntry {
  timestamp: string;
  text: string;
  type: "info" | "success" | "warning" | "error";
}

/**
 * Shape of the Log context value provided to consumers.
 */
interface LogContextValue {
  logs: LogEntry[];
  addLog: (text: string, type?: LogEntry["type"]) => Promise<void>;
  loadLogs: () => Promise<void>;
  clearLogs: () => Promise<void>;
}

/**
 * File path for storing logs in the document directory.
 */
const LOG_FILE_PATH = `${FileSystem.documentDirectory}logs.json`;

const LogContext = createContext<LogContextValue | undefined>(undefined);

/**
 * Props for the LogProvider component.
 */
interface LogProviderProps {
  children: ReactNode;
}

/**
 * Provides logging functionality and context for child components.
 * Manages log storage, retrieval, and clearing using the file system.
 *
 * @param {LogProviderProps} props - Component props including children.
 * @returns {JSX.Element} Context provider wrapping the children.
 */
export const LogProvider: React.FC<LogProviderProps> = ({ children }) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false); // Flag to track if logs are loaded

  /**
   * Formats the current date and time into a standardized timestamp string.
   *
   * @returns {string} A formatted timestamp (e.g., "2025-04-07 14:30:45").
   */
  const getFormattedTimestamp = (): string => {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;
  };

  /**
   * Adds a new log entry to the file system and updates the state.
   *
   * @param {string} text - The log message to record.
   * @param {LogEntry["type"]} [type="info"] - The type of log (info, success, warning, error).
   * @throws {Error} If writing to the file system fails.
   */
  const addLog = useCallback(async (text: string, type: LogEntry["type"] = "info") => {
    if (!text.trim()) return;

    try {
      const newLog: LogEntry = {
        timestamp: getFormattedTimestamp(),
        text,
        type,
      };

      const fileInfo = await FileSystem.getInfoAsync(LOG_FILE_PATH);
      let updatedLogs: LogEntry[];

      if (!fileInfo.exists) {
        updatedLogs = [newLog];
      } else {
        const existingContent = await FileSystem.readAsStringAsync(LOG_FILE_PATH);
        const existingLogs: LogEntry[] = JSON.parse(existingContent);
        updatedLogs = [...existingLogs, newLog];
      }

      await FileSystem.writeAsStringAsync(LOG_FILE_PATH, JSON.stringify(updatedLogs, null, 2));
      setLogs(updatedLogs);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
    }
  }, []); // No dependencies since it uses stable setters

  /**
   * Loads existing logs from the file system into state.
   * Only logs if the file exists to prevent infinite loops.
   *
   * @throws {Error} If reading from the file system fails.
   */
  const loadLogs = useCallback(async () => {
    if (isLoaded) return;

    try {
      const fileInfo = await FileSystem.getInfoAsync(LOG_FILE_PATH);
      if (fileInfo.exists) {
        const content = await FileSystem.readAsStringAsync(LOG_FILE_PATH);
        const loadedLogs: LogEntry[] = JSON.parse(content);
        setLogs(loadedLogs);
      } else {
        setLogs([]);
      }
      setIsLoaded(true);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      setIsLoaded(true);
    }
  }, [isLoaded]); // Depends on isLoaded since it controls the logic

  /**
   * Clears all logs by deleting the log file and resetting state.
   *
   * @throws {Error} If deleting the file fails.
   */
  const clearLogs = useCallback(async () => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(LOG_FILE_PATH);
      if (fileInfo.exists) {
        await FileSystem.deleteAsync(LOG_FILE_PATH);
        setLogs([]);
        setIsLoaded(false);
      } else {
        // 
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
    }
  }, []); // No dependencies since it uses stable setters

  // Memoized context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      logs,
      addLog,
      loadLogs,
      clearLogs,
    }),
    [logs, addLog, loadLogs, clearLogs]
  );

  return <LogContext.Provider value={contextValue}>{children}</LogContext.Provider>;
};

/**
 * Hook to access the Log context. Must be used within a LogProvider.
 *
 * @returns {LogContextValue} The Log context value.
 * @throws {Error} If used outside of a LogProvider.
 */
export const useLogs = (): LogContextValue => {
  const context = useContext(LogContext);
  if (context === undefined) {
    throw new Error("useLogs must be used within a LogProvider");
  }
  return context;
};