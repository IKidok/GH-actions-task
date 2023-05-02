const core = require('@actions/core');
const { Octokit } = require("octokit");
const main = async (_,__, ...arg) => {
  const [ORG_NAME, REPO_NAME, AUTH_TOKEN]  = arg;
  try {
    const octokit = new Octokit({
      auth: AUTH_TOKEN
    })

    const totalIssues = [];
    let result = { length: 100 };
    while (result.length === 100) {
      result = (await octokit.request(`GET /repos/{org}/{repo}/issues?per_page=100&page=${ (totalIssues.length / 100) + 1 }&state=open`, {
        org: ORG_NAME,
        repo: REPO_NAME,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      })).data;
      console.log(result.length)
      totalIssues.push(...result);
    }
    console.log(totalIssues.length)
    const { issues, prs } = totalIssues.reduce((acc, issue) => {
      [issueType, _] = issue.node_id.split('_');
      if (issueType === 'PR') acc.issues += 1;
      else acc.prs += 1;
      return acc;
    }, { issues: 0, prs: 0 })

    core.setOutput('The amount of open PRs', prs);
    core.setOutput('The amount of open Issues', issues);

  } catch (error) {
    core.setFailed(error.message);
  }
}

main(...process.argv);
