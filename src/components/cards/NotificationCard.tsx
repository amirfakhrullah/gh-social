"use client";

import { RouterOutputs, api } from "@/lib/api/client";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useRouter } from "next/navigation";
import AvatarSkeleton from "../skeletons/AvatarSkeleton";
import { formatTimeAgo } from "@/helpers/formatTimeAgo";
import CardSkeleton from "../skeletons/CardSkeleton";
import RepoCard from "./RepoCard";
import PostCard from "./PostCard";
import CommentCard from "./CommentCard";
import { convertToRepoId } from "@/helpers/repoId";

interface Props {
  notification: RouterOutputs["notification"]["getRecents"][number];
}
const NotificationCard = ({ notification }: Props) => {
  const router = useRouter();

  const { isLoading: isLoadingProfile, data: profile } =
    api.github.otherProfile.useQuery({
      username: notification.originId,
    });

  /**
   * Post action
   */
  const displayPost = !!(
    notification.postAction &&
    notification.postAction !== "comment" &&
    notification.postId
  );
  const { isLoading: isLoadingPost, data: post } = api.post.postById.useQuery(
    {
      id: notification.postId!!,
    },
    {
      enabled: displayPost,
    }
  );
  const displayLoaderPost = displayPost ? isLoadingPost : false;

  /**
   * Comment action
   */
  const displayComment = !!(
    notification.postAction === "comment" && notification.commentId
  );
  const { isLoading: isLoadingComment, data: comment } =
    api.comment.commentById.useQuery(
      {
        id: notification.commentId!,
      },
      {
        enabled: displayComment,
      }
    );
  const displayLoaderComment = displayComment ? isLoadingComment : false;

  /**
   * Repos action
   */
  const displayRepo = !!(
    notification.githubAction &&
    notification.githubAction !== "follow" &&
    notification.repoName
  );
  const { isLoading: isLoadingRepo, data: repoShared } =
    api.github.getARepo.useQuery(
      {
        repoName: notification.repoName!,
      },
      {
        enabled: displayRepo,
      }
    );
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
            link = `/repos/${convertToRepoId(repoName!)}`;
          }
          break;
        case "star":
          link = `/repos/${convertToRepoId(repoName!)}`;
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
    if (githubAction === "follow") action = "started following you";
    if (githubAction === "share")
      action = "shared one of your repository in a post";
    if (githubAction === "star") action = "has starred one of your repository";
    if (postAction === "comment") action = "commented in one of your post";
    if (postAction === "like") action = "liked one of your post";
    return action;
  })();

  return (
    <div className="border-b border-slate-700 p-3">
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
          <div className="flex md:flex-row flex-col md:justify-center gap-2">
            <div
              className="cursor-pointer hover:underline"
              onClick={readProfile}
            >
              <p className="text-gray-300">@{profile.login}</p>
            </div>
            <p
              className="text-slate-500 cursor-pointer"
              onClick={goToReference}
            >
              {notificationInfo}
            </p>
            <span className="text-slate-600 text-sm md:block hidden">
              | {formatTimeAgo(notification.createdAt)}
            </span>
          </div>
        </div>
      )}
      {(displayLoaderRepo || displayLoaderComment || displayLoaderPost) && (
        <CardSkeleton hideCounts />
      )}
      {displayRepo && repoShared && <RepoCard repo={repoShared} hideCounts />}
      {displayRepo && !displayLoaderRepo && !repoShared && (
        <div className="border border-slate-700 m-2 rounded-md shadow-lg md:p-5 p-2 text-center">
          Repository doesn&apos;t exist
        </div>
      )}
      {displayPost && post && <PostCard data={post} isInRepoPage />}
      {displayPost && !displayLoaderPost && !post && (
        <div className="border border-slate-700 m-2 rounded-md shadow-lg md:p-5 p-2 text-center">
          Post doesn&apos;t exist
        </div>
      )}
      {displayComment && comment && <CommentCard comment={comment} />}
      {displayComment && !displayLoaderComment && !comment && (
        <div className="border border-slate-700 m-2 rounded-md shadow-lg md:p-5 p-2 text-center">
          Comment doesn&apos;t exist
        </div>
      )}
      <div className="md:hidden block text-sm ml-2 mb-1 text-gray-500 italic">
        Posted {formatTimeAgo(notification.createdAt)}
      </div>
    </div>
  );
};

export default NotificationCard;
