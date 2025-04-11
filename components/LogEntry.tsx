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

import { memo } from "react";
import { Text, View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Interface for LogEntry
interface LogEntry {
  timestamp: string;
  text: string;
  type: "info" | "success" | "warning" | "error";
}

// Props for LogEntry component
interface LogEntryProps {
  log: LogEntry;
  index: number;
}

// Get style class and fallback color for log type
const getLogStyle = (type: LogEntry["type"]): { className: string; color: string } => {
  switch (type) {
    case "error":
      return { className: "text-red-400", color: "#F87171" };
    case "warning":
      return { className: "text-yellow-400", color: "#FBBF24" };
    case "success":
      return { className: "text-green-400", color: "#34D399" };
    case "info":
    default:
      return { className: "text-blue-400", color: "#60A5FA" };
  }
};

// Get icon for log type
const getLogIcon = (type: LogEntry["type"]): JSX.Element => {
  switch (type) {
    case "error":
      return <Ionicons name="close-circle" size={18} color="#F87171" />;
    case "warning":
      return <Ionicons name="warning" size={18} color="#FBBF24" />;
    case "success":
      return <Ionicons name="checkmark-circle" size={18} color="#34D399" />;
    case "info":
    default:
      return <Ionicons name="information-circle" size={18} color="#60A5FA" />;
  }
};

// LogEntry component to render individual log items with styled type
const LogEntry: React.FC<LogEntryProps> = memo(({ log }) => {
  const { className, color } = getLogStyle(log.type);

  return (
    <View className="bg-white dark:bg-gunmetal violet-600 rounded-lg p-3 mb-2">
      <View className="flex-row items-center mb-1">
        {getLogIcon(log.type)}
        <Text
          className={`font-mono text-sm ${className} ml-2`}
          style={[styles.typeText, { color }]}
        >
          [{log.type.toUpperCase()}]
        </Text>
        <Text className="font-mono text-gray-400 text-sm ml-2">{log.timestamp}</Text>
      </View>
      <Text className="font-mono text-slate-600 dark:text-gray-200 text-sm mt-1 ml-6">{log.text}</Text>
    </View>
  );
});

// Styles for fallback
const styles = StyleSheet.create({
  typeText: {
    fontFamily: "monospace",
    fontSize: 14,
  },
});

LogEntry.displayName = "LogEntry";

export default LogEntry;