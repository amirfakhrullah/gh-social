import FeedContents from "@/components/FeedContents";
import TitleHead from "@/components/heads/TitleHead";

export default function Home() {
  return (
    <>
      <TitleHead title="Public Feeds" disableBackButton />
      <FeedContents />
    </>
  );
}

export const runtime = "experimental-edge";
export const revalidate = 0;
