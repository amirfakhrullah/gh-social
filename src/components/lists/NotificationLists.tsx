"use client";

import { NOTIFICATION_LISTING_PER_PAGE } from "@/constants";
import { api } from "@/lib/api/client";
import CardSkeleton from "../skeletons/CardSkeleton";
import NotificationCard from "../cards/NotificationCard";
import usePagination from "@/hooks/usePagination";

const NotificationLists = () => {
  const { currentPage, Pagination } = usePagination();

  const { isLoading, data: notifications } =
    api.notification.getRecents.useQuery(
      {
        perPage: NOTIFICATION_LISTING_PER_PAGE,
        page: currentPage,
      },
      {
        refetchOnMount: true,
        refetchOnReconnect: true,
        refetchOnWindowFocus: true,
      }
    );

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
