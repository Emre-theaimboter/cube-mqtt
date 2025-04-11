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

// Import the Stack component from expo-router for navigation stack management
import { Stack } from "expo-router";
// Import StatusBar component from expo-status-bar to customize the status bar appearance
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import "@/global.css";

// Define and export the default RootLayout function as the main layout component
export default function RootLayout() {
  const colorScheme = useColorScheme();
  
  return (
    <>
      {/* Stack component manages the navigation stack for the application */}
      <Stack
        options={{ headerShown: false }}
      >
        <Stack.Screen
          name="(main)"
          options={{ headerShown: false }}
        />
      </Stack>
      {/* StatusBar component controls the appearance of the device's status bar */}
      <StatusBar
        backgroundColor={colorScheme === "light" ? "#ffffff" : "#2B303B"}
        style={colorScheme === "light" ? "dark" : "light"}
      />
    </>
  );
}