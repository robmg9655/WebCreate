import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import fs from 'fs';
import path from 'path';
export default async function SitePage({ params }) {
    const id = params.id;
    const file = path.join(process.cwd(), '..', '..', '..', 'generated', id, 'site.json');
    let site = null;
    try {
        const raw = fs.readFileSync(file, 'utf-8');
        site = JSON.parse(raw);
    }
    catch (e) {
        return _jsxs("div", { className: "p-6", children: ["Site not found: ", id] });
    }
    return (_jsxs("div", { className: "max-w-4xl mx-auto p-6", children: [_jsx("h1", { className: "text-2xl font-bold", children: site.title }), _jsx("pre", { className: "mt-4 bg-gray-100 p-4 rounded", children: JSON.stringify(site, null, 2) })] }));
}
