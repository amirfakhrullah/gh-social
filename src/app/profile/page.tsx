import Profile from "@/components/Profile";
import { api } from "@/lib/api/server";

export default async function Page() {
  const profile = await api.github.profile.fetch();

  return (
    <div>
      <Profile profile={profile} />
    </div>
  );
}

export const runtime = "experimental-edge";
export const revalidate = 0;
