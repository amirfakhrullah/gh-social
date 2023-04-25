"use client";

import { api } from "@/lib/api/client";
import { useToast } from "./ui/use-toast";
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";

interface Props {
  username: string;
  setFollowers: React.Dispatch<React.SetStateAction<number>>;
}
const FollowAction = ({ username, setFollowers }: Props) => {
  const { toast } = useToast();
  const utils = api.useContext();

  const { isLoading, data: hasFollowed } =
    api.github.hasFollowedTheUser.useQuery({
      username,
    });

  const { mutate } = api.github.followAction.useMutation({
    onError: (err) =>
      toast({
        title: "Oh uh..",
        description: err.message,
        variant: "destructive",
      }),
    onSuccess: (res) => {
      if (hasFollowed) {
        setFollowers((followers) => followers - 1);
      } else {
        setFollowers((followers) => followers + 1);
      }
      utils.github.hasFollowedTheUser.invalidate();

      toast({
        title: res.success ? "Success!" : "Oh uh..",
        description: res.message,
        variant: res.success ? "default" : "destructive",
      });
    },
  });

  const handleAction = () => {
    const action = hasFollowed ? "unfollow" : "follow";
    mutate({
      action,
      username,
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger
        disabled={isLoading}
        className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2"
      >
        {isLoading ? "Loading" : hasFollowed ? "Unfollow" : "Follow"}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to {hasFollowed ? "unfollow" : "follow"} this
            user?
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleAction}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default FollowAction;
