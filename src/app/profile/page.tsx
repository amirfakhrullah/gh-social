import Profile from "@/components/Profile";
import ProfileContents from "@/components/ProfileContents";
import { api } from "@/lib/api/server";

export default async function Page() {
  const profile = await api.github.profile.fetch();

  return (
    <>
      <Profile profile={profile} self />
      <ProfileContents profile={profile} self />
    </>
  );
}

export const runtime = "experimental-edge";
export const revalidate = 0;
