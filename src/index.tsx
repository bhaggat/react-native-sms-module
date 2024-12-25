import { NativeEventEmitter } from 'react-native';
import SmsModule, {
  type GetSMSListFilters,
  type SmsData,
} from './NativeSmsModule';

let eventEmitter: NativeEventEmitter | null = null;
let smsSubscription: any = null;

type Callback = (newData: SmsData) => void;

export const startSmsListener = (callback: Callback) => {
  if (eventEmitter === null) {
    eventEmitter = new NativeEventEmitter(SmsModule);
    smsSubscription = eventEmitter.addListener('onSms', callback);
  }
  SmsModule.startSmsListener();
};

export const stopSmsListener = () => {
  if (smsSubscription) {
    smsSubscription.remove();
    smsSubscription = null;
  }
  if (eventEmitter !== null) {
    eventEmitter.removeAllListeners('onSms');
    eventEmitter = null;
  }
  SmsModule.stopSmsListener();
};

export const getSMSList = async (
  offset?: number,
  limit?: number,
  filters?: GetSMSListFilters
) => {
  try {
    return await SmsModule.getSMSList(offset, limit, filters);
  } catch (error) {
    throw error;
  }
};
export type { GetSMSListFilters, SmsData };
