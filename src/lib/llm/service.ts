import { llmConfig } from './config';

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMResponse {
  content: string;
  error?: string;
}

// Clean response from thinking tags (for deepseek models)
function cleanResponse(text: string): string {
  return text.replace(/<think>.*?<\/think>/gs, '').trim();
}

// Ollama API call
async function callOllama(
  systemPrompt: string,
  userMessage: string,
  signal?: AbortSignal
): Promise<LLMResponse> {
  const { baseUrl, model } = llmConfig.ollama;
  
  const response = await fetch(`${baseUrl}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      prompt: `${systemPrompt}\n\nUser: ${userMessage}\n\nAssistant:`,
      stream: false,
    }),
    signal,
  });

  if (!response.ok) {
    throw new Error(`Ollama error: ${response.status}`);
  }

  const data = await response.json();
  return { content: cleanResponse(data.response || '') };
}

// Azure OpenAI API call
async function callAzure(
  systemPrompt: string,
  userMessage: string,
  signal?: AbortSignal
): Promise<LLMResponse> {
  const { endpoint, apiKey, deployment, apiVersion } = llmConfig.azure;
  
  if (!endpoint || !apiKey) {
    throw new Error('Azure OpenAI not configured');
  }

  const url = `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': apiKey,
    },
    body: JSON.stringify({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      max_tokens: 800,
      temperature: 0.8,
    }),
    signal,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Azure OpenAI error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return { content: data.choices?.[0]?.message?.content || '' };
}

// Main LLM service function
export async function generateResponse(
  systemPrompt: string,
  userMessage: string,
  signal?: AbortSignal
): Promise<LLMResponse> {
  try {
    if (llmConfig.provider === 'azure') {
      return await callAzure(systemPrompt, userMessage, signal);
    }
    return await callOllama(systemPrompt, userMessage, signal);
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw error;
    }
    console.error('LLM error:', error);
    return {
      content: '',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Export config for external use
export { llmConfig };
