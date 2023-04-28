"use client";

import { TrimmedGitHubProfile } from "@/types/github";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MyRepoLists from "./lists/MyRepoLists";
import RepoLists from "./lists/RepoLists";
import MyPostLists from "./lists/MyPostLists";
import MyLikedPostLists from "./lists/MyLikedPostLists";
import PostLists from "./lists/PostLists";
import LikedPostLists from "./lists/LikedPostLists";
import MyCommentLists from "./lists/MyCommentLists";
import CommentLists from "./lists/CommentLists";

interface Props {
  profile: TrimmedGitHubProfile;
  self?: boolean;
}
const ProfileContents = ({ profile, self = false }: Props) => {
  return (
    <div className="w-full">
      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="w-full grid grid-cols-4 gap-1 border-b border-slate-700 rounded-none">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="repos">Repos</TabsTrigger>
          <TabsTrigger value="comments">Replies</TabsTrigger>
          <TabsTrigger value="likes">Likes</TabsTrigger>
        </TabsList>
        <TabsContent value="posts">
          {self ? <MyPostLists /> : <PostLists username={profile.login} />}
        </TabsContent>
        <TabsContent value="repos">
          {self ? <MyRepoLists /> : <RepoLists username={profile.login} />}
        </TabsContent>
        <TabsContent value="comments">
          {self ? (
            <MyCommentLists />
          ) : (
            <CommentLists username={profile.login} />
          )}
        </TabsContent>
        <TabsContent value="likes">
          {self ? (
            <MyLikedPostLists />
          ) : (
            <LikedPostLists username={profile.login} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfileContents;
