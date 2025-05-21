#!/bin/bash

set -e

# === Setup ===
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

if [[ "$CURRENT_BRANCH" != port/template/* ]]; then
  echo "⚠️ You must run this from a template merge branch (port/template/*)."
  exit 1
fi

# Load original branch if recorded
if [[ -f .original_branch ]]; then
  PROJECT_BRANCH=$(cat .original_branch)
  rm .original_branch
else
  echo "⚠️ No original branch recorded. Defaulting to 'main'."
  PROJECT_BRANCH="main"
fi

echo "✅ Switching to $PROJECT_BRANCH"
git checkout "$PROJECT_BRANCH"

echo "🔀 Merging in changes from $CURRENT_BRANCH..."
git merge --no-ff "$CURRENT_BRANCH" -m "chore: merge template changes from $CURRENT_BRANCH"

echo "📤 Pushing updated $PROJECT_BRANCH to origin..."
git push origin "$PROJECT_BRANCH"

echo "🧼 Cleaning up..."
git branch -d "$CURRENT_BRANCH"

echo "🎉 Done! $PROJECT_BRANCH is now synced with the template."
