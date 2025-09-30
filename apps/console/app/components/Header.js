import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Link from 'next/link';
import LanguageSelector from './LanguageSelector';
export default function Header() {
    return (_jsx("header", { className: "w-full bg-white shadow-sm", children: _jsxs("div", { className: "max-w-4xl mx-auto p-4 flex items-center justify-between", children: [_jsx(Link, { href: "/", children: "WebCreate" }), _jsxs("nav", { className: "space-x-4", children: [_jsx(Link, { href: "/generate", children: "Generate" }), _jsx(Link, { href: "/sites/barberia-tabata", children: "Demo" })] }), _jsx(LanguageSelector, {})] }) }));
}
