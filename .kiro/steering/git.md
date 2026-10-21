# Git rules for this repo

## Never commit, never push

Do not run `git commit`, `git push`, `git tag`, `git merge`, `git rebase`,
`git reset`, `git revert`, `git cherry-pick`, `git stash`, or anything else that
writes to history, moves a branch, or touches the remote. No `--amend`. No
creating or deleting branches. No worktrees.

The owner commits his own work. Leave finished changes in the working tree and
say what changed; he will review and commit.

## Allowed

- `git pull`, `git fetch`
- Read-only inspection: `git status`, `git diff`, `git log`, `git show`,
  `git branch --list`, `git blame`, `git ls-files`

Editing files in the working tree is fine — that is not a git operation. The
restriction is on git history and the remote, not on doing the work.

## If a commit seems necessary

Say so and stop. Do not commit "just to be safe" or to keep a change from being
lost. An uncommitted working tree is the expected hand-off state.
