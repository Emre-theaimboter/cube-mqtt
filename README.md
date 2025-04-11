# Cube MQTT

Cube MQTT is a user-friendly mobile application developed using React Native and Expo. It enables users to connect to MQTT brokers, subscribe to and publish messages on various topics, and view detailed logs of all activities. With additional features like notification management, app update checks, log resetting, and app sharing, this app provides a comprehensive tool for MQTT interactions on mobile devices.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [License](#license)
- [Acknowledgments](#acknowledgments)
- [Download APK](#download-apk)

## Features

- Connect to MQTT brokers using custom server details (host, port, username, password)
- Subscribe to specific MQTT topics to receive messages
- Publish messages to designated MQTT topics
- View real-time logs of connection status, messages sent/received, and errors
- Enable or disable notifications for app events
- Check for the latest app updates
- Reset log history with a single tap
- Share the app with others directly from the settings

## Installation

To set up and run the app locally, ensure you have the following prerequisites:

- Node.js installed
- Expo CLI installed globally (`npm install -g expo-cli`)

Then, follow these steps:

1. Clone the repository:
```git clone https://github.com/mhyar-nsi/cube-mqtt.git```
2. Navigate to the project directory:
```cd cube-mqtt```
3. Install dependencies:
```npm install```
4. Start the Expo development server:
```npx expo start```

5. Open the Expo Go app on your mobile device, scan the QR code displayed in the terminal or browser, and run the app.

Alternatively, you can download the pre-built APK from the [releases page](https://github.com/mhyar-nsi/cube-mqtt/releases) and install it directly on your Android device.

## Usage

The app is designed with three main pages to provide a seamless MQTT experience:

- **Main Page (MQTT Client)**  
Enter your MQTT broker details (e.g., host, port, username, password) to establish a connection. Once connected, subscribe to topics to receive messages or publish messages to specific topics of your choice.

- **Log Page**  
Monitor all events in real-time, including successful connections, disconnections, sent and received messages, and any errors. This detailed log helps you manage and troubleshoot your MQTT interactions effectively.

- **Settings Page**  
Customize your experience by enabling or disabling notifications, checking for app updates, resetting the log history, or sharing the app with others via a share link.

### Example

To test the app with a public MQTT broker, use the following details:

- **Host**: `test.mosquitto.org`
- **Port**: `8080`
- **Topic**: `test/topic`

Enter these details in the Main Page, connect to the broker, subscribe to the topic, and publish a test message to see the app in action. Check the Log Page to verify the events.

Screenshots demonstrating the app’s functionality are available in the [screenshots directory](https://github.com/mhyar-nsi/cube-mqtt/tree/main/screenshots).

## License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/mhyar-nsi/cube-mqtt/blob/main/LICENSE) file for full details.


## Acknowledgments

This project is built with the help of the following amazing open-source tools and libraries:

- [React Native](https://reactnative.dev/) - For building the mobile app
- [Expo](https://expo.dev/) - For simplifying development and deployment
- [@taoqf/react-native-mqtt](https://github.com/taoqf/sp-react-native-mqtt) - For MQTT protocol support
- [NativeWind](https://www.nativewind.dev/) - For styling the application

A special thanks to the open-source community for their continuous inspiration and support.

## Download APK

You can download the latest pre-built APK from the [releases page](https://github.com/mhyar-nsi/cube-mqtt/releases) and install it on your Android device to get started immediately.

