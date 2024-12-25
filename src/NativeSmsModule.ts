import { type TurboModule, TurboModuleRegistry } from 'react-native';

export type SmsData = {
  id: string;
  sender: string;
  body: string;
  timestamp: number;
};
interface GetSMSListFilters {
  sender?: string;
  keyword?: string;
  dateFrom?: number;
  dateTo?: number;
  unReadOnly?: boolean;
  readOnly?: boolean;
}

export interface Spec extends TurboModule {
  getSMSList(
    offset?: number,
    limit?: number,
    filters?: GetSMSListFilters
  ): Promise<Array<SmsData>>;
  startSmsListener: () => void;
  stopSmsListener: () => void;
  addListener(eventName: string): void;
  removeListeners(count: number): void;
}

const SmsModule: Spec = TurboModuleRegistry.getEnforcing<Spec>('SmsModule');

export default SmsModule;
