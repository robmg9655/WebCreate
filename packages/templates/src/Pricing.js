import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function Pricing({ plans = [] }) {
    return (_jsx("section", { "aria-label": "pricing", className: "py-8", children: _jsx("div", { className: "grid md:grid-cols-3 gap-4", children: plans.map((p, i) => (_jsxs("div", { className: "border rounded p-4", children: [_jsx("h3", { className: "font-bold", children: p.name }), _jsx("div", { className: "mt-2 text-2xl", children: p.price }), _jsx("p", { className: "mt-2", children: p.desc })] }, i))) }) }));
}
