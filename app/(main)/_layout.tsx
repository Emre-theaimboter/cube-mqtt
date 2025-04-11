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

import { Tabs } from 'expo-router';
import { Image, ImageStyle, useColorScheme } from 'react-native';
import { LogProvider } from '@/contexts/LogContext';
import { MQTTProvider } from '@/contexts/mqttContext';
import { AlertNotificationRoot } from 'react-native-alert-notification';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <AlertNotificationRoot theme={colorScheme === "light" ? "light" : "dark"}>
      <LogProvider>
        <MQTTProvider>
          <Tabs
            screenOptions={{
              tabBarStyle: {
                backgroundColor: colorScheme === 'light' ? '#ffffff' : '#2B303B',
                height: 55,
                paddingTop: 5,
                borderTopWidth: 1,
                borderColor: colorScheme === 'light' ? '#f9fafb' : '#373c47',
              },
              tabBarHideOnKeyboard: true,
              headerShown: false,
              tabBarActiveTintColor: '#8b5cf6',
              tabBarInactiveTintColor: colorScheme === 'light' ? '#99a1af' : '#ffffff',
              tabBarShowLabel: false,
            }}
          >
            <Tabs.Screen
              name="logs"
              options={{
                title: 'Logs',
                tabBarIcon: ({ color }: { color: string }) => (
                  <Image
                    source={require('@/assets/icons/document.png')}
                    className="size-7"
                    style={{ tintColor: color } as ImageStyle}
                  />
                ),
              }}
            />
            <Tabs.Screen
              name="index"
              options={{
                title: 'MQTT',
                tabBarIcon: ({ color }: { color: string }) => (
                  <Image
                    source={require('@/assets/icons/model.png')}
                    className="size-7"
                    style={{ tintColor: color } as ImageStyle}
                  />
                ),
              }}
            />
            <Tabs.Screen
              name="settings"
              options={{
                title: 'Settings',
                tabBarIcon: ({ color }: { color: string }) => (
                  <Image
                    source={require('@/assets/icons/settings.png')}
                    className="size-7"
                    style={{ tintColor: color } as ImageStyle}
                  />
                ),
              }}
            />
          </Tabs>
        </MQTTProvider>
      </LogProvider>
    </AlertNotificationRoot>
  );
}