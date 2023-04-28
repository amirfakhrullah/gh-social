"use client";

import { NOTIFICATION_LISTING_PER_PAGE } from "@/constants";
import { api } from "@/lib/api/client";
import { useState } from "react";
import CardSkeleton from "../skeletons/CardSkeleton";
import { Button } from "../ui/button";
import NotificationCard from "../cards/NotificationCard";

const NotificationLists = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const { isLoading, data: notifications } =
    api.notification.getRecents.useQuery({
      perPage: NOTIFICATION_LISTING_PER_PAGE,
      page: currentPage,
    });

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
        <div className="py-2 flex flex-row items-center justify-center gap-2">
          {currentPage > 1 && (
            <Button
              variant="secondary"
              onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
            >
              Prev
            </Button>
          )}
          {currentPage > 1 &&
            notifications.length >= NOTIFICATION_LISTING_PER_PAGE && (
              <div>{currentPage}</div>
            )}
          {notifications.length >= NOTIFICATION_LISTING_PER_PAGE && (
            <Button
              variant="secondary"
              onClick={() =>
                notifications.length >= NOTIFICATION_LISTING_PER_PAGE &&
                setCurrentPage(currentPage + 1)
              }
            >
              Next
            </Button>
          )}
        </div>
      )}
    </>
  );
};

export default NotificationLists;
