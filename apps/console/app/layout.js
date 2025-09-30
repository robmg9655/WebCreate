import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import './globals.css';
import Header from './components/Header';
export const metadata = {
    title: 'WebCreate Console',
    description: 'Generate landing pages from descriptions (JP/EN)'
};
export default async function RootLayout({ children, params }) {
    const locale = params?.locale || 'en';
    return (_jsx("html", { lang: locale, children: _jsxs("body", { children: [_jsx(Header, {}), _jsx("main", { className: "p-6", children: children })] }) }));
}
