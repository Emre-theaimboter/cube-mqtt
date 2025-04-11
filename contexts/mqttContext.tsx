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


import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import MQTT from '@taoqf/react-native-mqtt';
import { useLogs } from "@/contexts/LogContext";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the structure for MQTT broker configuration
interface BrokerConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  ssl?: boolean;
}

// Define props for MQTTProvider component
interface MQTTProviderProps {
  children: ReactNode;
  brokerConfig?: BrokerConfig;
}

// Define the shape of the MQTT context value
interface MQTTContextValue {
  client: any | null;
  isConnected: boolean;
  connect: (config: BrokerConfig) => Promise<void>;
  disconnect: () => Promise<void>;
  receivedMessage: string;
  setReceivedMessage: any,
  isNotificationsEnabled: boolean;
  setNotificationStatus: (status: boolean) => Promise<void>;
}

// Create the MQTT context
const MQTTContext = createContext<MQTTContextValue | undefined>(undefined);

// MQTTProvider component to manage MQTT connection
export const MQTTProvider: React.FC<MQTTProviderProps> = ({ children }) => {
  const [client, setClient] = useState<any | null>(null); // MQTT client instance
  const [isConnected, setIsConnected] = useState<boolean>(false); // Connection status
  const [receivedMessage, setReceivedMessage] = useState<string>(""); // Latest received message
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState<boolean>(true); // Notification toggle
  const { addLog } = useLogs(); // Logging utility from LogContext

  // Function to display toast notifications
  const showToast = (title: string, message: string, type: any) => {
    Toast.show({
      type,
      title,
      textBody: message,
      autoClose: 4000,
    });
  };

  // Setup notifications and load initial settings
  useEffect(() => {
    // Configure notification handler
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });

    // Request notification permissions
    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        // Handle permission denial if needed
      }
    };
    requestPermissions();

    // Load notification status from storage
    const loadNotificationStatus = async () => {
      try {
        const storedStatus = await AsyncStorage.getItem('notificationStatus');
        if (storedStatus !== null) {
          setIsNotificationsEnabled(JSON.parse(storedStatus));
        }
      } catch (error) {
        // Silent error handling
      }
    };
    loadNotificationStatus();

    // Cleanup on unmount
    return () => {
      if (client?.connected) {
        disconnect();
      }
    };
  }, [client]);

  // Save notification status to storage
  const setNotificationStatus = async (status: boolean) => {
    setIsNotificationsEnabled(status);
    try {
      await AsyncStorage.setItem('notificationStatus', JSON.stringify(status));
    } catch (error) {
      // Silent error handling
    }
  };

  // Connect to MQTT broker
  const connect = async (config: BrokerConfig) => {
    let mqttClient: any = null;
    try {
      if (client?.connected) {
        await disconnect(); // Disconnect if already connected
      }

      const clientId = `cube_client_${Math.random().toString(16).slice(2, 10)}`; // Generate unique client ID
      const protocol = config.ssl ? 'wss' : 'ws'; // Choose protocol based on SSL
      const url = `${protocol}://${config.host}:${config.port}/mqtt`; // Construct connection URL

      mqttClient = MQTT.connect(url, {
        clientId,
        username: config.username,
        password: config.password,
      });

      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          if (!mqttClient.connected) {
            mqttClient.end();
            reject(new Error("Connection timed out after 15 seconds"));
          }
        }, 15000);

        mqttClient.on('connect', () => {
          clearTimeout(timeout);
          setIsConnected(true);
          setClient(mqttClient);
          addLog("Successfully connected to MQTT broker", "success");
          showToast("Connection Established", "You are now connected to the MQTT broker.", ALERT_TYPE.SUCCESS);
          resolve();
        });

        mqttClient.on('error', (err: Error) => {
          clearTimeout(timeout);
          const errorMsg = err.message || "An unexpected error occurred";
          let userMessage = "Unable to connect to the MQTT broker.";
          if (errorMsg.includes("Bad username or password")) {
            userMessage = "Incorrect username or password. Please check your credentials.";
          } else if (errorMsg.includes("timeout")) {
            userMessage = "Connection timed out. Check your network or broker settings.";
          }
          showToast("Connection Failed", userMessage, ALERT_TYPE.DANGER);
          mqttClient.end();
          setClient(null);
          setIsConnected(false);
          reject(err);
        });

        mqttClient.on('close', () => {
          if (isConnected) {
            setIsConnected(false);
            addLog("MQTT connection lost", "error");
          }
        });

        mqttClient.on('message', (topic: string, message: string) => {
          try {
            const payloadString = message.toString();
            setReceivedMessage(payloadString);
            addLog(`Received message on ${topic}: ${payloadString}`, "info");
            if (isNotificationsEnabled) {
              Notifications.scheduleNotificationAsync({
                content: {
                  title: "New MQTT Message",
                  body: payloadString,
                },
                trigger: null,
              });
            }
          } catch (error) {
            const errorMsg = error instanceof Error ? error.message : "Unknown error";
            addLog(`Failed to process message: ${errorMsg}`, "error");
          }
        });
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "An unexpected error occurred";
      addLog(`${errorMsg}`, "error");
      showToast("Connection Error", errorMsg, ALERT_TYPE.DANGER);
      if (mqttClient) {
        mqttClient.end();
      }
      setClient(null);
      setIsConnected(false);
      throw error;
    }
  };

  // Disconnect from MQTT broker
  const disconnect = async () => {
    try {
      if (client?.connected) {
        client.end();
        setIsConnected(false);
        setClient(null);
        addLog("Disconnected from MQTT broker", "warning");
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "An unexpected error occurred";
      addLog(`Failed to disconnect: ${errorMsg}`, "error");
      showToast("Disconnection Error", "An issue occurred while disconnecting.", ALERT_TYPE.DANGER);
    }
  };

  // Context value to provide to consumers
  const contextValue: MQTTContextValue = {
    client,
    isConnected,
    connect,
    disconnect,
    receivedMessage,
    setReceivedMessage,
    isNotificationsEnabled,
    setNotificationStatus,
  };

  return <MQTTContext.Provider value={contextValue}>{children}</MQTTContext.Provider>;
};

// Hook to use MQTT context
export const useMQTT = (): MQTTContextValue => {
  const context = useContext(MQTTContext);
  if (context === undefined) {
    throw new Error("useMQTT must be used within an MQTTProvider");
  }
  return context;
};