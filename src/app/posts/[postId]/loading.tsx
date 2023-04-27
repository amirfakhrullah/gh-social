import TitleHead from "@/components/heads/TitleHead";
import CardSkeleton from "@/components/skeletons/CardSkeleton";

export default function LoadingPostId() {
  return (
    <>
      <TitleHead title="Thread" />
      <CardSkeleton withAvatar onlyShowLike border={false} />
    </>
  );
}
