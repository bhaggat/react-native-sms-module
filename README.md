# react-native-sms-module

A React Native library to interact with SMS messages on Android. This library allows you to:

- Fetch SMS messages from the device inbox with filtering options.
- Listen for incoming SMS messages in real-time.

## Installation

Install the library using npm or yarn:

```bash
npm install react-native-sms-module
```

or

```bash
yarn add react-native-sms-module
```

No linking needed as library is made for new react native versions.

## Permissions

Add the following permissions to your Android `AndroidManifest.xml` file:

```xml
<uses-permission android:name="android.permission.RECEIVE_SMS" />
<uses-permission android:name="android.permission.READ_SMS" />
```

Make sure to request permissions at runtime before using the library methods.

## Usage

### Import the Module

```typescript
import SmsModule from 'react-native-sms-module';
import { NativeEventEmitter } from 'react-native';
```

### Fetch SMS Messages

To fetch SMS messages from the device inbox:

```typescript
const filters = {
  sender: '+911234567890', // Filter by sender (optional)
  keyword: 'Code', // Filter by keyword in body (optional)
  dateFrom: 1633046400000, // Start date in milliseconds (optional)
  dateTo: 1633132800000, // End date in milliseconds (optional)
  readOnly: true, // Fetch only read messages (optional)
  unReadOnly: true, // Fetch only unread messages (optional)
};

SmsModule.getSMSList(0, 10, filters)
  .then((messages) => {
    console.log('Fetched SMS messages:', messages);
  })
  .catch((error) => {
    console.error('Error fetching messages:', error);
  });
```

### Listen for Incoming SMS Messages

To start listening for incoming SMS messages:

```typescript
const eventEmitter = new NativeEventEmitter(SmsModule);

const subscription = eventEmitter.addListener('onSms', (sms) => {
  console.log('New SMS received:', sms);
});

SmsModule.startSmsListener();
```

To stop listening for SMS messages:

```typescript
SmsModule.stopSmsListener();
subscription.remove();
```

### Permissions Handling Example

Use a permission request hook to ensure the library functions as expected:

```typescript
import { useEffect } from 'react';
import usePermissions from './hooks/usePermissions';

const [permissionStatusReadSMS, requestPermissionsReadSMS] = usePermissions(
  'android.permission.READ_SMS'
);
const [permissionStatusReceiveSMS, requestPermissionsReceiveSMS] =
  usePermissions('android.permission.RECEIVE_SMS');

useEffect(() => {
  requestPermissionsReadSMS();
}, []);

useEffect(() => {
  if (permissionStatusReadSMS === true) {
    requestPermissionsReceiveSMS();
  }
}, [permissionStatusReadSMS]);
```

## Example

Below is a complete example of using this library:

```typescript
import { useEffect, useState } from 'react';
import { Text, View, StyleSheet, NativeEventEmitter, FlatList } from 'react-native';
import usePermissions from './hooks/usePermissions';
import SmsModule from 'react-native-sms-module';
import type { SmsData } from 'react-native-sms-module';

export default function App() {
  const [messages, setMessages] = useState<SmsData[]>([]);
  const [permissionStatusReadSMS, requestPermissionsReadSMS] = usePermissions('android.permission.READ_SMS');
  const [permissionStatusReceiveSMS, requestPermissionsReceiveSMS] = usePermissions('android.permission.RECEIVE_SMS');

  useEffect(() => {
    requestPermissionsReadSMS();
  }, []);

  useEffect(() => {
    if (permissionStatusReadSMS) {
      requestPermissionsReceiveSMS();
      SmsModule.getSMSList(0, 10, {})
        .then((msgs) => setMessages(msgs))
        .catch(console.error);
    }
  }, [permissionStatusReadSMS]);

  useEffect(() => {
    let subscription;
    if (permissionStatusReceiveSMS) {
      const eventEmitter = new NativeEventEmitter(SmsModule);
      subscription = eventEmitter.addListener('onSms', (newMessage) => {
        setMessages((prev) => [newMessage, ...prev]);
      });
      SmsModule.startSmsListener();
    }
    return () => {
      SmsModule.stopSmsListener();
      subscription?.remove();
    };
  }, [permissionStatusReceiveSMS]);

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.message}>
            <Text>From: {item.sender}</Text>
            <Text>{item.body}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  message: { marginBottom: 20, padding: 10, borderColor: '#ddd', borderWidth: 1 },
});
```

## API

### Methods

- **`getSMSList(offset: number, limit: number, filters?: object): Promise<Array<SmsData>>`**
  Fetches SMS messages with optional filters.

- **`startSmsListener(): void`**
  Starts listening for incoming SMS messages.

- **`stopSmsListener(): void`**
  Stops listening for incoming SMS messages.

### Events

- **`onSms`**  
  Event emitted when a new SMS is received. Returns an object with the following fields:
  - `id`: Unique identifier for the SMS.
  - `sender`: Sender's phone number.
  - `body`: SMS body content.
  - `timestamp`: Timestamp of the SMS.

## License

MIT
