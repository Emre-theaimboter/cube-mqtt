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

import { 
  Text, 
  View, 
  FlatList, 
  FlatListProps, 
  Image, 
  useColorScheme 
} from "react-native";
import { useEffect } from "react";
import { useLogs } from "@/contexts/LogContext";
import { Ionicons } from "@expo/vector-icons";
import LogEntryComponent from "@/components/LogEntry";

// Interface for LogEntry
interface LogEntry {
  timestamp: string;
  text: string;
  type: "info" | "success" | "warning" | "error";
}

const LogScreen: React.FC = () => {
  const { logs, loadLogs } = useLogs();
  const colorScheme = useColorScheme();

  // Load logs on component mount
  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  // Key extractor for FlatList
  const keyExtractor = (_item: LogEntry, index: number): string => index.toString();

  // Render item for FlatList
  const renderItem: FlatListProps<LogEntry>["renderItem"] = ({ item, index }) => (
    <LogEntryComponent log={item} index={index} />
  );

  return (
    <View className="flex-1 pt-6 bg-gray-200 dark:bg-eerie">
      {/* Header */}
      <View className="bg-white dark:bg-gunmetal px-5 pt-4 pb-2.5 flex-row items-center">
        <Image
          source={require("@/assets/icons/document.png")}
          className="size-7"
          style={{ tintColor: colorScheme === "light" ? "#2B303B" : "#ffffff" }}
        />
        <Text className="text-gunmetal dark:text-white text-2xl font-bold ml-3">Logs</Text>
      </View>
      <View className="flex-1 px-4 mt-3">
        {logs.length > 0 ? (
          <FlatList
            data={logs}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            initialNumToRender={10}
            windowSize={21}
            removeClippedSubviews={true}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        ) : (
          <View className="flex-1 justify-center items-center">
            <Ionicons name="document-text-outline" size={48} color="#6B7280" />
            <Text className="text-gray-400 text-lg mt-4">No logs available yet</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default LogScreen;