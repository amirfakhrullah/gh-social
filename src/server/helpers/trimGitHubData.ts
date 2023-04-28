import {
  GitHubRepo,
  GitHubUserProfile,
  TrimmedGitHubProfile,
  TrimmedGitHubRepo,
} from "@/types/github";

export const trimGitHubProfileData = (profile: GitHubUserProfile) => {
  const trimmedProfile: TrimmedGitHubProfile = {
    id: profile.id,
    node_id: profile.node_id,
    name: profile.name,
    login: profile.login,
    avatar_url: profile.avatar_url,
    bio: profile.bio,
    blog: profile.blog,
    followers: profile.followers,
    following: profile.following,
    html_url: profile.html_url,
    type: profile.type,
    company: profile.company,
  };
  return trimmedProfile;
};

export const trimGitHubRepoData = (repo: GitHubRepo) => {
  const trimmedRepo: TrimmedGitHubRepo = {
    id: repo.id,
    node_id: repo.node_id,
    name: repo.name,
    full_name: repo.full_name,
    html_url: repo.html_url,
    description: repo.description,
    fork: repo.fork,
    forks_count: repo.forks_count,
    stargazers_count: repo.stargazers_count,
    watchers_count: repo.watchers_count,
    topics: repo.topics,
    owner: trimGitHubProfileData(repo.owner),
  };
  return trimmedRepo;
};
