import { useGlobalState } from "../store";

const { octokit, user, repo_name } = useGlobalState();

export async function useCreateFolder(path?: string) {
  if (!octokit.value || !user.value) return;
  const content = btoa("This Folder created with " + new Date().toDateString());
  return await octokit.value.rest.repos.createOrUpdateFileContents({
    owner: user.value.login,
    repo: repo_name.value,
    path: path + "/README.md",
    message: "Picx created this folder",
    content: content,
  });
}
