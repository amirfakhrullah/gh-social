export enum PUSHER_CHANNEL_BASE {
  Chats = "chats",
  Notifications = "notifications",
}

export enum PUSHER_CHAT_EVENT {
  Add = "add",
}

export enum PUSHER_NOTIFICATION_EVENT {
  New = "new",
}

export const getPusherChatsChannelId = (userId: string) =>
  `${PUSHER_CHANNEL_BASE.Chats}__${userId}`;

export const getPusherNotificationsChannelId = (username: string) =>
  `${PUSHER_CHANNEL_BASE.Notifications}__${username}`;
