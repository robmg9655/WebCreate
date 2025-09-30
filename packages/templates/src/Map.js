import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function Map({ address }) {
    const q = encodeURIComponent(address || 'Tokyo, Japan');
    const src = `https://www.google.com/maps?q=${q}&output=embed`;
    return (_jsxs("section", { "aria-label": "map", className: "py-8", children: [_jsx("div", { style: { height: 300 }, className: "w-full", children: _jsx("iframe", { title: "map", src: src, className: "w-full h-full" }) }), _jsx("script", { type: "application/ld+json", dangerouslySetInnerHTML: { __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'LocalBusiness',
                        address: address
                    }) } })] }));
}
