"use client";

import { NOTIFICATION_LISTING_PER_PAGE } from "@/constants";
import { api } from "@/lib/api/client";
import CardSkeleton from "../skeletons/CardSkeleton";
import NotificationCard from "../cards/NotificationCard";
import usePagination from "@/hooks/usePagination";
import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { getPusherClientSdk } from "@/lib/pusher/client";
import {
  PUSHER_NOTIFICATION_EVENT,
  getPusherNotificationsChannelId,
} from "@/lib/pusher/shared";

const NotificationLists = () => {
  const { user } = useUser();
  const { currentPage, Pagination } = usePagination();

  const {
    isLoading,
    data: notifications,
    refetch,
  } = api.notification.getRecents.useQuery(
    {
      perPage: NOTIFICATION_LISTING_PER_PAGE,
      page: currentPage,
    },
    {
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      refetchOnReconnect: true,
      cacheTime: 0,
      staleTime: 0,
    }
  );

  useEffect(() => {
    if (user?.username) {
      const username = user.username;
      const pusher = getPusherClientSdk();
      const channel = pusher.subscribe(
        getPusherNotificationsChannelId(username)
      );
      channel.bind(PUSHER_NOTIFICATION_EVENT.New, () => refetch());
      return () => {
        pusher.unsubscribe(getPusherNotificationsChannelId(username));
        channel.unbind(PUSHER_NOTIFICATION_EVENT.New);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (isLoading)
    return (
      <>
        {[...Array(10)].map((_, idx) => (
          <CardSkeleton
            key={`cardSkeleton__${idx}`}
            withAvatar
            hideCounts
            border={false}
          />
        ))}
      </>
    );

  return (
    <>
      {notifications && notifications.length === 0 && (
        <div className="pt-20 text-center text-lg font-bold text-slate-500">
          No activity here.
        </div>
      )}
      {notifications &&
        notifications.length > 0 &&
        notifications.map((notification) => (
          <NotificationCard key={notification.id} notification={notification} />
        ))}
      {notifications && (
        <Pagination
          nextPage={notifications.length >= NOTIFICATION_LISTING_PER_PAGE}
        />
      )}
    </>
  );
};

export default NotificationLists;
