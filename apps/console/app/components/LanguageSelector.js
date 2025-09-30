import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function LanguageSelector() {
    return (_jsxs("div", { children: [_jsx("label", { htmlFor: "locale", className: "sr-only", children: "Language" }), _jsxs("select", { id: "locale", defaultValue: "en", className: "border rounded p-1", children: [_jsx("option", { value: "en", children: "EN" }), _jsx("option", { value: "jp", children: "JP" })] })] }));
}
