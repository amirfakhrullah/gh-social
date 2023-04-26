import Profile from "@/components/Profile";
import ProfileContents from "@/components/ProfileContents";
import { api } from "@/lib/api/server";
import { notFound } from "next/navigation";

interface PageProps {
  params: {
    username: string;
  };
}

export default async function Users({
  params: { username },
}: PageProps) {
  const profile = await api.github.otherProfile.fetch({ username });

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
