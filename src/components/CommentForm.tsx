"use client";

import { api } from "@/lib/api/client";
import { useToast } from "./ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateCommentInput, createCommentSchema } from "@/validationSchemas";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface Props {
  postId: string;
}
const CommentForm = ({ postId }: Props) => {
  const { toast } = useToast();
  const utils = api.useContext();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateCommentInput>({
    defaultValues: {
      content: "",
      postId,
    },
    resolver: zodResolver(createCommentSchema),
  });

  const { mutate, isLoading } = api.comment.create.useMutation({
    onSuccess: () => {
      utils.comment.invalidate();
      utils.post.invalidate();
      toast({
        title: "Success!",
        description: "Comment added",
      });
    },
    onError: (err) =>
      toast({
        title: "Uh oh..",
        description: err.message,
        variant: "destructive",
      }),
  });

  const onSubmit = (inputs: CreateCommentInput) => mutate(inputs);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-2 md:mb-3"
      id="comments"
    >
      <div className="flex md:flex-row flex-col md:items-center items-end gap-2">
        <Input
          {...register("content", { required: true })}
          placeholder="Insert comment"
        />
        <Button type="submit" variant="secondary">
          Submit
        </Button>
      </div>
      {errors.content && (
        <span className="text-sm text-red-400">{errors.content.message}</span>
      )}
    </form>
  );
};

export default CommentForm;
