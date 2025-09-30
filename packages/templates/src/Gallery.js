import { jsx as _jsx } from "react/jsx-runtime";
export default function Gallery({ images = [] }) {
    return (_jsx("section", { "aria-label": "gallery", className: "py-8", children: _jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-2", children: images.map((src, i) => (_jsx("img", { src: src, alt: `gallery ${i + 1}`, loading: "lazy", className: "w-full h-40 object-cover rounded" }, i))) }) }));
}
