export class MockProvider {
    async generate(prompt) {
        return { text: 'MOCK: generated content for prompt: ' + prompt.slice(0, 80) };
    }
}
export function getProvider() {
    const p = process.env.LLM_PROVIDER || 'mock';
    if (p === 'mock')
        return new MockProvider();
    // placeholder for openai/anthropic
    return new MockProvider();
}
