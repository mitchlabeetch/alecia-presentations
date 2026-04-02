import { useState } from 'react';
import { Save, RotateCcw, Globe, Cpu, MessageSquare } from 'lucide-react';
import { ProviderSelector } from './ProviderSelector';

const SYSTEM_PROMPT_DEFAULT = `Tu es un expert en M&A pour PME et ETI françaises. Tu travailles pour alecia, un cabinet de conseil financier indépendant. Tu aides à créer des pitch decks professionnels pour des opérations de cession, levée de fonds, et acquisition.

Réponds toujours en français. Utilise la terminologie M&A française standard.

Tu peux générer des slides en utilisant le format JSON suivant:
\`\`\`slides
[
  {
    "type": "Titre",
    "title": "Titre du slide",
    "content": "..."
  }
]
\`\`\``;

export function AISettings() {
  const [provider, setProvider] = useState('openrouter');
  const [model, setModel] = useState('anthropic/claude-3.5-sonnet');
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(2000);
  const [systemPrompt, setSystemPrompt] = useState(SYSTEM_PROMPT_DEFAULT);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await fetch('/api/ai/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider,
          model,
          temperature,
          maxTokens,
          systemPrompt,
        }),
      });
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setProvider('openrouter');
    setModel('anthropic/claude-3.5-sonnet');
    setTemperature(0.7);
    setMaxTokens(2000);
    setSystemPrompt(SYSTEM_PROMPT_DEFAULT);
  };

  return (
    <div className="space-y-6">
      <div>
        <h4 className="font-semibold text-alecia-navy mb-4 flex items-center gap-2">
          <Cpu className="w-5 h-5" />
          Configuration IA
        </h4>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-alecia-navy mb-1">
              Provider
            </label>
            <ProviderSelector value={provider} onChange={setProvider} />
          </div>

          <div>
            <label className="block text-sm font-medium text-alecia-navy mb-1">
              Modèle
            </label>
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="alecia-input"
              placeholder="anthropic/claude-3.5-sonnet"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-alecia-navy mb-1">
              Température: {temperature.toFixed(1)}
            </label>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-full accent-alecia-navy"
            />
            <div className="flex justify-between text-xs text-alecia-silver mt-1">
              <span>Précis</span>
              <span>Créatif</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-alecia-navy mb-1">
              Tokens max
            </label>
            <input
              type="number"
              value={maxTokens}
              onChange={(e) => setMaxTokens(parseInt(e.target.value) || 1000)}
              min={100}
              max={10000}
              step={100}
              className="alecia-input"
            />
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-alecia-navy mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Prompt système
        </h4>
        <textarea
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
          rows={8}
          className="alecia-input font-mono text-sm"
          placeholder="Instructions pour l'assistant IA..."
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex-1 alecia-btn-primary flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />
          Enregistrer
        </button>
        <button
          onClick={handleReset}
          className="alecia-btn-secondary flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Réinitialiser
        </button>
      </div>
    </div>
  );
}
