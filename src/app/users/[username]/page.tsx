import Profile from "@/components/Profile";
import ProfileContents from "@/components/ProfileContents";
import { api } from "@/lib/api/server";
import { notFound } from "next/navigation";

interface PageProps {
  params: {
    username: string;
  };
  searchParams?: {
    tab?: string;
    page?: string;
  };
}

export default async function Users({
  params: { username },
  searchParams,
}: PageProps) {
  const profile = await api.github.otherProfile.fetch({ username });

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

  if (!profile) return notFound();

  return (
    <>
      <Profile profile={profile} />
      <ProfileContents profile={profile} />
    </>
  );
}

export const runtime = "experimental-edge";
export const revalidate = 0;
