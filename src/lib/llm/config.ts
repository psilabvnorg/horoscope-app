// LLM Configuration
export type LLMProvider = 'ollama' | 'azure';

export interface LLMConfig {
  provider: LLMProvider;
  ollama: {
    baseUrl: string;
    model: string;
  };
  azure: {
    endpoint: string;
    apiKey: string;
    deployment: string;
    apiVersion: string;
  };
}

export const llmConfig: LLMConfig = {
  provider: (import.meta.env.VITE_LLM_PROVIDER as LLMProvider) || 'ollama',
  ollama: {
    baseUrl: import.meta.env.VITE_OLLAMA_URL || 'http://172.18.96.1:11434',
    model: import.meta.env.VITE_OLLAMA_MODEL || 'deepseek-r1:8b',
  },
  azure: {
    endpoint: import.meta.env.VITE_AZURE_OPENAI_ENDPOINT || '',
    apiKey: import.meta.env.VITE_AZURE_OPENAI_API_KEY || '',
    deployment: import.meta.env.VITE_AZURE_OPENAI_DEPLOYMENT || 'gpt-4',
    apiVersion: import.meta.env.VITE_AZURE_OPENAI_API_VERSION || '2024-02-15-preview',
  },
};
