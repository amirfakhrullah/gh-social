import RepoCard from "@/components/cards/RepoCard";
import TitleHead from "@/components/heads/TitleHead";
import RepoPostLists from "@/components/lists/RepoPostLists";
import { convertToRepoName } from "@/helpers/repoId";
import { api } from "@/lib/api/server";
import { notFound } from "next/navigation";

interface PageProps {
  params: {
    repoId: string;
  };
}

export default async function RepoIdPage({ params: { repoId } }: PageProps) {
  const repoName = convertToRepoName(repoId);

  const repo = await api.github.getARepo.fetch({ repoName });
  if (!repo) return notFound();

  return (
    <>
      <TitleHead title="Repo" />
      <RepoCard repo={repo} navigateToGitHub border={false} />
      <RepoPostLists repo={repo} />
    </>
  );
}

export const runtime = "experimental-edge";
export const revalidate = 0;
