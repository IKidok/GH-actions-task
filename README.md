# GH-actions-task

This action fetch amount of PRs/issues from public repository. The repository and organization name are taken from input

## Inputs

### `ORG_NAME` -
Organisation name. Default `'nestjs'`
### `REPO_NAME` 
Repository name. Default `'nest'`
### `AUTH_TOKEN` -- 

## Outputs

### `prs`
Amount of open prs.
### `issues`
Amount of open issues.

## Action used in workflow to display amount of open prs/issues.


## Example usage

```yaml
uses: actions/GH-actions-task@e76147da8e5c81eaf017dede5645551d4b94427b
with:
  with:
    ORG_NAME: 'nestjs'
    REPO_NAME: 'nest'
    AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```
