#!/usr/bin/env python3
# Lightweight local LLM server using GPT4All
# Requires: pip install gpt4all flask
from flask import Flask, request, jsonify
from gpt4all import GPT4All
import os, sys

MODEL_ENV = os.environ.get('GPT4ALL_MODEL')
_model = None
app = Flask(__name__)

SYSTEM_DEFAULT = "You are a helpful assistant. Respond concisely."

def resolve_model_name():
    # Prefer explicit env var
    if MODEL_ENV:
        return MODEL_ENV
    # Try to pick a common working instruct model if none provided
    try:
        models = GPT4All.list_models()
        # Prefer Mistral Instruct Q4_0 gguf
        for m in models:
            fn = m.get('filename','')
            if 'Mistral' in fn and 'Instruct' in fn and 'Q4_0' in fn and fn.endswith('.gguf'):
                return fn
        # Fallback to any instruct Q4_0 gguf
        for m in models:
            fn = m.get('filename','')
            if 'Instruct' in fn and 'Q4_0' in fn and fn.endswith('.gguf'):
                return fn
        # Last resort: first gguf
        for m in models:
            fn = m.get('filename','')
            if fn.endswith('.gguf'):
                return fn
    except Exception:
        pass
    # Default guess (may download); user can override via env
    return 'Mistral-7B-Instruct-v0.2.Q4_0.gguf'

def get_model():
    global _model
    if _model is not None:
        return _model
    name = resolve_model_name()
    try:
        model_path = os.environ.get('GPT4ALL_MODEL_PATH')
        # allow_download=True by default; specify path if provided
        if model_path:
            _model = GPT4All(name, model_path=model_path)
        else:
            _model = GPT4All(name)
        return _model
    except Exception as e:
        raise RuntimeError(f"Failed to load model '{name}'. Set GPT4ALL_MODEL to a valid model filename, or GPT4ALL_MODEL_PATH to the directory containing the file. Python={sys.version}. Error: {e}")

@app.post('/chat')
def chat():
    data = request.get_json(force=True, silent=True) or {}
    prompt = data.get('prompt') or ''
    system = data.get('system') or SYSTEM_DEFAULT
    max_tokens = int(data.get('max_tokens') or 512)
    temperature = float(data.get('temperature') or 0.7)
    if not prompt:
        return jsonify({ 'error': 'missing prompt' }), 400
    try:
        model = get_model()
        with model.chat_session(system_prompt=system):
            out = model.generate(prompt, max_tokens=max_tokens, temp=temperature)
    except Exception as e:
        return jsonify({ 'error': 'model_load_failed', 'message': str(e) }), 503
    return jsonify({ 'content': out })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', '5050'))
    app.run(host='127.0.0.1', port=port)
