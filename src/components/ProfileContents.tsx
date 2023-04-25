"use client";

import { TrimmedGitHubProfile } from "@/types/github";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MyRepoLists from "./MyRepoLists";
import RepoLists from "./RepoLists";
import { useState } from "react";
import MyPostLists from "./MyPostLists";

interface Props {
  profile: TrimmedGitHubProfile;
  self?: boolean;
}
const ProfileContents = ({ profile, self = false }: Props) => {
  const [currentTab, setCurrentTab] = useState<"posts" | "repos">("posts");

  return (
    <div className="w-full">
      <Tabs defaultValue={currentTab} className="w-full">
        <TabsList className="w-full grid grid-cols-2 border-b border-slate-700 rounded-none">
          <TabsTrigger value="posts" onClick={() => setCurrentTab("posts")}>
            {self && "My "}Posts
          </TabsTrigger>
          <TabsTrigger value="repos" onClick={() => setCurrentTab("repos")}>
            {self && "My "}Repos
          </TabsTrigger>
        </TabsList>
        <TabsContent value="posts">
          {self ? <MyPostLists /> : <></>}
        </TabsContent>
        <TabsContent value="repos">
          {self ? <MyRepoLists /> : <RepoLists username={profile.login} />}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfileContents;
