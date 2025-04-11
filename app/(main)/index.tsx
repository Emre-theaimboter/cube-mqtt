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
  TextInput,
  Pressable,
  ScrollView,
  Image,
  ActivityIndicator,
  useColorScheme
} from "react-native";
import Checkbox from "expo-checkbox";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useMQTT } from "@/contexts/mqttContext";

const IndexScreen: React.FC = () => {
  const { client, isConnected, connect, disconnect, receivedMessage, setReceivedMessage } = useMQTT();
  const colorScheme = useColorScheme();

  // State for broker settings and messaging
  const [host, setHost] = useState<string>("");
  const [port, setPort] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [publishTopic, setPublishTopic] = useState<string>("");
  const [subscribeTopic, setSubscribeTopic] = useState<string>("");
  const [ssl, setSsl] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [isDisconnecting, setIsDisconnecting] = useState<boolean>(false);
  const [isPublish, setIsPublish] = useState<boolean>(false);
  const [isSubscribing, setIsSubscribing] = useState<boolean>(false);
  const [isUnsubscribing, setIsUnsubscribing] = useState<boolean>(false);
  const [subscribedTopics, setSubscribedTopics] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Validate broker connection fields
  const validateConnection = () => {
    const newErrors: { [key: string]: string } = {};
    if (!host.trim()) newErrors.host = "Host is required";
    if (!port.trim()) newErrors.port = "Port is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate publish fields
  const validatePublish = () => {
    const newErrors: { [key: string]: string } = {};
    if (!publishTopic.trim()) newErrors.publishTopic = "Publish Topic is required";
    if (!message.trim()) newErrors.message = "Message is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle connection to MQTT broker
  const handleConnect = async () => {
    if (isConnected) return;
    if (!validateConnection()) return;
    setIsConnecting(true);
    try {
      await connect({ host, port: parseInt(port), username, password, ssl });
      setErrors({});
    } catch (error) {
      //
    } finally {
      setIsConnecting(false);
    }
  };

  // Handle disconnection from MQTT broker
  const handleDisconnect = async () => {
    setIsDisconnecting(true);
    try {
      await disconnect();
      setReceivedMessage("");
      setPublishTopic("");
      setSubscribeTopic("");
      setSubscribedTopics([]);
      setErrors({});
    } catch (error) {
      //
    } finally {
      setIsDisconnecting(false);
    }
  };

  // Send a message to the specified topic
  const sendMessage = () => {
    if (!client || !isConnected) return;
    if (!validatePublish()) return;
    try {
      setIsPublish(true);
      client.publish(publishTopic, message);
      setMessage("");
      setErrors({});
    } catch (error) {
      //
    } finally {
      setIsPublish(false);
    }
  };

  // Handle subscription to a topic
  const handleSubscribe = () => {
    if (!client || !isConnected || !subscribeTopic || subscribedTopics.includes(subscribeTopic)) return;
    setIsSubscribing(true);
    try {
      client.subscribe(subscribeTopic);
      setSubscribedTopics((prev) => [...prev, subscribeTopic]);
    } catch (error) {
      //
    } finally {
      setIsSubscribing(false);
    }
  };

  // Handle unsubscription from a topic
  const handleUnsubscribe = () => {
    if (!client || !isConnected || !subscribeTopic || !subscribedTopics.includes(subscribeTopic)) return;
    setIsUnsubscribing(true);
    try {
      client.unsubscribe(subscribeTopic);
      setSubscribedTopics((prev) => prev.filter((topic) => topic !== subscribeTopic));
    } catch (error) {
      //
    } finally {
      setIsUnsubscribing(false);
    }
  };

  return (
    <View className="flex-1 pt-6 bg-gray-200 dark:bg-eerie">
      {/* Header */}
      <View className="bg-white dark:bg-gunmetal px-5 pt-4 pb-2.5 flex-row items-center">
        <Image
          source={require("@/assets/icons/model.png")}
          className="size-7"
          style={{ tintColor: colorScheme === "light" ? "#2B303B" : "#ffffff" }}
        />
        <Text className="text-gunmetal dark:text-white text-2xl font-bold ml-3">MQTT Client</Text>
      </View>

      <ScrollView className="flex-1 px-5 pt-0.5 pb-2.5">
        {/* Connection Status */}
        <View className="flex-row items-center justify-center my-3">
          <Ionicons
            name={isConnected ? "checkmark-circle" : "close-circle"}
            size={28}
            color={isConnected ? "#34D399" : "#F87171"}
          />
          <Text
            className={`text-xl font-semibold ml-2 ${
              isConnected ? "text-emerald-400" : "text-rose-400"
            }`}
          >
            {isConnected ? "Connected" : "Disconnected"}
          </Text>
        </View>

        {/* Broker Settings */}
        <View className="bg-white dark:bg-gunmetal rounded-2xl p-5 mb-6 shadow-lg">
          <Text className="text-gunmetal dark:text-white text-xl font-bold mb-4">Broker Settings</Text>
          <View className="space-y-4">
            <View
              className={`flex-row items-center bg-gray-200 dark:bg-gray-700 rounded-lg border ${
                errors.host ? "border-rose-500" : "border-gray-300 dark:border-gray-600"
              } mb-3`}
            >
              <Ionicons name="server-outline" size={20} color="#9CA3AF" className="ml-3" />
              <TextInput
                className="flex-1 text-slate-600 dark:text-white px-3 py-3"
                placeholder="Host"
                placeholderTextColor="#9CA3AF"
                value={host}
                cursorColor="#615fff"
                onChangeText={(text) => {
                  setHost(text);
                  if (errors.host && text.trim()) setErrors((prev) => ({ ...prev, host: "" }));
                }}
              />
            </View>
            {errors.host && <Text className="text-rose-400 text-sm -mt-2 mb-2">{errors.host}</Text>}
            <View
              className={`flex-row items-center bg-gray-200 dark:bg-gray-700 rounded-lg border ${
                errors.port ? "border-rose-500" : "border-gray-300 dark:border-gray-600"
              } mb-3`}
            >
              <Ionicons name="hardware-chip-outline" size={20} color="#9CA3AF" className="ml-3" />
              <TextInput
                className="flex-1 text-slate-600 dark:text-white px-3 py-3"
                placeholder="Port"
                placeholderTextColor="#9CA3AF"
                value={port}
                cursorColor="#615fff"
                onChangeText={(text) => {
                  setPort(text);
                  if (errors.port && text.trim()) setErrors((prev) => ({ ...prev, port: "" }));
                }}
                keyboardType="numeric"
              />
            </View>
            {errors.port && <Text className="text-rose-400 text-sm -mt-2 mb-2">{errors.port}</Text>}
            <View className="flex-row items-center bg-gray-200 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 mb-3">
              <Ionicons name="person-outline" size={20} color="#9CA3AF" className="ml-3" />
              <TextInput
                className="flex-1 text-slate-600 dark:text-white px-3 py-3"
                placeholder="Username"
                placeholderTextColor="#9CA3AF"
                value={username}
                cursorColor="#615fff"
                onChangeText={setUsername}
              />
            </View>
            <View className="flex-row items-center bg-gray-200 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 mb-3">
              <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" className="ml-3" />
              <TextInput
                className="flex-1 text-slate-600 dark:text-white px-3 py-3"
                placeholder="Password"
                placeholderTextColor="#9CA3AF"
                value={password}
                cursorColor="#615fff"
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
            <View className="flex-row items-center justify-between bg-gray-200 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 p-3">
              <View className="flex-row items-center">
                <Ionicons name="shield-checkmark-outline" size={20} color="#9CA3AF" className="mr-2" />
                <Text className="text-slate-500 dark:text-gray-200 text-lg font-medium">SSL</Text>
              </View>
              <Checkbox
                value={ssl}
                onValueChange={setSsl}
                color={ssl ? "#8B5CF6" : "#6B7280"}
                className="rounded-md"
              />
            </View>
          </View>
          <View className="flex-row mt-6 space-x-4">
            <Pressable
              className={`flex-1 bg-emerald-500 py-3 mr-4 rounded-xl justify-center items-center flex-row space-x-2 ${
                isConnected || isConnecting ? "opacity-50" : "active:bg-emerald-600"
              }`}
              onPress={handleConnect}
              disabled={isConnected || isConnecting}
            >
              {isConnecting ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <>
                  <Ionicons name="link-outline" size={20} color="white" />
                  <Text className="text-white font-semibold text-lg ml-2">Connect</Text>
                </>
              )}
            </Pressable>
            <Pressable
              className={`flex-1 bg-rose-500 py-3 rounded-xl justify-center items-center flex-row space-x-2 ${
                !isConnected || isDisconnecting ? "opacity-50" : "active:bg-rose-600"
              }`}
              onPress={handleDisconnect}
              disabled={!isConnected || isDisconnecting}
            >
              {isDisconnecting ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <>
                  <Ionicons name="unlink-outline" size={20} color="white" />
                  <Text className="text-white font-semibold text-lg ml-2">Disconnect</Text>
                </>
              )}
            </Pressable>
          </View>
        </View>

        {/* Publish Section */}
        <View className="bg-white dark:bg-gunmetal rounded-2xl p-5 mb-6 shadow-lg">
          <Text className="text-gunmetal dark:text-white text-xl font-bold mb-4">Publish Message</Text>
          <View
            className={`flex-row items-center bg-gray-200 dark:bg-gray-700 rounded-lg border ${
              errors.publishTopic ? "border-rose-500" : "border-gray-300 dark:border-gray-600"
            } mb-4`}
          >
            <Ionicons name="megaphone-outline" size={20} color="#9CA3AF" className="ml-3" />
            <TextInput
              className="flex-1 text-slate-600 dark:text-white px-3 py-3"
              placeholder="Publish Topic"
              placeholderTextColor="#9CA3AF"
              value={publishTopic}
              cursorColor="#615fff"
              onChangeText={(text) => {
                setPublishTopic(text);
                if (errors.publishTopic && text.trim()) setErrors((prev) => ({ ...prev, publishTopic: "" }));
              }}
              editable={isConnected}
            />
          </View>
          {errors.publishTopic && (
            <Text className="text-rose-400 text-sm -mt-2 mb-2">{errors.publishTopic}</Text>
          )}
          <View
            className={`flex-row items-center bg-gray-200 dark:bg-gray-700 rounded-lg border ${
              errors.message ? "border-rose-500" : "border-gray-300 dark:border-gray-600"
            }`}
          >
            <Ionicons name="chatbubble-outline" size={20} color="#9CA3AF" className="ml-3" />
            <TextInput
              className="flex-1 text-slate-600 dark:text-white px-3 py-3"
              placeholder="Enter your message"
              placeholderTextColor="#9CA3AF"
              value={message}
              cursorColor="#615fff"
              onChangeText={(text) => {
                setMessage(text);
                if (errors.message && text.trim()) setErrors((prev) => ({ ...prev, message: "" }));
              }}
              editable={isConnected}
            />
          </View>
          {errors.message && <Text className="text-rose-400 text-sm mt-1">{errors.message}</Text>}
          <Pressable
            className={`bg-blue-600 py-3 rounded-xl justify-center items-center mt-4 flex-row space-x-2 ${
              !isConnected ? "opacity-50" : "active:bg-blue-700"
            }`}
            onPress={sendMessage}
            disabled={!isConnected}
          >
            {isPublish ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <>
                <Text className="text-white font-semibold text-lg mr-2">Publish</Text>
                <Ionicons name="send" size={20} color="white" />
              </>
            )}
          </Pressable>
        </View>

        {/* Subscribe Section */}
        <View className="bg-white dark:bg-gunmetal rounded-2xl p-5 mb-6 shadow-lg">
          <Text className="text-gunmetal dark:text-white text-xl font-bold mb-4">Subscribe to Topic</Text>
          <View className="flex-row items-center bg-gray-200 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 mb-4">
            <Ionicons name="ear-outline" size={20} color="#9CA3AF" className="ml-3" />
            <TextInput
              className="flex-1 text-slate-600 dark:text-white px-3 py-3"
              placeholder="Subscribe Topic"
              placeholderTextColor="#9CA3AF"
              value={subscribeTopic}
              cursorColor="#615fff"
              onChangeText={setSubscribeTopic}
              editable={isConnected}
            />
          </View>
          <View className="flex-row space-x-4">
            <Pressable
              className={`flex-1 bg-teal-600 py-3 rounded-xl justify-center items-center flex-row space-x-2 ${
                !isConnected || !subscribeTopic || isSubscribing || subscribedTopics.includes(subscribeTopic)
                  ? "opacity-50"
                  : "active:bg-teal-700"
              }`}
              onPress={handleSubscribe}
              disabled={!isConnected || !subscribeTopic || isSubscribing || subscribedTopics.includes(subscribeTopic)}
            >
              {isSubscribing ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <>
                  <Ionicons name="add-circle-outline" size={20} color="white" />
                  <Text className="text-white font-semibold text-lg ml-2">Subscribe</Text>
                </>
              )}
            </Pressable>
            <Pressable
              className={`flex-1 bg-orange-600 py-3 ml-4 rounded-xl justify-center items-center flex-row space-x-2 ${
                !isConnected || !subscribeTopic || isUnsubscribing || !subscribedTopics.includes(subscribeTopic)
                  ? "opacity-50"
                  : "active:bg-orange-700"
              }`}
              onPress={handleUnsubscribe}
              disabled={!isConnected || !subscribeTopic || isUnsubscribing || !subscribedTopics.includes(subscribeTopic)}
            >
              {isUnsubscribing ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <>
                  <Ionicons name="remove-circle-outline" size={20} color="white" />
                  <Text className="text-white font-semibold text-lg ml-2">Unsubscribe</Text>
                </>
              )}
            </Pressable>
          </View>
          {/* Display subscribed topics */}
          {subscribedTopics.length > 0 && (
            <View className="mt-4">
              <Text className="text-gray-400 text-sm mb-2">Subscribed Topics:</Text>
              {subscribedTopics.map((topic) => (
                <Text key={topic} className="text-slate-600 dark:text-gray-200 text-base">
                  • {topic}
                </Text>
              ))}
            </View>
          )}
        </View>

        {/* Received Messages */}
        <View className="bg-white dark:bg-gunmetal rounded-2xl p-5 mb-12 shadow-lg">
          <Text className="text-gunmetal dark:text-white text-xl font-bold mb-4">Received Messages</Text>
          <View className="bg-gray-200 dark:bg-eerie p-4 rounded-lg min-h-[120px]">
            <Text className="text-slate-600 dark:text-gray-300 text-base">
              {receivedMessage || "No messages yet"}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

export default IndexScreen;