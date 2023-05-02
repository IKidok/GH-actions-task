const core = require('@actions/core');
const { Octokit } = require("octokit");
const main = async () => {
  const AUTH_TOKEN = core.getInput('AUTH_TOKEN');
  const ORG_NAME = core.getInput('ORG_NAME');
  const REPO_NAME = core.getInput('REPO_NAME');
  const STATE = core.getInput('STATE');
  const SINCE = core.getInput('SINCE');
  try {
    const totalIssues = []
    if (STATE) {
      totalIssues.push(...(await fetchIssues(AUTH_TOKEN, ORG_NAME, REPO_NAME, STATE)))
    } else {
      console.log(SINCE);
      totalIssues.push(...(await fetchIssues(AUTH_TOKEN, ORG_NAME, REPO_NAME, 'open', SINCE)))
      totalIssues.push(...(await fetchIssues(AUTH_TOKEN, ORG_NAME, REPO_NAME, 'closed', SINCE)))
    }

    const { issues, prs } = totalIssues.reduce((acc, issue) => {
      [issueType, _] = issue.node_id.split('_');
      if (issueType === 'PR') acc.issues += 1;
      else acc.prs += 1;
      return acc;
    }, { issues: 0, prs: 0 })

      core.setOutput('prs', prs);
      core.setOutput('issues', issues);

  } catch (error) {
    core.setFailed(error.message);
  }
}

const fetchIssues = async (auth_token, orgName, repoName, state = 'open', since = undefined ) => {
  const octokit = new Octokit({
    auth: auth_token
  })
  const totalIssues = [];
  let result = { length: 100 };
  while (result.length === 100) {
    result = (await octokit.request(
      `GET /repos/{org}/{repo}/issues?per_page=100&page=${ (totalIssues.length / 100) + 1 }&state={state}${since ? `&since=${since}` :  ``}`, {
      org: orgName,
      repo: repoName,
      state,
      since,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })).data;
    totalIssues.push(...result);
  }
  return totalIssues;
}

main();
