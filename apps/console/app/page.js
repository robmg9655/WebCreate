import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Link from 'next/link';
export default function Page() {
    return (_jsxs("div", { className: "max-w-4xl mx-auto", children: [_jsx("h1", { className: "text-3xl font-bold", children: "WebCreate Console" }), _jsx("p", { className: "mt-4", children: "Genera landings desde texto o voz. Demo preview a continuaci\u00F3n." }), _jsxs("div", { className: "mt-6 border p-4 rounded", children: [_jsx("h2", { className: "text-xl font-semibold", children: "Demo preview" }), _jsx("p", { className: "mt-2", children: "Ejemplo mock: Barber\u00EDa en Tabata" }), _jsx(Link, { href: "/sites/barberia-tabata", className: "mt-3 inline-block btn", children: "Ver demo" })] }), _jsx("div", { className: "mt-6", children: _jsx(Link, { href: "/generate", className: "btn", children: "Ir a /generate" }) })] }));
}
