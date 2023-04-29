"use client";

import FollowingFeedLists from "./lists/feeds/FollowingFeedLists";
import HotPostLists from "./lists/feeds/HotPostLists";
import LatestPostLists from "./lists/feeds/LatestPostLists";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

const FeedContents = () => {
  return (
    <div className="w-full">
      <Tabs defaultValue="hot" className="w-full">
        <TabsList className="w-full grid grid-cols-3 gap-1 border-b border-slate-700 rounded-none">
          <TabsTrigger value="hot">Hot</TabsTrigger>
          <TabsTrigger value="following">Following</TabsTrigger>
          <TabsTrigger value="latest">Latest</TabsTrigger>
        </TabsList>
        <TabsContent value="hot">
          <HotPostLists />
        </TabsContent>
        <TabsContent value="following">
          <FollowingFeedLists />
        </TabsContent>
        <TabsContent value="latest">
          <LatestPostLists />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FeedContents;
