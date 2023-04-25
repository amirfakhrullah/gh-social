"use client";

import { GitHubUserProfile } from "@/types/github";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MyRepoLists from "./MyRepoLists";
import RepoLists from "./RepoLists";
import { useState } from "react";

interface Props {
  profile: GitHubUserProfile;
  self?: boolean;
}
const ProfileContents = ({ profile, self = false }: Props) => {
  const [currentTab, setCurrentTab] = useState<"posts" | "repos">("posts");

  return (
    <div className="w-full">
      <Tabs defaultValue={currentTab} className="w-full">
        <TabsList className="w-full grid grid-cols-2 border-b border-slate-700 rounded-none">
          <TabsTrigger value="posts" onClick={() => setCurrentTab("posts")}>
            Posts
          </TabsTrigger>
          <TabsTrigger value="repos" onClick={() => setCurrentTab("repos")}>
            Repos
          </TabsTrigger>
        </TabsList>
        <TabsContent value="posts">
          Make changes to your account here.
        </TabsContent>
        <TabsContent value="repos">
          {self ? (
            <MyRepoLists isActive={currentTab === "repos"} />
          ) : (
            <RepoLists isActive={currentTab === "repos"} username={profile.login} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfileContents;
