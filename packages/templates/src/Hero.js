import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function Hero({ title, subtitle, cta }) {
    return (_jsxs("section", { "aria-label": "hero", className: "py-12 text-center", children: [_jsx("h1", { className: "text-4xl font-bold", children: title }), _jsx("p", { className: "mt-2 text-lg", children: subtitle }), _jsx("button", { className: "mt-4 px-4 py-2 bg-teal-500 text-white rounded", children: cta })] }));
}
