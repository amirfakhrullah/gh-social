"use client";

import { api } from "@/lib/api/client";
import React, { Fragment, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";
import UserCardSkeleton from "./skeletons/UserCardSkeleton";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { USER_LISTING_PER_PAGE } from "@/constants";

interface Props {
  isOpened: boolean;
  setIsOpened: React.Dispatch<React.SetStateAction<boolean>>;
}
const Following = ({ isOpened, setIsOpened }: Props) => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading } = api.github.following.useQuery(
    {
      page: currentPage,
      perPage: USER_LISTING_PER_PAGE,
    },
    {
      enabled: isOpened,
    }
  );

  return (
    <Dialog open={isOpened} onOpenChange={() => setIsOpened(!isOpened)} modal>
      <DialogContent className="bg-slate-900">
        <DialogHeader>
          <DialogTitle>Following</DialogTitle>
        </DialogHeader>
        {isLoading &&
          [...Array(5)].map((_, idx) => (
            <UserCardSkeleton key={`skeleton__${idx}`} />
          ))}
        {data?.length && (
          <ScrollArea className="max-h-[400px]">
            {data.map((user) => (
              <Fragment key={user.login}>
                <div className="flex flex-row items-center justify-between gap-4 my-2 mx-1">
                  <div className="flex flex-row items-center gap-4 my-2">
                    <Avatar>
                      <AvatarImage src={user.avatar_url} alt={user.login} />
                      <AvatarFallback>{user.login.slice(0, 1)}</AvatarFallback>
                    </Avatar>
                    <div>{user.login}</div>
                  </div>
                  <Button>View</Button>
                </div>
              </Fragment>
            ))}
            <div className="py-2 flex flex-row items-center justify-center gap-2">
              {currentPage > 1 && (
                <Button
                  variant="secondary"
                  onClick={() =>
                    currentPage !== 1 && setCurrentPage(currentPage - 1)
                  }
                >
                  Prev
                </Button>
              )}
              {data.length >= USER_LISTING_PER_PAGE && (
                <Button
                  variant="secondary"
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Next
                </Button>
              )}
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Following;
