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
    Modal,
    TouchableOpacity,
    ScrollView,
    Share,
    Image,
    Switch,
    useColorScheme
} from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useLogs } from "@/contexts/LogContext";
import * as Linking from 'expo-linking';
import { useMQTT } from '@/contexts/mqttContext';

const SettingsScreen: React.FC = () => {
    const { clearLogs } = useLogs();
    const colorScheme = useColorScheme();
    const { isNotificationsEnabled, setNotificationStatus } = useMQTT();
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [versionModalVisible, setVersionModalVisible] = useState<boolean>(false);
    const [newVersion, setNewVersion] = useState<string | null>(null);
    const [noUpdateModalVisible, setNoUpdateModalVisible] = useState<boolean>(false);
    const [installedAppVersion] = useState<string>("1.0.0");

    const handleClearLogs = async () => {
        await clearLogs();
        setModalVisible(false);
    };

    const handleVersion = async () => {
        try {
            const response = await fetch('https://mhyar-nsi.github.io/cube-updates/versions.json', {
                method: "GET",
                headers: {
                    'Cache-Control': 'no-cache',
                },
            });
            const data = await response.json();
            if (data.cube_mqtt === installedAppVersion) {
                setNoUpdateModalVisible(true);
            } else {
                setNewVersion(data.cube_mqtt);
                setVersionModalVisible(true);
            }
        } catch (error) {
            // 
        }
    };

    const handleUpdate = () => {
        Linking.openURL('https://github.com/mhyar-nsi/cube-mqtt');
        setVersionModalVisible(false);
    };

    const onShare = async () => {
        try {
            await Share.share({
                message: '🚀 Cube MQTT – Powerful MQTT Broker Management for Real-Time IoT & Messaging 📡🔧\nExplore the docs & code: https://github.com/mhyar-nsi/cube-mqtt'
            });
        } catch (error: unknown) {
            // 
        }
    };

    return (
        <View className="flex-1 pt-6 bg-gray-200 dark:bg-eerie">
            {/* Header */}
            <View className="bg-white dark:bg-gunmetal px-5 pt-4 pb-2.5 flex-row items-center">
                <Image
                    source={require("@/assets/icons/settings.png")}
                    className="size-7"
                    style={{ tintColor: colorScheme === "light" ? "#2B303B" : "#ffffff" }}
                />
                <Text className="text-gunmetal dark:text-white text-2xl font-bold ml-3">Settings</Text>
            </View>
            {/* Scrollable Content */}
            <ScrollView className="flex-1 px-5 py-6">
                {/* Preferences Section */}
                <Text className="text-gray-400 text-sm font-medium mb-2">PREFERENCES</Text>
                <View className="bg-white dark:bg-gunmetal rounded-2xl p-4 mb-6">
                    <View className="flex-row justify-between items-center mb-5">
                        <View className="flex-row items-center">
                            <Ionicons name="notifications-outline" size={22} color={colorScheme === "light" ? "#45556c" : "#D1D5DB"} />
                            <Text className="text-slate-600 dark:text-gray-200 text-lg ml-2">Notifications</Text>
                        </View>
                        <Switch
                            value={isNotificationsEnabled}
                            onValueChange={(newValue) => {
                                setNotificationStatus(newValue);
                            }}
                            trackColor={{ false: "#767577", true: "#c4b5fd" }}
                            thumbColor={isNotificationsEnabled ? "#8b5cf6" : "#f4f3f4"}
                        />
                    </View>
                    <TouchableOpacity className="flex-row justify-between items-center">
                        <View className="flex-row items-center">
                            <Ionicons name="language-outline" size={22} color={colorScheme === "light" ? "#45556c" : "#D1D5DB"} />
                            <Text className="text-slate-600 dark:text-gray-200 text-lg ml-2">Language</Text>
                        </View>
                        <Text className="text-gray-400">English</Text>
                    </TouchableOpacity>
                </View>

                {/* Actions Section */}
                <Text className="text-gray-400 text-sm font-medium mb-2">ACTIONS</Text>
                <View className="bg-white dark:bg-gunmetal rounded-2xl p-4 mb-6">
                    <TouchableOpacity
                        className="flex-row justify-between items-center mb-5"
                        onPress={() => setModalVisible(true)}
                    >
                        <View className="flex-row items-center">
                            <Ionicons name="trash-outline" size={22} color={colorScheme === "light" ? "#45556c" : "#D1D5DB"} />
                            <Text className="text-slate-600 dark:text-gray-200 text-lg ml-2">Clear Logs</Text>
                        </View>
                        <Ionicons name="chevron-forward-outline" size={22} color="#9CA3AF" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onShare} className="flex-row justify-between items-center">
                        <View className="flex-row items-center">
                            <Ionicons name="share-social-outline" size={22} color={colorScheme === "light" ? "#45556c" : "#D1D5DB"} />
                            <Text className="text-slate-600 dark:text-gray-200 text-lg ml-2">Share App</Text>
                        </View>
                        <Ionicons name="chevron-forward-outline" size={22} color="#9CA3AF" />
                    </TouchableOpacity>
                </View>

                {/* About Section */}
                <Text className="text-gray-400 text-sm font-medium mb-2">ABOUT</Text>
                <View className="bg-white dark:bg-gunmetal rounded-2xl p-4">
                    <TouchableOpacity onPress={handleVersion} className="flex-row justify-between items-center mb-5">
                        <View className="flex-row items-center">
                            <Ionicons name="information-circle-outline" size={22} color={colorScheme === "light" ? "#45556c" : "#D1D5DB"} />
                            <Text className="text-slate-600 dark:text-gray-200 text-lg ml-2">App Version</Text>
                        </View>
                        <Text className="text-gray-400">{installedAppVersion}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => Linking.openURL('https://github.com/mhyar-nsi/cube-mqtt')} className="flex-row justify-between items-center">
                        <View className="flex-row items-center">
                            <Ionicons name="logo-github" size={22} color={colorScheme === "light" ? "#45556c" : "#D1D5DB"} />
                            <Text className="text-slate-600 dark:text-gray-200 text-lg ml-2">GitHub Page</Text>
                        </View>
                        <Ionicons name="chevron-forward-outline" size={22} color="#9CA3AF" />
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Confirmation Modal for Clear Logs */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View className="flex-1 justify-end bg-black/60 dark:bg-black/80">
                    <View className="bg-white dark:bg-gunmetal rounded-t-2xl p-6">
                        <View className="flex-row items-center mb-4">
                            <Ionicons name="warning-outline" size={24} color="#FCA5A5" />
                            <Text className="text-slate-600 dark:text-white text-lg font-semibold ml-2">Confirm Action</Text>
                        </View>
                        <Text className="text-gray-500 dark:text-gray-300 mb-6">
                            Are you sure you want to clear all logs? This action cannot be undone.
                        </Text>
                        <View className="flex-row justify-end">
                            <TouchableOpacity
                                className="px-4 py-2 flex-row items-center bg-eerie/75 dark:bg-eerie/50 rounded-lg mr-3"
                                onPress={() => setModalVisible(false)}
                            >
                                <Ionicons name="close-outline" size={20} color="#9CA3AF" />
                                <Text className="text-gray-300 ml-1">Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                className="bg-red-600 px-4 py-2 rounded-lg flex-row items-center"
                                onPress={handleClearLogs}
                            >
                                <Ionicons name="trash-outline" size={20} color="white" />
                                <Text className="text-white font-medium ml-1">Clear</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Confirmation Modal for Update */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={versionModalVisible}
                onRequestClose={() => setVersionModalVisible(false)}
            >
                <View className="flex-1 justify-end bg-black/60 dark:bg-black/80">
                    <View className="bg-white dark:bg-gunmetal rounded-t-2xl p-6">
                        <View className="flex-row items-center mb-4">
                            <Ionicons name="information-circle-outline" size={24} color="#60A5FA" />
                            <Text className="text-slate-600 dark:text-white text-lg font-semibold ml-2">Update Available</Text>
                        </View>
                        <View className="mb-6">
                            <Text className="text-gray-500 dark:text-gray-300">A new version of the app is available.</Text>
                            <Text className="text-gray-500 dark:text-gray-300 mt-2">Current version: {installedAppVersion}</Text>
                            <Text className="text-gray-500 dark:text-gray-300">New version: {newVersion}</Text>
                        </View>
                        <View className="flex-row justify-end">
                            <TouchableOpacity
                                className="px-4 py-2 flex-row items-center bg-eerie/75 dark:bg-eerie/50 rounded-lg mr-3"
                                onPress={() => setVersionModalVisible(false)}
                            >
                                <Ionicons name="close-outline" size={20} color="#9CA3AF" />
                                <Text className="text-gray-300 ml-1">Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                className="bg-blue-600 px-4 py-2 rounded-lg flex-row items-center"
                                onPress={handleUpdate}
                            >
                                <Ionicons name="cloud-download-outline" size={20} color="white" />
                                <Text className="text-white font-medium ml-1">Update</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal
                animationType="fade"
                transparent={true}
                visible={noUpdateModalVisible}
                onRequestClose={() => setNoUpdateModalVisible(false)}
            >
                <View className="flex-1 justify-end bg-black/60 dark:bg-black/80">
                    <View className="bg-white dark:bg-gunmetal rounded-t-2xl p-6">
                        <View className="flex-row items-center mb-4">
                            <Ionicons name="checkmark-circle-outline" size={24} color="#34D399" />
                            <Text className="text-slate-600 dark:text-white  text-lg font-semibold ml-2">No Update Available</Text>
                        </View>
                        <Text className="text-gray-500 dark:text-gray-300 mb-6">
                            You are using the latest version of the app.
                        </Text>
                        <View className="flex-row justify-end">
                            <TouchableOpacity
                                className="bg-green-600 px-4 py-2 rounded-lg flex-row items-center"
                                onPress={() => setNoUpdateModalVisible(false)}
                            >
                                <Ionicons name="checkmark-outline" size={20} color="white" />
                                <Text className="text-white font-medium ml-1">OK</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

export default SettingsScreen;