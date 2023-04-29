"use client";

import { api } from "@/lib/api/client";
import React, { Fragment } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";
import UserCardSkeleton from "./skeletons/UserCardSkeleton";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { USER_LISTING_PER_PAGE } from "@/constants";
import { useRouter } from "next/navigation";
import usePagination from "@/hooks/usePagination";

interface Props {
  username: string;
  isOpened: boolean;
  setIsOpened: React.Dispatch<React.SetStateAction<boolean>>;
}
const Following = ({ username, isOpened, setIsOpened }: Props) => {
  const router = useRouter();
  const { currentPage, Pagination } = usePagination();

  const { data, isLoading } = api.github.following.useQuery(
    {
      username,
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
        {data && data.length > 0 && (
          <ScrollArea className="max-h-[400px]">
            {data.map((user) => (
              <Fragment key={user.login}>
                <div className="flex flex-row items-center justify-between gap-4 my-2 mx-1">
                  <div className="flex flex-row items-center gap-4 my-2">
                    <Avatar>
                      <AvatarImage src={user.avatar_url} alt={user.login} />
                      <AvatarFallback>
                        {user.login.slice(0, 1).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>{user.login}</div>
                  </div>
                  <Button onClick={() => router.push(`/users/${user.login}`)}>
                    View
                  </Button>
                </div>
              </Fragment>
            ))}
            <Pagination nextPage={data.length >= USER_LISTING_PER_PAGE} />
          </ScrollArea>
        )}
        {data && data.length === 0 && (
          <div className="py-5 text-center">No Following</div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Following;
