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

interface Props {
  comment: RouterOutputs["comment"]["commentsByPostId"][number];
  owner?: TrimmedGitHubProfile;
}
const CommentCard = ({ comment, owner }: Props) => {
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
  const handleDelete = () =>
    user?.username === comment.ownerId && mutate({ id: comment.id });
  const displayLoaderProfile = owner ? isLoadingProfile : false;
  return (
    <div className="border border-slate-700 m-2 rounded-md shadow-md md:p-5 p-2">
      {displayLoaderProfile && <AvatarSkeleton />}
      {(owner || profile) && (
        <div className="flex flex-row items-center gap-2 mb-3">
          <Avatar className="h-8 w-8 cursor-pointer" onClick={readProfile}>
            <AvatarImage
              src={(owner ?? profile)!.avatar_url}
              alt={(owner ?? profile)!.login}
            />
            <AvatarFallback>
              {(owner ?? profile)!.login.slice(0, 1).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="cursor-pointer hover:underline" onClick={readProfile}>
            <p className="text-sm text-slate-200 font-bold">
              {(owner ?? profile)!.name}
            </p>
            <p className="text-sm text-gray-500">
              @{(owner ?? profile)!.login}
            </p>
          </div>
          <div className="md:block hidden text-sm text-gray-500">
            {" "}
            | Commented {formatTimeAgo(comment.createdAt)}
          </div>
        </div>
      )}
      <p className="mb-2 text-slate-200">{comment.content}</p>
      {user?.username === comment.ownerId && (
        <AlertDialog>
          <AlertDialogTrigger className="w-full">
            <div className="text-red-400 text-end text-sm hover:underline cursor-pointer">
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