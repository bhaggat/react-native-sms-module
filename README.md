# React Native SMS Module

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

### Notes:

- Make sure to request permissions at runtime before using the library methods.

```xml
android.permission.RECEIVE_SMS: For `startSmsListener` method
android.permission.READ_SMS: for `getSMSList` method
```

## API

### `startSmsListener()`

This method starts listening for incoming SMS messages. It triggers the provided callback as soon as the user receives a new message.

**Usage:**

```typescript
startSmsListener((newData: SmsData) => {
  console.log('New SMS received', newData);
  // Do something with the new SMS data
});
```

### `stopSmsListener()`

This method stops the SMS listener and unsubscribes from receiving new SMS events.

**Usage:**

```typescript
stopSmsListener();
```

### Fetch SMS Messages

To fetch SMS messages from the device inbox,You can filter messages by sender, keyword, date range, or message status (read/unread):

**Usage:**

```typescript
const filters = {
  sender: '+911234567890', // Filter by sender (optional)
  keyword: 'Code', // Filter by keyword in body (optional)
  dateFrom: 1633046400000, // Start date in milliseconds (optional)
  dateTo: 1633132800000, // End date in milliseconds (optional)
  readOnly: true, // Fetch only read messages (optional)
  unReadOnly: true, // Fetch only unread messages (optional)
};

getSMSList(0, 10, filters)
  .then((messages) => {
    console.log('Fetched SMS messages:', messages);
  })
  .catch((error) => {
    console.error('Error fetching messages:', error);
  });
```

## Example Usage

Here’s an example of how to use the updated `react-native-sms-module`:

```tsx
import { useCallback, useEffect, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import usePermissions from './hooks/usePermissions';
import {
  startSmsListener,
  stopSmsListener,
  getSMSList,
  type SmsData,
  type GetSMSListFilters,
} from 'react-native-sms-module';

export default function App() {
  const [result, setResult] = useState<SmsData[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [permissionStatusReadSMS, requestPermissionsReadSMS] = usePermissions(
    'android.permission.READ_SMS'
  );
  const [permissionStatusReceiveSMS, requestPermissionsReceiveSMS] =
    usePermissions('android.permission.RECEIVE_SMS');

  useEffect(() => {
    requestPermissionsReadSMS();
  }, [requestPermissionsReadSMS]);

  const startListerning = useCallback(() => {
    if (permissionStatusReceiveSMS === true) {
      setIsListening(true);
      startSmsListener((newData: SmsData) => {
        console.log('New SMS received', newData);
        setResult((prev) => [newData, ...prev]);
      });
    }
  }, [permissionStatusReceiveSMS]);

  const stopListerning = useCallback(() => {
    stopSmsListener();
  }, []);

  useEffect(() => {
    if (permissionStatusReadSMS === true) {
      requestPermissionsReceiveSMS();
      const filters: GetSMSListFilters = {
        // sender: '+911234567890',
        // keyword: 'Code',
        // dateFrom: new Date().getTime() - 5000000000,
        // dateTo: new Date().getTime(),
        // readOnly: false,
        // unReadOnly: true,
      };

      getSMSList(0, 10, filters)
        .then((messages: SmsData[]) => {
          setResult(messages);
        })
        .catch((error: any) => console.error('Error getting messages', error));
    }
  }, [requestPermissionsReceiveSMS, permissionStatusReadSMS]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Result: {result?.length}</Text>
      <TouchableOpacity
        onPress={isListening ? stopListerning : startListerning}
      >
        <Text style={styles.stopListner}>
          {isListening ? 'Stop' : 'Start'} Listen
        </Text>
      </TouchableOpacity>
      <FlatList
        data={result}
        style={styles.smsesContainer}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.contentContainerStyle}
        renderItem={({ item }) => {
          return (
            <View style={styles.smsContainer}>
              <Text style={styles.smsText}>{item.sender}</Text>
              <Text style={styles.body}>{item.body}</Text>
              <Text style={styles.smsDate}>
                {new Date(+item.timestamp).toLocaleString()}
              </Text>
            </View>
          );
        }}
      />
    </View>
  );
}
```

## Types

### `SmsData`

Represents a single SMS message.

```ts
export type SmsData = {
  id: string; // Unique ID for the SMS message
  sender: string; // Sender's phone number
  body: string; // Message content
  timestamp: number; // Timestamp of the message
};
```

### `GetSMSListFilters`

Represents the filters that can be applied when fetching SMS messages.

```ts
export type GetSMSListFilters = {
  sender?: string; // Filter by sender's phone number
  keyword?: string; // Filter by keyword in the message body
  dateFrom?: number; // Filter messages received from this date (timestamp)
  dateTo?: number; // Filter messages received until this date (timestamp)
  unReadOnly?: boolean; // Filter unread messages only
  readOnly?: boolean; // Filter read messages only
};
```

## License

MIT
