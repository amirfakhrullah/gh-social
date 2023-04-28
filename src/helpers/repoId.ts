const REPLACED_CHARACTER = "__GHSC__";

export const convertToRepoId = (repoName: string) =>
  repoName.replace("/", REPLACED_CHARACTER);

export const convertToRepoName = (repoId: string) =>
  repoId.replace(REPLACED_CHARACTER, "/");
