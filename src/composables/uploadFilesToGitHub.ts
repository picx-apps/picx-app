import { useGlobalState } from "../store";
import { Tree } from "../types";
import { UploadContent } from "../types/upload";

const { octokit, user, repo_name, branch_name } = useGlobalState();

export async function uploadFilesToGitHub(files: UploadContent[]) {
  if (!octokit.value || !user.value) return;
  const { login: owner } = user.value;
  const repo = repo_name.value;
  const branch = branch_name.value;
  const tree: Tree = [];
  for (const file of files) {
    file.path = file.path.slice(1);
    const { data } = await octokit.value.rest.git.createBlob({
      owner,
      repo,
      content: file.content,
      encoding: "base64",
    });
    tree.push({
      path: file.path,
      mode: "100644",
      type: "blob",
      sha: data.sha,
    });
  }

  const treeResponse = await octokit.value.rest.git.createTree({
    owner,
    repo,
    tree,
    base_tree: branch,
  });

  const commitResponse = await octokit.value.rest.git.createCommit({
    owner,
    repo,
    message: "Picx app to Upload files",
    tree: treeResponse.data.sha,
  });

  await octokit.value.rest.git.updateRef({
    owner,
    repo,
    ref: "heads/" + branch,
    sha: commitResponse.data.sha,
    force: true,
  });

  return commitResponse;
}
