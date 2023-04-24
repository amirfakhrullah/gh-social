"use client";

import { api } from "@/lib/api/client";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import React from "react";

interface Props {
  username: string;
  setFollowers: React.Dispatch<React.SetStateAction<number>>;
}
const FollowButton = ({ username, setFollowers }: Props) => {
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
    <Button variant="secondary" disabled={isLoading} onClick={handleAction}>
      {isLoading ? "Loading" : hasFollowed ? "Unfollow" : "Follow"}
    </Button>
  );
};

export default FollowButton;
