# Console App — Local LLM Setup

This app can generate site previews from a plain description using a local LLM (GPT4All) — no external API keys required.

## Requirements
- Python 3.9+
- pip (or pipx), optional virtualenv

## Install Python dependencies
```bash
# Create and activate a virtualenv (recommended)
python3 -m venv ~/.venvs/gpt4all
source ~/.venvs/gpt4all/bin/activate

# Install packages
pip install --upgrade pip
pip install gpt4all flask
```

## Start the local LLM server
```bash
# From apps/console
export GPT4ALL_MODEL="Mistral-7B-Instruct.Q4_0.gguf" # adjust if needed
python scripts/gpt4all_server.py
```
This starts a small HTTP server on http://127.0.0.1:5050/chat.

## Environment
The app reads LOCAL_LLM_URL from `.env` (already set):
```
LOCAL_LLM_URL="http://127.0.0.1:5050/chat"
```
Also configured for Prisma/NextAuth:
```
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="dev_secret_change_me"
```

## Run the app
In another terminal:
```bash
# From apps/console
npm run dev:llm
```
Open http://localhost:3000/demo — when you generate a demo, the app will:
- Ask the local LLM for layout (via /api/plan-layout)
- Ask the local LLM for copy (via /api/write-copy)
- Save a site JSON to generated/<id>
- Render a standalone HTML preview at /api/preview/raw/<id>

## Troubleshooting
- If the LLM server isn’t running, the app falls back to static mocks (and OpenAI for copy if OPENAI_API_KEY is set).
- First model load can take a while. Keep the terminal open; subsequent requests are faster.
- Use the dev-only "Reset demo" button on the Demo page if you hit the one-demo-per-IP/user limit.
