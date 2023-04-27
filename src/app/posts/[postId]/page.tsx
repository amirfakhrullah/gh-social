import PostCard from "@/components/cards/PostCard";
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
      <PostCard data={post} onlyShowLikes showFullRepo />
    </>
  );
}

export const runtime = "experimental-edge";
export const revalidate = 0;
