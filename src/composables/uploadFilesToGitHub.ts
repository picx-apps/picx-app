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
    file.path = file.path[0] === "/" ? file.path.slice(1) : file.path;
    const { data } = await octokit.value.rest.git.createBlob({
      owner,
      repo,
      content: file.compression_content,
      encoding: "base64",
    });
    tree.push({
      path: file.path,
      mode: "100644",
      type: "blob",
      sha: data.sha,
    });
  }
  const lastCommit = await octokit.value.request(
    "GET /repos/{owner}/{repo}/branches/{branch}",
    {
      owner,
      repo,
      branch,
    }
  );
  const treeResponse = await octokit.value.rest.git.createTree({
    owner,
    repo,
    tree,
    base_tree: lastCommit.data.commit.commit.tree.sha,
  });

  const commitResponse = await octokit.value.rest.git.createCommit({
    owner,
    repo,
    parents: [lastCommit.data.commit.sha],
    message: "Picx app to Upload files",
    tree: treeResponse.data.sha,
  });

  let res = await octokit.value.rest.git.updateRef({
    owner,
    repo,
    ref: "heads/" + branch,
    sha: commitResponse.data.sha,
    force: false,
  });

  return res;
}
