import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function Services({ items = [] }) {
    return (_jsx("section", { "aria-label": "services", className: "py-8", children: _jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: items.map((it, i) => (_jsxs("div", { className: "border rounded p-4", children: [_jsx("h3", { className: "font-semibold", children: it.title }), _jsx("p", { className: "mt-2", children: it.desc }), _jsx("div", { className: "mt-3 text-sm font-medium", children: it.price })] }, i))) }) }));
}
