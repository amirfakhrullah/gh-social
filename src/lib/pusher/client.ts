"use client";

import { env } from "@/env.mjs";
import Pusher from "pusher-js";

let pusherClientSdk: Pusher;

export const getPusherClientSdk = () => {
  if (!pusherClientSdk) {
    pusherClientSdk = new Pusher(env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: env.NEXT_PUBLIC_PUSHER_CLUSTER,
    });
  }
  return pusherClientSdk;
};
