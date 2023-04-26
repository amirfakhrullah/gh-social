import PostCard from "@/components/PostCard";
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

  const post = await api.post.postById.fetch({
    id: postId,
  });

  if (!post) return notFound();

  return (
    <>
      <PostCard data={post} hideCommentsCount />
    </>
  );
}

export const runtime = "experimental-edge";
export const revalidate = 0;
