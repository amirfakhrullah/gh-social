"use client";

import { GitHubUserProfile } from "@/types/github";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MyRepoLists from "./MyRepoLists";
import { usePathname, useRouter } from "next/navigation";
import RepoLists from "./RepoLists";

interface Props {
  profile: GitHubUserProfile;
  tab: "posts" | "repos";
  page: number;
  self?: boolean;
}
const ProfileContents = ({ profile, tab, page, self = false }: Props) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleTabChange = (tab: "posts" | "repos") => {
    router.push(`${pathname}?tab=${tab}`);
  };

  return (
    <div className="w-full">
      <Tabs defaultValue={tab} className="w-full">
        <TabsList className="w-full grid grid-cols-2 border-b border-slate-700 rounded-none">
          <TabsTrigger value="posts" onClick={() => handleTabChange("posts")}>
            Posts
          </TabsTrigger>
          <TabsTrigger value="repos" onClick={() => handleTabChange("repos")}>
            Repos
          </TabsTrigger>
        </TabsList>
        <TabsContent value="posts">
          Make changes to your account here.
        </TabsContent>
        <TabsContent value="repos">
          {self ? (
            <MyRepoLists isActive={tab === "repos"} page={page} />
          ) : (
            <RepoLists isActive={tab === "repos"} username={profile.login} page={page} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfileContents;
