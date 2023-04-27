import PostIdHead from "@/components/heads/PostIdHead";
import CardSkeleton from "@/components/skeletons/CardSkeleton";

export default function LoadingPostId() {
  return (
    <>
      <PostIdHead />
      <CardSkeleton withAvatar onlyShowLike />
    </>
  );
}
