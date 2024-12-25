import { useState, useEffect } from 'react';
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
      console.log('checking');
      const result: PermissionType = await PermissionsAndroid.check(permission);
      console.log('result', result);
      setStatus(result);
    };

    checkPermissions();
  }, [permission]);

  const requestPermissions = async () => {
    const result: PermissionType =
      (await PermissionsAndroid.request(permission)) === 'granted';
    setStatus(result);
  };

  return [status, requestPermissions] as const;
};

export default usePermissions;
