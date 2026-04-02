import { Globe, Check } from 'lucide-react';

interface ProviderSelectorProps {
  value: string;
  onChange: (provider: string) => void;
}

const PROVIDERS = [
  { id: 'openrouter', name: 'OpenRouter', description: 'Multi-providers via OpenRouter' },
  { id: 'openai', name: 'OpenAI', description: 'GPT-4, GPT-3.5' },
  { id: 'anthropic', name: 'Anthropic', description: 'Claude 3.5, Claude 3' },
  { id: 'google', name: 'Google AI', description: 'Gemini Pro' },
  { id: 'mistral', name: 'Mistral AI', description: 'Mistral Large, Medium' },
  { id: 'groq', name: 'Groq', description: 'LLaMA, Mixtral (rapide)' },
  { id: 'perplexity', name: 'Perplexity', description: 'Sonar, Online' },
  { id: 'together', name: 'Together AI', description: 'LLaMA, Mixtral' },
  { id: 'deepseek', name: 'DeepSeek', description: 'DeepSeek V2, Coder' },
  { id: 'ollama', name: 'Ollama', description: 'Modèles locaux' },
  { id: 'lmstudio', name: 'LM Studio', description: 'Modèles locaux' },
  { id: 'jan', name: 'Jan', description: 'Modèles locaux' },
];

export function ProviderSelector({ value, onChange }: ProviderSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {PROVIDERS.map((provider) => (
        <button
          key={provider.id}
          onClick={() => onChange(provider.id)}
          className={`
            p-2 rounded-lg border text-left transition-all
            ${value === provider.id
              ? 'border-alecia-navy bg-alecia-navy/5'
              : 'border-alecia-silver/30 hover:border-alecia-silver'
            }
          `}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-alecia-navy">
              {provider.name}
            </span>
            {value === provider.id && (
              <Check className="w-4 h-4 text-alecia-navy" />
            )}
          </div>
          <p className="text-xs text-alecia-silver mt-0.5">
            {provider.description}
          </p>
        </button>
      ))}
    </div>
  );
}
