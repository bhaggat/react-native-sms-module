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
        console.log('New SMS startSmsListenerstartSmsListener', newData);
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
        .catch((error) => console.error('Error getting messages', error));
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
  stopListner: {
    color: 'white',
    fontSize: 18,
    marginBottom: 8,
    marginTop: 16,
    backgroundColor: 'red',
    padding: 8,
    borderRadius: 8,
    textAlign: 'center',
  },
});
