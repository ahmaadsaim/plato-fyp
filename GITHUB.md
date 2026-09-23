# Git and GitHub Contribution Guide

This is the official Git and GitHub workflow for this repository. It is designed for a team of 2-5 developers and applies equally to human developers and AI coding agents.

The central rule is simple: `main` contains integrated, stable code. Work is developed on task branches and reaches `main` only through an approved Pull Request (PR).

## 1. Core Git Rules

1. `main` is protected.
2. Never check out `main` and start coding directly on it.
3. Never commit directly to `main`.
4. Never push directly to `main`.
5. Never force-push to `main`.
6. Every task gets its own branch.
7. Every completed task goes through a Pull Request.
8. At least one other developer reviews the PR before merging.
9. Do not merge code that fails required checks or tests.
10. Delete a task branch after it has been merged unless there is a documented reason to keep it.

Normally, `main` changes only when an approved Pull Request is merged. This keeps the shared branch stable and gives the team a clear review and testing record.

## 2. Branch Naming Convention

Branches represent work, not people. Use one of these prefixes, followed by lowercase kebab-case:

| Prefix | Use for |
| --- | --- |
| `feature/` | New functionality |
| `fix/` | Bug fixes |
| `refactor/` | Restructuring without changing intended behavior |
| `docs/` | Documentation-only changes |
| `test/` | Adding or modifying tests |
| `chore/` | Maintenance, configuration, or dependency work |
| `hotfix/` | Urgent production fixes |

Examples:

```text
feature/user-authentication
feature/tenant-management
feature/order-management
feature/product-inventory
fix/order-total-calculation
fix/login-validation
refactor/order-service
docs/api-documentation
test/order-service
chore/update-dependencies
hotfix/payment-failure
```

Do not use names such as `Ali-branch`, `Saim-branch`, `new-branch`, `testing`, `my-branch`, `final`, `final-final`, `changes`, `work`, or `temp`. A branch name should describe the task so anyone can understand its purpose.

## 3. Creating a New Branch

The recommended approach for this repository is `git switch`:

```bash
git switch main
git pull origin main
git switch -c feature/order-management
```

The first two commands ensure the new branch starts from the latest `main`. The older equivalent is:

```bash
git checkout main
git pull origin main
git checkout -b feature/order-management
```

Do not create a branch while carrying unrelated uncommitted changes. Check the worktree first as described below.

## 4. Working on a Branch

All task code must be developed on the task branch:

```text
main
 ├── feature/authentication
 ├── feature/orders
 └── feature/inventory
```

Work only on the branch associated with your task. Do not create a separate branch for every tiny change when those changes belong to the same task; keep related work together in one focused branch.

## 5. Before Starting Work Each Day

For a clean working tree, synchronize your branch with the latest `main` using a merge-based workflow:

```bash
git status
git switch main
git pull origin main
git switch feature/<task-name>
git merge main
```

If your branch has uncommitted work, commit it or stash it before switching branches. Merging `main` regularly reduces surprises at PR time and lets conflicts be resolved while the relevant context is fresh. We use merge rather than rebase for simplicity and to avoid rewriting shared branch history.

## 6. Uncommitted Changes Rule

Uncommitted changes exist only in your local working directory. Before switching branches, merging, resetting, or performing another risky operation, inspect the state:

```bash
git status
git branch --show-current
```

If the work is ready to save:

```bash
git add .
git commit -m "feat: add order creation"
```

If the work is not ready to commit:

```bash
git stash
```

Restore the stash after returning to the correct branch:

```bash
git stash pop
```

Do not switch branches carelessly with uncommitted changes. Git may block the operation, or changes may be carried into the wrong branch and cause accidental overwrites.

## 7. Commit Message Convention

Use Conventional Commits with a lowercase type and a short imperative description:

```text
type: short imperative description
```

Examples:

```text
feat: add order creation
fix: correct order total calculation
refactor: simplify tenant resolver
docs: update Git workflow
test: add order service tests
chore: update dependencies
```

Rules:

- Use a lowercase type.
- Use imperative language, such as `add`, `fix`, or `update`.
- Keep the description short and specific.
- Do not add an unnecessary period.
- Make one logical change per commit.
- Do not use meaningless messages.

Bad messages include `update`, `changes`, `fixed stuff`, `work`, `final`, and `asdf`.

Good messages include:

```text
feat: add tenant creation endpoint
fix: prevent duplicate order creation
refactor: extract order validation service
```

## 8. What Should Be Committed

Commits should contain related, logical changes. Do not commit:

- `.env` files
- API keys, passwords, secrets, or private credentials
- Generated files unless the project explicitly requires them
- Local IDE settings unless intentionally shared
- Large, unnecessary build artifacts

Use `.gitignore` to keep local and generated files out of commits. Secrets must never be pushed to GitHub. If a secret is accidentally committed, tell the repository owner immediately and rotate it; deleting the file in a later commit does not make the secret safe.

## 9. Push Workflow

After your first commit on a new branch:

```bash
git branch --show-current
git push -u origin feature/<task-name>
```

For later commits on the same branch:

```bash
git branch --show-current
git push
```

Always verify the current branch before pushing. Never run this as a normal developer:

```bash
git push origin main
```

## 10. Pull Request Rules

When the task is ready, open a Pull Request from the task branch into `main`:

```text
feature/<task-name> -> main
```

Use a Conventional Commit-style PR title:

```text
feat: add tenant creation
fix: resolve duplicate order issue
refactor: simplify inventory service
```

Every PR description must contain:

```markdown
## Summary
What was changed?

## Why
Why was the change necessary?

## Changes
What important files or features were modified?

## Testing
What commands or manual checks were run, and what was the result?

## Screenshots
Include screenshots for UI changes where appropriate.

## Notes
Mention migrations, environment variables, breaking changes, or anything reviewers need to know.
```

Example:

```markdown
## Summary
Added tenant creation from the dashboard.

## Why
Restaurant owners need to create and identify their own tenant sites.

## Changes
- Added the tenant creation form and server action.
- Added validation for tenant slugs.
- Added the tenant API route.

## Testing
- `npm run lint`
- Tested tenant creation locally with PostgreSQL.

## Screenshots
Attached dashboard screenshots.

## Notes
Requires `DATABASE_URL` and `AUTH_SECRET`; no migration is needed.
```

## 11. Pull Request Review

At least one teammate should review important changes. The author must not approve their own PR. Reviewers should check correctness, security, maintainability, tests, error handling, and unintended side effects. Review comments must be addressed before merging.

Do not merge while required CI checks are failing or while the branch has unresolved conflicts. Review is about the code and its behavior, not about criticizing a person.

## 12. Keeping a PR Updated With Main

If another developer merges changes into `main` while your PR is open:

```bash
git status
git switch main
git pull origin main
git switch feature/my-task
git merge main
```

Resolve any conflicts deliberately, run the appropriate checks, then push the same branch:

```bash
git add .
git commit -m "chore: resolve merge conflicts"
git push
```

The open PR updates automatically because it tracks that branch.

## 13. Merge Conflict Rules

A conflict can look like this:

```text
<<<<<<< HEAD
your changes
=======
other changes
>>>>>>> main
```

When resolving conflicts:

1. Do not blindly choose `ours`.
2. Do not blindly choose `theirs`.
3. Understand what both developers intended.
4. Combine both changes when both are required.
5. Ask the original developer when the intended behavior is unclear.
6. Run tests after resolving the conflict.
7. Review the final diff before committing.

Git can identify textual overlap, but it cannot decide the correct business logic. Never silently discard another developer's work.

## 14. Working on Another Developer's Branch

Normally, do not work directly on another developer's branch. Create your own branch from the appropriate base. If collaboration on the same branch is explicitly required, agree on it with the team first.

Uncommitted changes on another developer's computer are not available through GitHub. A developer must commit and push their work before another developer can reliably obtain it through Git.

## 15. Main Branch Protection

Repository administrators should configure GitHub to protect `main` with these settings:

- Require a Pull Request before merging.
- Require at least one approval.
- Require status checks to pass.
- Require the branch to be up to date before merging when practical.
- Block force pushes.
- Block branch deletion.
- Prevent direct pushes.
- Prevent administrators from bypassing protections when appropriate for the team.

This document describes what people should do; GitHub branch protection enforces the important rules.

## 16. Merge Strategy

Use **Squash and Merge** for feature PRs unless there is a clear reason to preserve individual commits:

```text
feature/order
   ├── commit 1
   ├── commit 2
   ├── commit 3
   └── commit 4
          |
          v
       Squash
          |
          v
main -> one clean commit
```

Squashing keeps `main` easy to read while allowing developers to make useful commits during development. A normal merge can be used when preserving a meaningful branch history matters. Rebase is allowed only when the team agrees and nobody else depends on the branch, because rebase rewrites commit history.

## 17. Pulling Latest Code

`git fetch` downloads information about remote branches but does not change your working files. `git pull` fetches and then integrates the remote changes into the current branch.

The standard daily synchronization command for local `main` is:

```bash
git switch main
git pull origin main
```

Then merge that updated `main` into your task branch as described above.

## 18. Checking Current State Before Dangerous Git Operations

Before `checkout`/`switch`, `merge`, `rebase`, `reset`, or `push`, run:

```bash
git status
git branch --show-current
```

Knowing both the worktree state and current branch prevents commands from affecting the wrong work. In particular, normal developers must never run:

```bash
git push origin main
```

If you are unsure what a destructive command will do, stop and ask before running it.

## 19. Emergency/Hotfix Workflow

For an urgent production fix, create a branch from the latest `main`:

```bash
git status
git switch main
git pull origin main
git switch -c hotfix/payment-failure
```

Make the smallest focused fix, test it, push the hotfix branch, and open a PR into `main`. Do not bypass branch protection unless the repository's documented emergency procedure explicitly allows it. A hotfix still requires review and passing checks.

## 20. Git Commands Cheat Sheet

| Action | Command |
| --- | --- |
| Clone repository | `git clone <repository-url>` |
| Create branch | `git switch -c feature/<task-name>` |
| Switch branch | `git switch <branch-name>` |
| Check status | `git status` |
| Check current branch | `git branch --show-current` |
| Pull main | `git switch main && git pull origin main` |
| Stage files | `git add .` |
| Commit | `git commit -m "type: description"` |
| Push new branch | `git push -u origin <branch-name>` |
| Push existing branch | `git push` |
| Fetch | `git fetch origin` |
| Merge main | `git merge main` |
| View branches | `git branch -a` |
| View commit history | `git log --oneline --decorate --graph` |
| Stash | `git stash` |
| Restore stash | `git stash pop` |
| Delete local branch | `git branch -d <branch-name>` |
| Delete remote branch | `git push origin --delete <branch-name>` |

## 21. Complete Example Workflow

Three developers have three separate tasks:

- Ali -> `feature/orders`
- Saim -> `feature/inventory`
- Bilal -> `feature/rider`

The workflow is:

1. Each developer checks `git status`, switches to `main`, and pulls the latest code.
2. Each developer creates their own task branch from the updated `main`.
3. They work independently on their assigned tasks.
4. They create small commits using Conventional Commits, such as `feat: add order creation`.
5. Each developer verifies the branch name and pushes their own branch.
6. Each developer opens a PR into `main`.
7. Another developer reviews each PR and requests or approves changes.
8. CI runs the required tests and build checks.
9. The PR is merged only after approval, passing checks, and conflict resolution.
10. The merged feature branch is deleted on GitHub and locally.
11. Everyone updates local `main` before starting new work.
12. If a PR remains open while other PRs merge, its author brings the latest `main` into the open branch, resolves conflicts, tests, and pushes again.

No developer pushes another developer's branch or directly changes `main`.

## 22. Rules for AI Coding Agents

AI coding agents working in this repository must follow the same Git rules as developers. An AI agent must:

1. Check the current branch before making changes.
2. Never make code changes directly on `main`.
3. If currently on `main`, stop and instruct the developer to create or switch to the appropriate task branch.
4. Never run `git push origin main`.
5. Never force-push unless explicitly authorized by the repository owner.
6. Never reset or discard another developer's work without explicit permission.
7. Check `git status` before Git operations.
8. Never commit secrets.
9. Use the repository's commit naming convention if asked to commit.
10. Never merge a PR automatically unless explicitly authorized.
11. If a merge conflict occurs, explain it instead of silently choosing one side.
12. Never delete another developer's branch without explicit permission.
13. Inspect relevant existing code and architecture before making large changes.
14. Keep changes focused on the assigned task.
15. Do not modify unrelated files merely because they could be improved.
16. Run appropriate tests, build, and lint commands when available.
17. Report exactly which files were changed.
18. Report whether tests passed or failed.
19. Report the current branch before suggesting a push.

## 23. Golden Rules

1. `main` is protected.
2. Never develop directly on `main`.
3. One task equals one branch.
4. Branch names describe the task, not the person.
5. Pull the latest `main` before starting new work.
6. Make small logical commits.
7. Push only your task branch.
8. Open a Pull Request.
9. Get review before merging.
10. Resolve conflicts carefully.
11. Never overwrite another developer's work.
12. Never commit secrets.
13. Run tests before requesting a merge.
14. Delete merged branches.
15. When in doubt, stop and ask before performing a destructive Git operation.

## Recommended GitHub Flow

```text
Developer
    |
    v
feature/orders
    |
    v
Pull Request
    |
    +-- Code Review  [OK]
    +-- Tests        [OK]
    +-- Build        [OK]
    |
    v
main
```
