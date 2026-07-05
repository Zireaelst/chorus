#!/usr/bin/env bash
set -e

# mirror-public-repo.test.sh
# Tests the mirror script locally using a disposable bare repository.

TEST_REMOTE_DIR="/tmp/chorus-test-remote.git"

echo "Setting up temporary test repository at $TEST_REMOTE_DIR..."
rm -rf "$TEST_REMOTE_DIR"
git init --bare "$TEST_REMOTE_DIR"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MIRROR_SCRIPT="$SCRIPT_DIR/mirror-public-repo.sh"

chmod +x "$MIRROR_SCRIPT"

echo "---"
echo "Test 1: Dry run (default behavior)"
"$MIRROR_SCRIPT" --remote-url "$TEST_REMOTE_DIR"
# Verify nothing was pushed
if git --git-dir="$TEST_REMOTE_DIR" show-ref --verify --quiet refs/heads/main-contracts 2>/dev/null; then
  echo "FAIL: Branch main-contracts exists after dry-run."
  exit 1
fi
echo "PASS: Dry run executed successfully with no push."

echo "---"
echo "Test 2: Execute push"
"$MIRROR_SCRIPT" --remote-url "$TEST_REMOTE_DIR" --execute-push
# Verify branch exists
if ! git --git-dir="$TEST_REMOTE_DIR" show-ref --verify --quiet refs/heads/main-contracts; then
  echo "FAIL: Branch main-contracts does not exist after push."
  exit 1
fi
if ! git --git-dir="$TEST_REMOTE_DIR" show-ref --verify --quiet refs/heads/main-sdk; then
  echo "FAIL: Branch main-sdk does not exist after push."
  exit 1
fi

echo "PASS: Subtrees successfully pushed to test remote."
echo "---"

echo "Cleaning up..."
rm -rf "$TEST_REMOTE_DIR"
git remote remove public-mirror 2>/dev/null || true

echo "All tests passed successfully!"
