"use client";

import PostForm from "@/components/PostForm";
import { TrimmedGitHubRepo } from "@/types/github";
import React, { createContext, useContext, useState } from "react";

interface PostModalContextValues {
  isOpened: boolean;
  repo?: TrimmedGitHubRepo;
  handleOpen: (repoFromProp?: TrimmedGitHubRepo) => void;
  handleClose: () => void;
  deleteRepo: () => void;
}
export const PostModalContext = createContext<PostModalContextValues>({
  isOpened: false,
  repo: undefined,
  handleOpen: () => {},
  handleClose: () => {},
  deleteRepo: () => {},
});

export const usePostModalContext = () => useContext(PostModalContext);

const PostModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpened, setIsOpened] = useState(false);
  const [repo, setRepo] = useState<TrimmedGitHubRepo | undefined>();

  const handleOpen = (repoFromProp?: TrimmedGitHubRepo) => {
    setRepo(repoFromProp);
    setIsOpened(true);
  };

  const handleClose = () => {
    setRepo(undefined);
    setIsOpened(false);
  };

  const deleteRepo = () => {
    setRepo(undefined);
  };

  return (
    <PostModalContext.Provider
      value={{
        isOpened,
        repo,
        handleOpen,
        handleClose,
        deleteRepo,
      }}
    >
      {children}
      <PostForm />
    </PostModalContext.Provider>
  );
};

export default PostModalProvider;
