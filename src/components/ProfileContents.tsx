"use client";

import { TrimmedGitHubProfile } from "@/types/github";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MyRepoLists from "./lists/MyRepoLists";
import RepoLists from "./lists/RepoLists";
import { useState } from "react";
import MyPostLists from "./lists/MyPostLists";
import MyLikedPostLists from "./lists/MyLikedPostLists";
import PostLists from "./lists/PostLists";
import LikedPostLists from "./lists/LikedPostLists";

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
          <TabsTrigger value="repos">{self && "My "}Repos</TabsTrigger>
          <TabsTrigger value="likes">{self && "My "}Likes</TabsTrigger>
        </TabsList>
        <TabsContent value="posts">
          {self ? <MyPostLists /> : <PostLists username={profile.login} />}
        </TabsContent>
        <TabsContent value="likes">
          {self ? (
            <MyLikedPostLists />
          ) : (
            <LikedPostLists username={profile.login} />
          )}
        </TabsContent>
        <TabsContent value="repos">
          {self ? <MyRepoLists /> : <RepoLists username={profile.login} />}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfileContents;
