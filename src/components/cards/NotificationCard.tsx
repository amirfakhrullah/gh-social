"use client";

import { RouterOutputs, api } from "@/lib/api/client";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useRouter } from "next/navigation";
import AvatarSkeleton from "../skeletons/AvatarSkeleton";
import { formatTimeAgo } from "@/helpers/formatTimeAgo";
import CardSkeleton from "../skeletons/CardSkeleton";
import RepoCard from "./RepoCard";

interface Props {
  notification: RouterOutputs["notification"]["getRecents"][number];
}
const NotificationCard = ({ notification }: Props) => {
  const router = useRouter();

  const { isLoading: isLoadingProfile, data: profile } =
    api.github.otherProfile.useQuery({
      username: notification.originId,
    });

  const { isLoading: isLoadingRepo, data: repo } = api.github.getARepo.useQuery(
    {
      repoName: notification.repoName!,
    },
    {
      enabled: !!notification.repoName,
    }
  );

  const displayRepo = !!notification.repoName;
  const displayLoaderRepo = displayRepo ? isLoadingRepo : false;

  const readProfile = () => router.push(`/users/${notification.originId}`);

  const goToReference = () => {
    const { githubAction, repoName, postAction, postId, originId } =
      notification;
    let link = "";
    if (githubAction) {
      switch (githubAction) {
        case "follow":
          link = `/users/${originId}`;
          break;
        case "share":
          if (postId) {
            link = `/posts/${postId}`;
          } else {
            link = `/repos/${repoName?.replace("/", "-")}`;
          }
          break;
        case "star":
          link = `/repos/${repoName}?.replace("/", "-")`;
          break;
        default:
          break;
      }
    } else if (postAction) {
      switch (postAction) {
        case "comment":
          link = `/posts/${postId}#comments`;
          break;
        case "like":
          link = `/posts/${postId}`;
          break;
      }
    }
    router.push(link);
  };

  const notificationInfo = (() => {
    const { githubAction, postAction } = notification;
    let action = "";
    if (githubAction === "follow") action = "Started following you.";
    if (githubAction === "share") action = "Shared one of your repo in a post.";
    if (githubAction === "star") action = "Starred one of your repo.";
    if (postAction === "comment") action = "Commented in one of your post.";
    if (postAction === "like") action = "Liked one of your post.";
    return action;
  })();

  return (
    <div className="rounded-md border border-slate-700 m-2 md:p-5 p-2">
      {isLoadingProfile || !profile ? (
        <AvatarSkeleton />
      ) : (
        <div className="flex flex-row items-center gap-2 mb-3">
          <Avatar className="h-8 w-8 cursor-pointer" onClick={readProfile}>
            <AvatarImage src={profile.avatar_url} alt={profile.login} />
            <AvatarFallback>
              {profile.login.slice(0, 1).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="cursor-pointer hover:underline" onClick={readProfile}>
            <p className="text-sm text-slate-200 font-bold">{profile.name}</p>
            <p className="text-sm text-gray-500">@{profile.login}</p>
          </div>
          <div className="md:block hidden text-sm text-gray-500">
            {" "}
            | {formatTimeAgo(notification.createdAt)}
          </div>
        </div>
      )}
      <p className="mb-2 text-slate-200 cursor-pointer" onClick={goToReference}>
        {notificationInfo}
      </p>
      {displayLoaderRepo && <CardSkeleton hideCounts />}
      {displayRepo && repo && <RepoCard repo={repo} hideCounts />}
      {displayRepo && !displayLoaderRepo && !repo && (
        <div className="border border-slate-700 m-2 rounded-md shadow-lg md:p-5 p-2 text-center">
          Repo doesn&apos;t exist
        </div>
      )}
      <div className="md:hidden block text-sm ml-2 mb-1 text-gray-500 italic">
        Posted {formatTimeAgo(notification.createdAt)}
      </div>
    </div>
  );
};

export default NotificationCard;
