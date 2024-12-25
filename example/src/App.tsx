import { useEffect, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  NativeEventEmitter,
  FlatList,
} from 'react-native';
import usePermissions from './hooks/usePermissions';
import SmsModule from 'react-native-sms-module';
import type { SmsData } from '../../lib/typescript/commonjs/src/NativeSmsModule';

export default function App() {
  const [result, setResult] = useState<SmsData[]>([]);
  const [permissionStatusReadSMS, requestPermissionsReadSMS] = usePermissions(
    'android.permission.READ_SMS'
  );
  const [permissionStatusReceiveSMS, requestPermissionsReceiveSMS] =
    usePermissions('android.permission.RECEIVE_SMS');

  useEffect(() => {
    requestPermissionsReadSMS();
  }, [requestPermissionsReadSMS]);

  useEffect(() => {
    let subscription: any;
    if (permissionStatusReceiveSMS === true) {
      SmsModule.startSmsListener();
      const eventEmitter = new NativeEventEmitter(SmsModule);
      subscription = eventEmitter.addListener('onSms', (newData) => {
        console.log('New SMS startSmsListenerstartSmsListener', newData);
        setResult((prev) => [newData, ...prev]);
      });
    }
    return () => {
      SmsModule.stopSmsListener();
      subscription?.remove?.();
    };
  }, [permissionStatusReceiveSMS]);

  useEffect(() => {
    if (permissionStatusReadSMS === true) {
      requestPermissionsReceiveSMS();
      const filters = {
        // sender: '+911234567890',
        // keyword: 'Code',
        // dateFrom: new Date().getTime() - 5000000000,
        // dateTo: new Date().getTime(),
        // readOnly: false,
        // unReadOnly: true,
      };

      SmsModule.getSMSList(0, 10, filters)
        .then((messages) => {
          setResult(messages);
        })
        .catch((error) => console.error('Error getting messages', error));
    }
  }, [requestPermissionsReceiveSMS, permissionStatusReadSMS]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Result: {result?.length}</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    color: 'black',
  },
  title: {
    color: 'white',
    fontSize: 24,
    margin: 8,
  },
  smsesContainer: {
    width: '100%',
    flexGrow: 1,
    borderRadius: 8,
  },
  contentContainerStyle: {
    paddingHorizontal: 16,
    paddingBlock: 16,
  },
  smsContainer: {
    marginBottom: 8,
    width: '100%',
    backgroundColor: 'white',
    flex: 1,
    padding: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    gap: 4,
  },
  smsText: {
    fontSize: 16,
  },
  body: {
    fontSize: 14,
  },
  smsDate: {
    fontSize: 12,
    color: 'gray',
  },
});
