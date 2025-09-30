import { jsx as _jsx } from "react/jsx-runtime";
export default function Layout({ children, theme }) {
    return (_jsx("div", { style: { fontFamily: theme?.font || undefined }, className: "min-h-screen bg-white text-slate-900", children: _jsx("div", { className: "max-w-4xl mx-auto p-6", children: children }) }));
}
