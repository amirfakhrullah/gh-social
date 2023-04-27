import CardSkeleton from "@/components/skeletons/CardSkeleton";

export default function LoadingPostId() {
  return (
    <>
      <CardSkeleton withAvatar onlyShowLike />
    </>
  );
}
