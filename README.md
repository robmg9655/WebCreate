# WebCreate

Monorepo for MVP that converts a description (text or voice) into a modern landing page for Japanese SMBs.

See README in each package for usage. Root scripts:

- pnpm install
- pnpm bootstrap
- pnpm dev
- pnpm gen:example

See .env.example for environment variables.
# Interactive questionnaire -> scaffold
You can run an interactive questionnaire that collects structured site information and runs the scaffold CLI to generate a site.

Run interactively:

```bash
node ./scripts/ask-and-scaffold.js
```

Non-interactive (use sample answers):

```bash
node ./scripts/ask-and-scaffold.js --from-file ./scripts/sample-answers.json
```

Dry run (print payload):

```bash
node ./scripts/ask-and-scaffold.js --from-file ./scripts/sample-answers.json --dry-run
```

Monetization / testing notes
--------------------------------
This repo contains a mock payments flow used to gate the scaffold operation. For production you'll want to replace `/api/payments` with a real payments provider (Stripe, PayPal, etc.) and securely store license records in a proper DB.

To test locally without running a web server, create a mock license file:

```bash
node ./scripts/create-license.js test@local
# -> prints a license string like LIC-xxxxxxxx
```

Then run the scaffold via the interactive script or the console app (if running the dev server). The scaffold API expects `license` to be provided in the payload to `/api/scaffold`.


# WebCreate