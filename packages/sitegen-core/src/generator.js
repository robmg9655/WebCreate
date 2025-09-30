import { defaultTheme } from './theme';
// Use a generic for copy so we avoid `any` while remaining flexible for different copy shapes.
export function assemble(layout, copy, theme = {}) {
    return { layout, copy, theme: { ...defaultTheme, ...theme } };
}
