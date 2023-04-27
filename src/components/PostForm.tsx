"use client";

import { usePostModalContext } from "@/providers/PostModalProvider";
import { Dialog, DialogContent, DialogHeader } from "./ui/dialog";
import { DialogTitle } from "./ui/dialog";
import RepoCard from "./cards/RepoCard";
import { useToast } from "./ui/use-toast";
import { api } from "@/lib/api/client";
import { useForm } from "react-hook-form";
import { CreatePostInput, createPostSchema } from "@/validationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./ui/button";

const PostForm = () => {
  const { isOpened, handleClose, repo } = usePostModalContext();

  const { toast } = useToast();
  const utils = api.useContext();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreatePostInput>({
    defaultValues: {
      repoShared: repo?.full_name,
      content: "",
    },
    resolver: zodResolver(createPostSchema),
  });

  const { mutate, isLoading: isPosting } = api.post.create.useMutation({
    onSuccess: () => {
      utils.post.invalidate();
      reset();
      handleClose();
      toast({
        title: "Success!",
        description: "Successfully added the post",
      });
    },
    onError: (err) =>
      toast({
        title: "Uh oh..",
        description: err.message,
        variant: "destructive",
      }),
  });

  const onSubmit = (inputs: CreatePostInput) =>
    mutate({
      ...inputs,
      repoShared: repo?.full_name,
    });

  return (
    <Dialog open={isOpened} onOpenChange={handleClose}>
      <DialogContent className="bg-slate-900">
        <DialogHeader>
          <DialogTitle>New Post</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            placeholder="Start writing"
            className="m-2 bg-transparent placeholder:text-muted-foreground border-none outline-none w-full"
            {...register("content", { required: true })}
          />
          {errors.content && (
            <span className="text-sm text-red-400">
              {errors.content.message}
            </span>
          )}
          {repo && <RepoCard repo={repo} hideCounts />}
          <div className="flex justify-end">
            <Button
              type="submit"
              variant="secondary"
              disabled={isPosting}
              className="m-2"
            >
              Post
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PostForm;
