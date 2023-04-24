import Profile from "@/components/Profile";
import ProfileContents from "@/components/ProfileContents";
import { api } from "@/lib/api/server";

interface Props {
  searchParams?: {
    tab?: string;
    page?: string;
  };
}
export default async function Page({ searchParams }: Props) {
  const profile = await api.github.profile.fetch();

  let currentTab: "posts" | "repos" = "posts";
  let page = 1;

  if (
    searchParams?.tab &&
    (searchParams.tab === "posts" || searchParams.tab === "repos")
  ) {
    currentTab = searchParams.tab;
  }

  if (searchParams?.page && typeof searchParams.page === "string") {
    page = Number(searchParams.page) >= 1 ? Number(searchParams.page) : 1;
  }

  return (
    <>
      <Profile profile={profile} self />
      <ProfileContents profile={profile} tab={currentTab} page={page} self />
    </>
  );
}

export const runtime = "experimental-edge";
export const revalidate = 0;
