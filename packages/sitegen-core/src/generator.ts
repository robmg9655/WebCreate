import { Layout } from './layoutSchema';
import { defaultTheme } from './theme';

// Use a generic for copy so we avoid `any` while remaining flexible for different copy shapes.
export function assemble<TCopy extends Record<string, unknown> = Record<string, unknown>>(
  layout: Layout,
  copy: TCopy,
  theme: Partial<typeof defaultTheme> = {}
) {
  return { layout, copy, theme: { ...defaultTheme, ...theme } } as { layout: Layout; copy: TCopy; theme: typeof defaultTheme };
}
