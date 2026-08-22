import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export const DRIVER_ORDER_CHANNEL = 'driver-orders';
export const DRIVER_ORDER_CATEGORY = 'driver-order';
export const REJECT_ORDER_ACTION = 'reject-order';
export const ACCEPT_ORDER_ACTION = 'accept-order';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    priority: Notifications.AndroidNotificationPriority.MAX,
  }),
});

export async function configureDriverNotifications() {
  if (Platform.OS === 'web') return null;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(DRIVER_ORDER_CHANNEL, {
      name: 'New delivery orders',
      description: 'Urgent order offers for available drivers',
      importance: Notifications.AndroidImportance.MAX,
      sound: 'default',
      vibrationPattern: [0, 500, 250, 500, 250, 500],
      enableVibrate: true,
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
    });
  }

  await Notifications.setNotificationCategoryAsync(DRIVER_ORDER_CATEGORY, [
    { identifier: ACCEPT_ORDER_ACTION, buttonTitle: 'Accept', options: { opensAppToForeground: true } },
    { identifier: REJECT_ORDER_ACTION, buttonTitle: 'Reject', options: { isDestructive: true, opensAppToForeground: false } },
  ]);

  const permissions = await Notifications.getPermissionsAsync();
  if (!permissions.granted) {
    const requested = await Notifications.requestPermissionsAsync({ ios: { allowAlert: true, allowBadge: true, allowSound: true } });
    if (!requested.granted) return null;
  }

  return Notifications.getDevicePushTokenAsync();
}

export async function dismissDriverOrderNotification(notificationId: string) {
  await Notifications.dismissNotificationAsync(notificationId);
}
