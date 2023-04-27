import Profile from "@/components/Profile";
import ProfileContents from "@/components/ProfileContents";
import { api } from "@/lib/api/server";
import { notFound, redirect } from "next/navigation";

interface PageProps {
  params: {
    username: string;
  };
}

export default async function Users({ params: { username } }: PageProps) {
  const [myProfile, pageProfile] = await Promise.all([
    api.github.profile.fetch(),
    api.github.otherProfile.fetch({ username }),
  ]);

  if (!pageProfile || !myProfile) return notFound();

  if (myProfile.login === pageProfile.login) {
    return redirect("/profile");
  }

  return (
    <>
      <Profile profile={pageProfile} />
      <ProfileContents profile={pageProfile} />
    </>
  );
}

export const runtime = "experimental-edge";
export const revalidate = 0;
