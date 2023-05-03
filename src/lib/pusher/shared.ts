export enum PUSHER_CHANNEL_BASE {
  Notifications = "notifications",
}

export enum PUSHER_NOTIFICATION_EVENT {
  New = "new",
}

export const getPusherNotificationsChannelId = (username: string) =>
  `${PUSHER_CHANNEL_BASE.Notifications}__${username}`;
