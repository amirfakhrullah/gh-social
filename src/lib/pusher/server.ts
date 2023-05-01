import { env } from "@/env.mjs";
import Pusher from "pusher";

let pusherServerSdk: Pusher;

export const getPusherServerSdk = () => {
  if (!pusherServerSdk) {
    pusherServerSdk = new Pusher({
      appId: env.PUSHER_ID,
      key: env.NEXT_PUBLIC_PUSHER_KEY,
      secret: env.PUSHER_SECRET,
      cluster: env.NEXT_PUBLIC_PUSHER_CLUSTER,
      useTLS: true,
    });
  }
  return pusherServerSdk;
};
