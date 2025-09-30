export type LLMResponse = { text: string; raw?: unknown };

export interface LLMProvider {
  generate(prompt: string, opts?: Record<string, unknown>): Promise<LLMResponse>;
}

export class MockProvider implements LLMProvider {
  async generate(prompt: string) {
    return { text: 'MOCK: generated content for prompt: ' + prompt.slice(0, 80) };
  }
}

export function getProvider(): LLMProvider {
  const p = process.env.LLM_PROVIDER || 'mock';
  if (p === 'mock') return new MockProvider();
  // placeholder for openai/anthropic
  return new MockProvider();
}
