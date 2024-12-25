# React Native SMS Module 🚀

Easily interact with SMS messages on Android using this React Native library, built for the **latest React Native architecture**! With this module, you can:

- ✅ Fetch SMS messages from the device inbox with advanced filtering options.
- ✅ Listen for incoming SMS messages in real time.

## Installation 🔧

Install the library using npm or yarn:

```bash
npm install react-native-sms-module
```

or

```bash
yarn add react-native-sms-module
```

No manual linking is required as this library is designed for modern React Native versions.

---

## Permissions 🚨

Add the following permissions to your Android `AndroidManifest.xml` file:

```xml
<uses-permission android:name="android.permission.RECEIVE_SMS" />
<uses-permission android:name="android.permission.READ_SMS" />
```

### Notes ⚠️

- Request permissions at runtime before using the library's methods.
- Permission usage details:
  - `android.permission.RECEIVE_SMS` → For `startSmsListener()`.
  - `android.permission.READ_SMS` → For `getSMSList()`.

---

## API Reference 📘

### 1. **`startSmsListener(callback)`**

Start listening for incoming SMS messages. The provided callback is triggered when a new SMS is received.

**Usage:**

```typescript
startSmsListener((newData: SmsData) => {
  console.log('New SMS received:', newData);
  // Handle the SMS data here
});
```

---

### 2. **`stopSmsListener()`**

Stop listening for incoming SMS messages.

**Usage:**

```typescript
stopSmsListener();
```

---

### 3. **`getSMSList(offset, limit, filters)`**

Fetch SMS messages from the device inbox with optional filtering by sender, keyword, date range, or status (read/unread).

**Usage:**

```typescript
const filters = {
  sender: '+911234567890', // Filter by sender (optional)
  keyword: 'Code', // Filter by keyword (optional)
  dateFrom: 1633046400000, // Start date in milliseconds(optional)
  dateTo: 1633132800000, // End date in milliseconds(optional)
  readOnly: true, // Fetch only read messages (optional)
  unReadOnly: true, // Fetch only unread messages (optional)
};

getSMSList(0, 10, filters)
  .then((messages) => console.log('Fetched messages:', messages))
  .catch((error) => console.error('Error:', error));
```

---

## Example Usage 📚

Here’s an example of how to use `react-native-sms-module`:

```tsx
import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {
  startSmsListener,
  stopSmsListener,
  getSMSList,
  type SmsData,
  type GetSMSListFilters,
} from 'react-native-sms-module';

const App = () => {
  const [messages, setMessages] = useState<SmsData[]>([]);
  const [isListening, setIsListening] = useState(false);

  const startListening = useCallback(() => {
    setIsListening(true);
    startSmsListener((newData: SmsData) => {
      setMessages((prev) => [newData, ...prev]);
    });
  }, []);

  const stopListening = useCallback(() => {
    stopSmsListener();
    setIsListening(false);
  }, []);

  useEffect(() => {
    const filters: GetSMSListFilters = {
      // sender: '+911234567890',
      // keyword: 'Code',
      // dateFrom: new Date().getTime() - 5000000000,
      // dateTo: new Date().getTime(),
      // readOnly: false,
      // unReadOnly: true,
    };
    getSMSList(0, 10, filters)
      .then((msgs) => setMessages(msgs))
      .catch((error) => console.error(error));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Messages: {messages.length}</Text>
      <TouchableOpacity onPress={isListening ? stopListening : startListening}>
        <Text style={styles.button}>
          {isListening ? 'Stop' : 'Start'} Listener
        </Text>
      </TouchableOpacity>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.message}>
            <Text>
              {item.sender}: {item.body}
            </Text>
            <Text>{new Date(item.timestamp).toLocaleString()}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 18, fontWeight: 'bold' },
  button: { fontSize: 16, color: 'blue', marginVertical: 10 },
  message: { marginBottom: 10 },
});

export default App;
```

---

## Types 📂

### `SmsData`

Structure of an SMS message:

```typescript
export type SmsData = {
  id: string; // Unique message ID
  sender: string; // Sender's phone number
  body: string; // Message text
  timestamp: number; // Timestamp in milliseconds
};
```

### `GetSMSListFilters`

Filters for fetching SMS messages:

```typescript
export type GetSMSListFilters = {
  sender?: string; // Filter by sender
  keyword?: string; // Filter by keyword in the body
  dateFrom?: number; // Start date (timestamp)
  dateTo?: number; // End date (timestamp)
  readOnly?: boolean; // Only read messages
  unReadOnly?: boolean; // Only unread messages
};
```

---

## Contribution 🙌

We welcome contributions!  
To contribute:

1. Fork the repository.
2. Create a new branch and make your changes.
3. Submit a pull request.

---

## License 📜

This project is licensed under the MIT License.
