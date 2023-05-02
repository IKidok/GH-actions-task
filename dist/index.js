/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 769:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 793:
/***/ ((module) => {

module.exports = eval("require")("octokit");


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
const core = __nccwpck_require__(769);
const { Octokit } = __nccwpck_require__(793);
const main = async () => {
  const AUTH_TOKEN = core.getInput('AUTH_TOKEN');
  const ORG_NAME = core.getInput('ORG_NAME');
  const REPO_NAME = core.getInput('REPO_NAME');
  try {
    const octokit = new Octokit({
      auth: AUTH_TOKEN
    })
    console.log(ORG_NAME)
    console.log(REPO_NAME)
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
      totalIssues.push(...result);
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

main();

})();

module.exports = __webpack_exports__;
/******/ })()
;