#!/usr/bin/env bash
set -euo pipefail
root=$(pwd)
packages=(
  packages/mcp-tools
  packages/sitegen-core
  packages/templates
  apps/console
  services/transcribe
  services/image-maker
)
for p in "${packages[@]}"; do
  # Use workspace runner to build all packages correctly
  echo "Running workspace build for packages (pnpm -w -r run build)"
  pnpm -w -r run build
  break
done

echo "\nAll builds finished"
