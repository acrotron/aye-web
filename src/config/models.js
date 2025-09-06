// config/models.js

export const AVAILABLE_MODELS = [
    { id: 'openai/gpt-oss-120b', name: 'GPT OSS 120b' },
    { id: 'meta-llama/Llama-4-Maverick-17B-128E-Instruct', name: 'LLaMa-4-Maverick-Instruct' },
/*
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

