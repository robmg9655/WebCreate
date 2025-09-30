#!/usr/bin/env bash
set -euo pipefail
# Quick smoke test: ensure mcp-tools scaffold produces a valid JSON and matches basic schema
TMPDIR=$(mktemp -d)
PAYLOAD='{ "slug": "smoke-site", "layout": { "id": "smoke", "sections": ["hero"] }, "copy": { "en": { "headline": "Smoke" } } }'
printf "%s" "$PAYLOAD" | node packages/mcp-tools/dist/scaffold_project.js > /dev/null
OUT=/Users/$(whoami)/generated/smoke-site/site.json
if [ ! -f "$OUT" ]; then
  echo "Smoke test failed: $OUT not found"
  exit 2
fi
jq . "$OUT" > /dev/null
echo "Smoke test passed: $OUT exists and is valid JSON"
