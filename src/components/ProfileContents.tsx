"use client";

import { TrimmedGitHubProfile } from "@/types/github";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MyRepoLists from "./MyRepoLists";
import RepoLists from "./RepoLists";
import { useState } from "react";
import MyPostLists from "./MyPostLists";
import MyLikedPostLists from "./MyLikedPostLists";

interface Props {
  profile: TrimmedGitHubProfile;
  self?: boolean;
}
const ProfileContents = ({ profile, self = false }: Props) => {
  return (
    <div className="w-full">
      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="w-full grid grid-cols-3 border-b border-slate-700 rounded-none">
          <TabsTrigger value="posts">{self && "My "}Posts</TabsTrigger>
          <TabsTrigger value="likes">{self && "My "}Likes</TabsTrigger>
          <TabsTrigger value="repos">{self && "My "}Repos</TabsTrigger>
        </TabsList>
        <TabsContent value="posts">
          {self ? <MyPostLists /> : <></>}
        </TabsContent>
        <TabsContent value="likes">
          {self ? <MyLikedPostLists /> : <></>}
        </TabsContent>
        <TabsContent value="repos">
          {self ? <MyRepoLists /> : <RepoLists username={profile.login} />}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfileContents;
