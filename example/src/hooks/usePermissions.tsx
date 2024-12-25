import { useState, useEffect, useCallback } from 'react';
import {
  type Permission,
  PermissionsAndroid,
  type PermissionStatus,
} from 'react-native';

type PermissionType = PermissionStatus | boolean;

const usePermissions = (permission: Permission) => {
  const [status, setStatus] = useState<PermissionType>();

  useEffect(() => {
    const checkPermissions = async () => {
      const result: PermissionType = await PermissionsAndroid.check(permission);
      setStatus(result);
    };

    checkPermissions();
  }, [permission]);

  const requestPermissions = useCallback(async () => {
    const result: PermissionType = await PermissionsAndroid.request(permission);
    setStatus(result === 'granted');
  }, [permission]);

  return [status, requestPermissions] as const;
};

export default usePermissions;
