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
DATE_STR=$(date +%Y-%m-%d/%H%M)
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
UPDATE_BRANCH=template-update-$TEMPLATE_BRANCH/$DATE_STR

# Ensure script is run from a backport branch
if [[ "$CURRENT_BRANCH" != backport/template/* ]]; then
  echo "⚠️ You must run this from a backport branch (backport/template/*)."
  exit 1
fi

echo "✅ Fetching latest from template..."
git fetch $TEMPLATE_REMOTE

echo "✅ Creating and checking out $UPDATE_BRANCH from $TEMPLATE_REMOTE/$TEMPLATE_BRANCH..."
git checkout -b "$UPDATE_BRANCH" $TEMPLATE_REMOTE/$TEMPLATE_BRANCH

echo "🔀 Merging $CURRENT_BRANCH into $TEMPLATE_BRANCH..."
git merge --no-ff $CURRENT_BRANCH -m "backport: merge $CURRENT_BRANCH into $TEMPLATE_BRANCH"

echo "📤 Pushing updated $TEMPLATE_BRANCH to $TEMPLATE_REMOTE..."
git push $TEMPLATE_REMOTE HEAD:$TEMPLATE_BRANCH

if [[ -f .original_branch ]]; then
  PROJECT_BRANCH=$(cat ".original_branch")
  rm .original_branch
else
  PROJECT_BRANCH="main" # fallback if not found
fi

echo "🧼 Cleaning up..."
if git checkout "$PROJECT_BRANCH"; then
  git branch -d "$CURRENT_BRANCH" || echo "⚠️ Could not delete $CURRENT_BRANCH (maybe it's already deleted or merged)"
  git branch -d "$UPDATE_BRANCH" || echo "⚠️ Could not delete $UPDATE_BRANCH"
else
  echo "❌ Failed to switch back to $PROJECT_BRANCH. Please do it manually."
fi

echo "🎉 Template repo updated directly from $CURRENT_BRANCH!"
