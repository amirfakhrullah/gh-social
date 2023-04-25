"use client";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { TrimmedGitHubProfile } from "@/types/github";
import Link from "next/link";
import { Separator } from "./ui/separator";
import { AiOutlineLink } from "react-icons/ai";
import Followers from "./Followers";
import { useState } from "react";
import Following from "./Following";
import FollowAction from "./FollowAction";
import { useToast } from "./ui/use-toast";

interface Props {
  profile: TrimmedGitHubProfile;
  self?: boolean;
}
const Profile = ({ profile, self = false }: Props) => {
  const { toast } = useToast();

  // had to do this because `.invalidate()` doesn't work for cached data from server-side trpc
  const [followers, setFollowers] = useState(profile.followers ?? 0);

  const [isFollowersModalOpened, setIsFollowersModalOpened] = useState(false);
  const [isFollowingModalOpened, setIsFollowingModalOpened] = useState(false);

  const handleOpen = (type: "following" | "followers") => {
    if (!self && profile.type !== "User") {
      return toast({
        title: "Not Allowed",
        description: "This profile restrists third-party access",
      });
    }

    if (type === "followers") {
      return setIsFollowersModalOpened(true);
    } else {
      return setIsFollowingModalOpened(true);
    }
  };

  return (
    <>
      <div className="border-b border-slate-700">
        <div className="w-full md:h-48 h-20 bg-gradient-to-l from-slate-900 to-indigo-950" />
        <div className="md:p-5 p-2 md:mt-[-50px] mt-[-30px] flex md:flex-row md:justify-between flex-col">
          <div>
            <Avatar className="md:h-32 md:w-32 h-14 w-14 border border-slate-950 mb-5">
              <AvatarImage src={profile.avatar_url} alt={profile.login} />
              <AvatarFallback className="text-gray-800 text-xl">
                {profile.login.slice(0, 1).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <p className="text-lg text-slate-200 font-bold">{profile.name}</p>
            <p className="text-sm text-gray-500 mb-5">@{profile.login}</p>
            <p className="mb-2">{profile.bio}</p>

            {profile.blog && (
              <Link href={`https://${profile.blog}`} target="_blank">
                <div className="text-blue-400 text-sm hover:underline cursor-pointer flex flex-row items-center gap-1">
                  <AiOutlineLink />
                  {profile.blog}
                </div>
              </Link>
            )}
          </div>
          <div>
            <div className="md:mt-[50px] mt-[30px] flex h-5 items-center space-x-4 text-sm">
              <p
                className="cursor-pointer"
                onClick={() => handleOpen("followers")}
              >
                {followers} Followers
              </p>
              <Separator orientation="vertical" />
              <p
                className="cursor-pointer"
                onClick={() => handleOpen("following")}
              >
                {profile.following ?? 0} Following
              </p>
            </div>
            {!self && (
              <div className="w-full flex flex-row md:justify-end my-4">
                <FollowAction
                  username={profile.login}
                  setFollowers={setFollowers}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <Followers
        username={profile.login}
        isOpened={isFollowersModalOpened}
        setIsOpened={setIsFollowersModalOpened}
      />
      <Following
        username={profile.login}
        isOpened={isFollowingModalOpened}
        setIsOpened={setIsFollowingModalOpened}
      />
    </>
  );
};

export default Profile;
