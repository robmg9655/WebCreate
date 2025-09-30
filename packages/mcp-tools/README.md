# mcp-tools

Small CLI helpers used by the MCP flow.

Commands:

- scaffold_project: reads JSON from stdin { layout, copy, slug } and writes generated/<slug>/site.json
- fill_copy: reads JSON from stdin { slug, copy } and inserts into generated/<slug>/site.json
- deploy_vercel: tries to deploy via VERCEL_TOKEN env var; otherwise returns stub
- commit_push: makes a git commit in generated/<slug> and pushes if origin exists

Usage examples:

echo '{"slug":"demo","layout":{},"copy":{}}' | scaffold_project
