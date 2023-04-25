import { GitHubRepo, GitHubUserProfile } from "@/types/github";

const baseUrl = "https://api.github.com";
const baseHeaders = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
};

const getUserProfile = async (token: string, username: string) => {
  const res = await fetch(`${baseUrl}/users/${username}`, {
    headers: {
      ...baseHeaders,
      Authorization: `Bearer ${token}`,
    },
  });
  return (await res.json()) as GitHubUserProfile;
};

const getFollowerLists = async (
  token: string,
  username: string,
  page: number,
  perPage: number
) => {
  const res = await fetch(
    `${baseUrl}/users/${username}/followers?page=${page}&per_page=${perPage}`,
    {
      headers: {
        ...baseHeaders,
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return (await res.json()) as GitHubUserProfile[];
};

const getFollowingLists = async (
  token: string,
  username: string,
  page: number,
  perPage: number
) => {
  const res = await fetch(
    `${baseUrl}/users/${username}/following?page=${page}&per_page=${perPage}`,
    {
      headers: {
        ...baseHeaders,
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return (await res.json()) as GitHubUserProfile[];
};

const amIFollowingTheUser = async (token: string, username: string) => {
  const res = await fetch(`${baseUrl}/user/following/${username}`, {
    headers: {
      ...baseHeaders,
      Authorization: `Bearer ${token}`,
    },
  });
  return res.status === 204;
};

const followAction = async (
  token: string,
  username: string,
  action: "follow" | "unfollow"
) => {
  const res = await fetch(`${baseUrl}/user/following/${username}`, {
    method: action === "unfollow" ? "DELETE" : "PUT",
    headers: {
      ...baseHeaders,
      Authorization: `Bearer ${token}`,
    },
  });
  return res.status === 204;
};

const starAction = async (
  token: string,
  owner: string,
  repoName: string,
  action: "star" | "unstar"
) => {
  const res = await fetch(`${baseUrl}/user/starred/${owner}/${repoName}`, {
    method: action === "unstar" ? "DELETE" : "PUT",
    headers: {
      ...baseHeaders,
      Authorization: `Bearer ${token}`,
    },
  });
  return res.status === 204;
};

const hasIStarredTheRepo = async (
  token: string,
  owner: string,
  repoName: string
) => {
  const res = await fetch(`${baseUrl}/user/starred/${owner}/${repoName}`, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
  return res.status === 204;
};

const myRepoLists = async (token: string, page: number, perPage: number) => {
  const res = await fetch(
    `${baseUrl}/user/repos?page=${page}&per_page=${perPage}&visibility=public&sort=pushed`,
    {
      headers: {
        ...baseHeaders,
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return (await res.json()) as GitHubRepo[];
};

const otherUserRepoLists = async (
  token: string,
  username: string,
  page: number,
  perPage: number
) => {
  const res = await fetch(
    `${baseUrl}/users/${username}/repos?page=${page}&per_page=${perPage}&sort=pushed`,
    {
      headers: {
        ...baseHeaders,
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return (await res.json()) as GitHubRepo[];
};

const githubApi = {
  getUserProfile,
  getFollowerLists,
  getFollowingLists,
  amIFollowingTheUser,
  followAction,
  starAction,
  hasIStarredTheRepo,
  myRepoLists,
  otherUserRepoLists,
};

export default githubApi;
