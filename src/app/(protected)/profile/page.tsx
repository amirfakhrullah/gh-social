import Profile from "@/components/Profile";
import ProfileContents from "@/components/ProfileContents";
import { api } from "@/lib/api/server";
import { notFound } from "next/navigation";

export default async function Page() {
  const profile = await api.github.profile.fetch();
  if (!profile) return notFound();

  return (
    <>
      <Profile profile={profile} self />
      <ProfileContents profile={profile} self />
    </>
  );
}

export const revalidate = 0;
