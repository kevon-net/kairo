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
PROJECT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
TEMP_BRANCH="port/template/$DATE_STR"

# === Start ===
echo "✅ Fetching latest from template ($TEMPLATE_REMOTE/$TEMPLATE_BRANCH)..."
git fetch $TEMPLATE_REMOTE

echo "✅ Checking out $PROJECT_BRANCH and pulling latest..."
git checkout "$PROJECT_BRANCH"
git pull origin "$PROJECT_BRANCH"

echo "✅ Creating new branch: $TEMP_BRANCH"
git checkout -b "$TEMP_BRANCH"

echo "🔀 Merging $TEMPLATE_REMOTE/$TEMPLATE_BRANCH into $TEMP_BRANCH"
if git merge "$TEMPLATE_REMOTE/$TEMPLATE_BRANCH" -m "port: pull template changes from $TEMPLATE_REMOTE/$TEMPLATE_BRANCH" --allow-unrelated-histories; then
  echo "✅ Merge completed without conflicts!"
else
  echo "⚠️ Merge conflicts detected. Please resolve them manually, then run:"
  echo "   git add ."
  echo "   git commit"
  echo "Then proceed with testing before running ./template-merge.sh."
  exit 1
fi

echo "$PROJECT_BRANCH" >.original_branch

echo "🧪 All set. Now test your app on branch: $TEMP_BRANCH"
echo "Once confirmed working, run ./template-merge.sh to finalize."
