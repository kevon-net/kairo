#!/bin/bash

set -e

# === Prompt for Config ===
read -p "🔧 Enter the template remote (required): " TEMPLATE_REMOTE
if [[ -z "$TEMPLATE_REMOTE" ]]; then
  echo "❌ No remote entered. Exiting."
  exit 1
fi

# === Config ===
TEMPLATE_BRANCH="main"
PROJECT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

# Ask for commit hash(es) and a short name for the feature
read -p "Enter commit hash(es) to cherry-pick (space-separated, e.g., abc123 def456): " COMMIT_HASHES

if [[ -z "$COMMIT_HASHES" ]]; then
  echo "❌ No commit hashes entered. Exiting."
  exit 1
fi

DATE_STR=$(date +%Y-%m-%d/%H%M)
BACKPORT_BRANCH="backport/template/$DATE_STR"

echo "✅ Fetching latest from template ($TEMPLATE_REMOTE/$TEMPLATE_BRANCH)..."
git fetch $TEMPLATE_REMOTE

echo "✅ Creating backport branch: $BACKPORT_BRANCH"
git checkout -b $BACKPORT_BRANCH $TEMPLATE_REMOTE/$TEMPLATE_BRANCH

echo "🔀 Cherry-picking commits: $COMMIT_HASHES"
if git cherry-pick $COMMIT_HASHES; then
  echo "✅ Cherry-pick successful!"
else
  echo "⚠️ Conflict(s) detected during cherry-pick."
  echo "➡️  Resolve manually, then run:"
  echo "    git add ."
  echo "    git cherry-pick --continue"
  echo "🧪 After testing, run ./template-push.sh to update the template."
  exit 1
fi

echo "🧪 Test your changes in this branch: $BACKPORT_BRANCH"
echo "Then run ./template-push.sh to push the update to the template repo."

echo "$PROJECT_BRANCH" >".original_branch"
