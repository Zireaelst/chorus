#!/usr/bin/env bash
set -e

# mirror-public-repo.sh
# Mirrors the `contracts/` and `packages/sdk/` directories to a public remote using git subtree.
# By default, this runs in dry-run mode and will not actually push to the remote.

show_help() {
  echo "Usage: $0 [OPTIONS]"
  echo "Mirrors strictly 'contracts/' and 'packages/sdk/' to a public remote."
  echo ""
  echo "Options:"
  echo "  --remote-url URL      The URL of the destination repository"
  echo "  --execute-push        Perform the actual push (default is --dry-run)"
  echo "  -h, --help            Show this help message"
  exit 0
}

DRY_RUN=true
REMOTE_URL=""

while [[ "$#" -gt 0 ]]; do
  case $1 in
    --remote-url) REMOTE_URL="$2"; shift ;;
    --execute-push) DRY_RUN=false ;;
    -h|--help) show_help ;;
    *) echo "Unknown parameter passed: $1"; exit 1 ;;
  esac
  shift
done

if [ -z "$REMOTE_URL" ]; then
  echo "Error: --remote-url is required."
  exit 1
fi

# Ensure we are at the root of the repo
cd "$(git rev-parse --show-toplevel)"

echo "Setting up temporary public-mirror remote..."
git remote add public-mirror "$REMOTE_URL" 2>/dev/null || git remote set-url public-mirror "$REMOTE_URL"

# We push contracts and packages/sdk as subtrees
# If pushing multiple subtrees to the same repo, they need to go to separate branches
# Or we can push them to separate branches in the public mirror
# The prompt specifies "a git subtree-based push script for contracts/ and packages/sdk/"
# This script pushes them to specific branches

push_subtree() {
  local prefix=$1
  local branch=$2
  
  if [ "$DRY_RUN" = true ]; then
    echo "[DRY RUN] Would execute: git subtree push --prefix=\"$prefix\" public-mirror \"$branch\""
  else
    echo "Pushing $prefix to public-mirror $branch..."
    git subtree push --prefix="$prefix" public-mirror "$branch"
  fi
}

push_subtree "contracts" "main-contracts"
push_subtree "packages/sdk" "main-sdk"

echo "Done."
