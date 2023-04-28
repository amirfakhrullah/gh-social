"use client";

import { RouterOutputs, api } from "@/lib/api/client";
import { TrimmedGitHubProfile } from "@/types/github";
import { useToast } from "../ui/use-toast";
import AvatarSkeleton from "../skeletons/AvatarSkeleton";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useRouter } from "next/navigation";
import { formatTimeAgo } from "@/helpers/formatTimeAgo";
import { useUser } from "@clerk/nextjs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { cn } from "@/lib/utils";
import { MdOutlineDelete } from "react-icons/md";

interface Props {
  comment: RouterOutputs["comment"]["commentsByPostId"][number];
  owner?: TrimmedGitHubProfile;
  navigateToPost?: boolean;
}
const CommentCard = ({ comment, owner, navigateToPost = true }: Props) => {
  const { toast } = useToast();
  const { user } = useUser();
  const router = useRouter();
  const utils = api.useContext();

  const { isLoading: isLoadingProfile, data: profile } =
    api.github.otherProfile.useQuery(
      {
        username: comment.ownerId,
      },
      {
        enabled: !owner,
      }
    );

  const { mutate } = api.comment.deleteById.useMutation({
    onSuccess: () => {
      utils.comment.invalidate();
      utils.post.invalidate();
      toast({
        title: "Success!",
        description: "Successfully deleted the comment",
      });
    },
    onError: (err) => {
      toast({
        title: "Oh uh..",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  const readProfile = () => router.push(`/users/${comment.ownerId}`);
  const readPost = () =>
    navigateToPost && router.push(`/posts/${comment.postId}`);
  const handleDelete = () =>
    user?.username === comment.ownerId && mutate({ id: comment.id });
  const displayLoaderProfile = !owner ? isLoadingProfile : false;
  const commentOwner = owner ?? profile;

  return (
    <div className="border border-slate-700 m-2 rounded-md shadow-md md:p-5 p-2">
      {displayLoaderProfile && <AvatarSkeleton />}
      {commentOwner && (
        <div className="flex flex-row items-center gap-2 mb-3">
          <Avatar className="h-8 w-8 cursor-pointer" onClick={readProfile}>
            <AvatarImage
              src={commentOwner.avatar_url}
              alt={commentOwner.login}
            />
            <AvatarFallback>
              {commentOwner.login.slice(0, 1).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="cursor-pointer hover:underline" onClick={readProfile}>
            <p className="text-sm text-slate-200 font-bold">
              {commentOwner.name}
            </p>
            <p className="text-sm text-gray-500">@{commentOwner.login}</p>
          </div>
          <div className="md:block hidden text-sm text-gray-500">
            {" "}
            | Replied {formatTimeAgo(comment.createdAt)}
          </div>
        </div>
      )}
      <p
        className={cn(
          "mb-2 text-slate-200",
          navigateToPost && "cursor-pointer"
        )}
        onClick={readPost}
      >
        {comment.content}
      </p>
      {user?.username === comment.ownerId && (
        <AlertDialog>
          <AlertDialogTrigger className="w-full flex justify-end">
            <div className="cursor-pointer text-sm flex flex-row items-center gap-1">
              <MdOutlineDelete />
              <p>Delete</p>
            </div>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure you want to delete this comment?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

export default CommentCard;
