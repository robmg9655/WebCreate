"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
export default function GeneratePage() {
    const [text, setText] = useState('');
    const [status, setStatus] = useState('');
    async function onGenerate(e) {
        e.preventDefault();
        setStatus('Generating...');
        const res = await fetch('/api/plan-layout', { method: 'POST', body: JSON.stringify({ text }) });
        const layout = await res.json();
        const w = await fetch('/api/write-copy', { method: 'POST', body: JSON.stringify({ layout }) });
        const copy = await w.json();
        const s = await fetch('/api/scaffold', { method: 'POST', body: JSON.stringify({ layout, copy, slug: 'demo-site' }) });
        const result = await s.json();
        setStatus('Done: ' + result.path);
    }
    return (_jsxs("div", { className: "max-w-3xl mx-auto", children: [_jsx("h1", { className: "text-2xl font-bold", children: "Generate" }), _jsxs("form", { onSubmit: onGenerate, className: "mt-4 space-y-3", children: [_jsxs("label", { className: "block", children: [_jsx("span", { className: "text-sm", children: "Description (JP/EN/ES)" }), _jsx("textarea", { className: "w-full border rounded p-2 mt-1", value: text, onChange: (e) => setText(e.target.value) })] }), _jsxs("label", { className: "block", children: [_jsx("span", { className: "text-sm", children: "Audio upload" }), _jsx("input", { type: "file", name: "audio", accept: "audio/*" })] }), _jsx("div", { children: _jsx("button", { className: "btn", type: "submit", children: "Generar" }) })] }), _jsx("p", { className: "mt-4", children: status })] }));
}
