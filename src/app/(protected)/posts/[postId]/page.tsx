import PostCard from "@/components/cards/PostCard";
import TitleHead from "@/components/heads/TitleHead";
import PostCommentLists from "@/components/lists/PostCommentLists";
import { RouterOutputs } from "@/lib/api/client";
import { api } from "@/lib/api/server";
import { notFound } from "next/navigation";

interface PageProps {
  params: {
    postId: string;
  };
}
export default async function PostIdPage({ params: { postId } }: PageProps) {
  if (!postId || typeof postId !== "string") {
    return notFound();
  }

  let post: RouterOutputs["post"]["postById"] | undefined;
  try {
    post = await api.post.postById.fetch({
      id: postId,
    });
  } catch (_) {
    return notFound();
  }

  if (!post) return notFound();

  return (
    <>
      <TitleHead title="Thread" />
      <PostCard
        data={post}
        onlyShowLikes
        showFullRepo
        disableNavigateToPostPage
        border={false}
      />
      <PostCommentLists postId={postId} />
    </>
  );
}

export const runtime = "experimental-edge";
export const revalidate = 0;
