#!/usr/bin/env bash
set -e
if [ -d .git ]; then
  echo "Repo already initialized"
  exit 0
fi
git init
git add -A
git commit -m "Initial commit: WebCreate scaffold"
if git remote get-url origin > /dev/null 2>&1; then
  git push -u origin main
else
  echo "No remote origin configured; created local repo."
fi
