# Maintenance notes

Developer tasks to keep this repo healthy:

- Keep TypeScript and ESLint plugin versions compatible. If `@typescript-eslint` warns about TS version, pin TypeScript to a supported version or upgrade the parser/plugin.
- Re-run `pnpm -w -s lint` and fix warnings before merging.
- Keep `generated/` in `.gitignore` unless you intentionally want to commit generated sites.
- Use `scripts/build-all.sh` for CI or local full builds.
