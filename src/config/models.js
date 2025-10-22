// config/models.js

export const AVAILABLE_MODELS = [
    { id: 'openai/gpt-oss-120b', name: 'OpenAI: GPT OSS 120b' },
    { id: 'x-ai/grok-code-fast-1', name: 'xAI: Grok Code Fast 1' },
    { id: 'x-ai/grok-4-fast', name: 'xAI: Grok 4 Fast' },
    { id: 'qwen/qwen3-coder', name: 'Qwen: Qwen3 Coder' },
    { id: 'deepseek/deepseek-chat-v3-0324', name: 'DeepSeek: DeepSeek V3 0324' },
    { id: 'google/gemini-2.0-flash-001', name: 'Google: Gemini 2.0 Flash' },
/*
 * Expensive ones
    { id: 'moonshotai/kimi-k2-0905', name: 'MoonshotAI: Kimi K2 0905' },
    { id: 'anthropic/claude-sonnet-4.5', name: 'Anthropic: Claude Sonnet 4.5' },
    { id: 'google/gemini-2.5-flash', name: 'Google: Gemini 2.5 Flash' },
    { id: 'anthropic/claude-sonnet-4', name: 'Anthropic: Claude Sonnet 4' },
    { id: 'google/gemini-2.5-pro', name: 'Google: Gemini 2.5 Pro' },
    { id: 'z-ai/glm-4.6', name: 'Z.AI: GLM 4.6' },
    { id: 'openai/gpt-5', name: 'OpenAI: GPT-5' },
    { id: 'qwen/qwen3-coder-plus', name: 'Qwen: Qwen3 Coder Plus' },
 *
 *
 * HuggingFace
    { id: 'meta-llama/Llama-4-Maverick-17B-128E-Instruct', name: 'LLaMa-4-Maverick-Instruct' },
    { id: 'Qwen/Qwen3-Coder-480B-A35B-Instruct', name: 'Qwen3-Coder-480B-A35B-Instruct' },
    { id: 'openai/gpt-oss-20b', name: 'GPT OSS 20b' },
  { 
    id: 'openai/gpt-oss-120b', 
    name: 'GPT-OSS-120b',
    provider: 'openai',
    description: 'OpenAI open source 120b model'
  },
  { 
    id: 'gpt-4o', 
    name: 'GPT-4o',
    provider: 'openai',
    description: 'Most capable OpenAI model'
  },
  { 
    id: 'gpt-4o-mini', 
    name: 'GPT-4o Mini',
    provider: 'openai',
    description: 'Faster, cost-effective OpenAI model'
  },
  { 
    id: 'claude-3-5-sonnet', 
    name: 'Claude 3.5 Sonnet',
    provider: 'anthropic',
    description: 'Balanced Claude model for most tasks'
  },
  { 
    id: 'claude-3-5-haiku', 
    name: 'Claude 3.5 Haiku',
    provider: 'anthropic',
    description: 'Fast and efficient Claude model'
  },
  { 
    id: 'gemini-pro', 
    name: 'Gemini Pro',
    provider: 'google',
    description: 'Google\'s advanced language model'
  },
*/
];

export const DEFAULT_MODEL = 'openai/gpt-oss-120b';

