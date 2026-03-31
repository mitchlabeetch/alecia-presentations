import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

const PROVIDERS = [
  { id: "convex_builtin", name: "PitchForge IA (intégré)", description: "GPT-4.1-nano via Convex — aucune config requise", icon: "✨", badge: "Gratuit", badgeColor: "bg-emerald-100 text-emerald-700", defaultModel: "gpt-4.1-nano", defaultUrl: "", format: "openai", requiresKey: false, models: ["gpt-4.1-nano", "gpt-4o-mini"], docs: "" },
  { id: "openai", name: "OpenAI", description: "GPT-4o, GPT-4.1, o3-mini, o1...", icon: "🤖", badge: "Populaire", badgeColor: "bg-blue-100 text-blue-700", defaultModel: "gpt-4o-mini", defaultUrl: "https://api.openai.com/v1", format: "openai", requiresKey: true, models: ["gpt-4.1", "gpt-4.1-mini", "gpt-4o", "gpt-4o-mini", "o3-mini", "o1-mini", "gpt-4-turbo"], docs: "https://platform.openai.com/api-keys" },
  { id: "anthropic", name: "Anthropic Claude", description: "Claude 3.7 Sonnet, Claude 3.5 Haiku...", icon: "🧠", badge: "", badgeColor: "", defaultModel: "claude-3-7-sonnet-20250219", defaultUrl: "https://api.anthropic.com/v1", format: "anthropic", requiresKey: true, models: ["claude-3-7-sonnet-20250219", "claude-3-5-sonnet-20241022", "claude-3-5-haiku-20241022", "claude-3-opus-20240229"], docs: "https://console.anthropic.com/" },
  { id: "xai", name: "xAI Grok", description: "Grok-3, Grok-2 — modèles xAI", icon: "𝕏", badge: "Nouveau", badgeColor: "bg-gray-100 text-gray-700", defaultModel: "grok-3-latest", defaultUrl: "https://api.x.ai/v1", format: "openai", requiresKey: true, models: ["grok-3-latest", "grok-2-latest", "grok-2-mini"], docs: "https://console.x.ai/" },
  { id: "google", name: "Google Gemini", description: "Gemini 2.0 Flash, Gemini 1.5 Pro...", icon: "🌈", badge: "", badgeColor: "", defaultModel: "gemini-2.0-flash", defaultUrl: "https://generativelanguage.googleapis.com/v1beta/openai", format: "openai", requiresKey: true, models: ["gemini-2.0-flash", "gemini-2.0-flash-lite", "gemini-1.5-pro", "gemini-1.5-flash"], docs: "https://aistudio.google.com/" },
  { id: "mistral", name: "Mistral AI", description: "Mistral Large, Codestral, Mixtral...", icon: "🌪️", badge: "Français", badgeColor: "bg-indigo-100 text-indigo-700", defaultModel: "mistral-large-latest", defaultUrl: "https://api.mistral.ai/v1", format: "openai", requiresKey: true, models: ["mistral-large-latest", "mistral-medium-latest", "mistral-small-latest", "codestral-latest", "open-mixtral-8x7b"], docs: "https://console.mistral.ai/" },
  { id: "groq", name: "Groq", description: "Llama 3.3 70B, Mixtral — ultra-rapide", icon: "⚡", badge: "Rapide", badgeColor: "bg-amber-100 text-amber-700", defaultModel: "llama-3.3-70b-versatile", defaultUrl: "https://api.groq.com/openai/v1", format: "openai", requiresKey: true, models: ["llama-3.3-70b-versatile", "llama-3.1-8b-instant", "mixtral-8x7b-32768", "gemma2-9b-it"], docs: "https://console.groq.com/" },
  { id: "cerebras", name: "Cerebras", description: "Llama 3.3 70B — wafer-scale ultra-rapide", icon: "🧬", badge: "Ultra-rapide", badgeColor: "bg-violet-100 text-violet-700", defaultModel: "llama-3.3-70b", defaultUrl: "https://api.cerebras.ai/v1", format: "openai", requiresKey: true, models: ["llama-3.3-70b", "llama-3.1-8b"], docs: "https://cloud.cerebras.ai/" },
  { id: "perplexity", name: "Perplexity AI", description: "Sonar Pro — recherche web en temps réel", icon: "🔎", badge: "Web", badgeColor: "bg-teal-100 text-teal-700", defaultModel: "sonar-pro", defaultUrl: "https://api.perplexity.ai", format: "openai", requiresKey: true, models: ["sonar-pro", "sonar", "sonar-reasoning-pro"], docs: "https://www.perplexity.ai/settings/api" },
  { id: "together", name: "Together AI", description: "Llama, Qwen, DeepSeek — open source", icon: "🔗", badge: "", badgeColor: "", defaultModel: "meta-llama/Llama-3.3-70B-Instruct-Turbo", defaultUrl: "https://api.together.xyz/v1", format: "openai", requiresKey: true, models: ["meta-llama/Llama-3.3-70B-Instruct-Turbo", "Qwen/Qwen2.5-72B-Instruct-Turbo", "deepseek-ai/DeepSeek-V3"], docs: "https://api.together.ai/" },
  { id: "fireworks", name: "Fireworks AI", description: "Llama, Mixtral, Qwen — inférence rapide", icon: "🎆", badge: "Rapide", badgeColor: "bg-orange-100 text-orange-700", defaultModel: "accounts/fireworks/models/llama-v3p3-70b-instruct", defaultUrl: "https://api.fireworks.ai/inference/v1", format: "openai", requiresKey: true, models: ["accounts/fireworks/models/llama-v3p3-70b-instruct", "accounts/fireworks/models/mixtral-8x22b-instruct"], docs: "https://fireworks.ai/" },
  { id: "deepseek", name: "DeepSeek", description: "DeepSeek-V3, DeepSeek-R1 — très performant", icon: "🔭", badge: "Économique", badgeColor: "bg-purple-100 text-purple-700", defaultModel: "deepseek-chat", defaultUrl: "https://api.deepseek.com/v1", format: "openai", requiresKey: true, models: ["deepseek-chat", "deepseek-reasoner"], docs: "https://platform.deepseek.com/" },
  { id: "azure", name: "Azure OpenAI", description: "OpenAI via Microsoft Azure — entreprise", icon: "☁️", badge: "Entreprise", badgeColor: "bg-sky-100 text-sky-700", defaultModel: "gpt-4o", defaultUrl: "https://YOUR_RESOURCE.openai.azure.com/openai/deployments/YOUR_DEPLOYMENT", format: "openai", requiresKey: true, models: ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo"], docs: "https://portal.azure.com/" },
  { id: "cohere", name: "Cohere", description: "Command R+, Command R — optimisé RAG", icon: "🎯", badge: "", badgeColor: "", defaultModel: "command-r-plus", defaultUrl: "https://api.cohere.com/compatibility/v1", format: "openai", requiresKey: true, models: ["command-r-plus", "command-r", "command-light"], docs: "https://dashboard.cohere.com/" },
  { id: "nvidia", name: "NVIDIA NIM", description: "Llama, Mistral via NVIDIA Cloud", icon: "🟢", badge: "", badgeColor: "", defaultModel: "meta/llama-3.3-70b-instruct", defaultUrl: "https://integrate.api.nvidia.com/v1", format: "openai", requiresKey: true, models: ["meta/llama-3.3-70b-instruct", "mistralai/mistral-large-2-instruct", "google/gemma-3-27b-it"], docs: "https://build.nvidia.com/" },
  { id: "openrouter", name: "OpenRouter", description: "Accès unifié à 200+ modèles IA", icon: "🌐", badge: "Multi-modèles", badgeColor: "bg-rose-100 text-rose-700", defaultModel: "anthropic/claude-3.5-sonnet", defaultUrl: "https://openrouter.ai/api/v1", format: "openai", requiresKey: true, models: ["anthropic/claude-3.5-sonnet", "openai/gpt-4o", "google/gemini-2.0-flash", "meta-llama/llama-3.3-70b-instruct"], docs: "https://openrouter.ai/keys" },
  { id: "huggingface", name: "HuggingFace Inference", description: "Accès aux modèles open source HF", icon: "🤗", badge: "", badgeColor: "", defaultModel: "meta-llama/Llama-3.3-70B-Instruct", defaultUrl: "https://api-inference.huggingface.co/v1", format: "openai", requiresKey: true, models: ["meta-llama/Llama-3.3-70B-Instruct", "Qwen/Qwen2.5-72B-Instruct", "mistralai/Mistral-7B-Instruct-v0.3"], docs: "https://huggingface.co/settings/tokens" },
  { id: "ollama", name: "Ollama (local)", description: "Llama, Mistral, Gemma en local — 100% privé", icon: "🦙", badge: "Privé", badgeColor: "bg-green-100 text-green-700", defaultModel: "llama3.2", defaultUrl: "http://localhost:11434/v1", format: "openai", requiresKey: false, models: ["llama3.2", "llama3.1", "mistral", "gemma2", "phi3", "qwen2.5", "deepseek-r1"], docs: "https://ollama.ai/" },
  { id: "lmstudio", name: "LM Studio (local)", description: "Interface locale pour modèles GGUF — privé", icon: "🖥️", badge: "Privé", badgeColor: "bg-green-100 text-green-700", defaultModel: "local-model", defaultUrl: "http://localhost:1234/v1", format: "openai", requiresKey: false, models: ["local-model"], docs: "https://lmstudio.ai/" },
  { id: "jan", name: "Jan (local)", description: "Application locale open source — 100% privé", icon: "🏠", badge: "Privé", badgeColor: "bg-green-100 text-green-700", defaultModel: "local-model", defaultUrl: "http://localhost:1337/v1", format: "openai", requiresKey: false, models: ["local-model"], docs: "https://jan.ai/" },
  { id: "custom", name: "Fournisseur personnalisé", description: "Tout endpoint compatible OpenAI API", icon: "⚙️", badge: "", badgeColor: "", defaultModel: "", defaultUrl: "", format: "openai", requiresKey: true, models: [], docs: "" },
];

export function AISettingsPanel() {
  const settings = useQuery(api.aiSettings.get);
  const saveSettings = useMutation(api.aiSettings.save);

  const [provider, setProvider] = useState("convex_builtin");
  const [baseUrl, setBaseUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("gpt-4.1-nano");
  const [apiFormat, setApiFormat] = useState("openai");
  const [systemPromptExtra, setSystemPromptExtra] = useState("");
  const [saving, setSaving] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (settings) {
      setProvider(settings.provider);
      setBaseUrl(settings.baseUrl ?? "");
      setApiKey(settings.apiKey ?? "");
      setModel(settings.model);
      setApiFormat(settings.apiFormat);
      setSystemPromptExtra(settings.systemPromptExtra ?? "");
    }
  }, [settings?._id]);

  function handleProviderChange(pid: string) {
    setProvider(pid);
    const p = PROVIDERS.find(p => p.id === pid);
    if (p) {
      if (p.defaultModel) setModel(p.defaultModel);
      if (p.defaultUrl) setBaseUrl(p.defaultUrl);
      setApiFormat(p.format);
      if (!p.requiresKey) setApiKey("");
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      await saveSettings({ provider, baseUrl: baseUrl || undefined, apiKey: apiKey || undefined, model, apiFormat, systemPromptExtra: systemPromptExtra || undefined });
      toast.success("Configuration IA sauvegardée");
    } catch {
      toast.error("Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  }

  const selectedProvider = PROVIDERS.find(p => p.id === provider);
  const needsConfig = provider !== "convex_builtin";
  const isConfigured = provider === "convex_builtin" || (model && (baseUrl || !selectedProvider?.requiresKey));

  const filteredProviders = search
    ? PROVIDERS.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase()))
    : PROVIDERS;

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
        <p className="text-xs font-semibold text-[#1a3a5c]">🤖 Fournisseur IA</p>
        <p className="text-xs text-gray-400 mt-0.5">{PROVIDERS.length} fournisseurs disponibles</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Search */}
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher un fournisseur..."
          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs focus:outline-none focus:border-[#1a3a5c] transition-colors"
        />

        {/* Provider list */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
            Fournisseur ({filteredProviders.length})
          </label>
          <div className="space-y-1.5">
            {filteredProviders.map(p => (
              <button
                key={p.id}
                onClick={() => handleProviderChange(p.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all ${provider === p.id ? "border-[#1a3a5c] bg-[#1a3a5c]/5 shadow-sm" : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"}`}
              >
                <span className="text-base flex-shrink-0 w-6 text-center">{p.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-semibold text-gray-700">{p.name}</p>
                    {p.badge && (
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${p.badgeColor}`}>{p.badge}</span>
                    )}
                  </div>
                  <p className="text-[10px] text-gray-400 truncate">{p.description}</p>
                </div>
                {provider === p.id && <span className="text-[#1a3a5c] text-xs flex-shrink-0 font-bold">✓</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Config fields */}
        {needsConfig && (
          <div className="space-y-3 p-3.5 rounded-xl bg-gray-50 border border-gray-200">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-gray-600 flex items-center gap-1.5">
                <span>{selectedProvider?.icon}</span>
                <span>Configuration {selectedProvider?.name}</span>
              </h4>
              {selectedProvider?.docs && (
                <a href={selectedProvider.docs} target="_blank" rel="noopener noreferrer"
                  className="text-[10px] text-[#1a3a5c] hover:underline">Docs ↗</a>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">URL de base <span className="text-red-400">*</span></label>
              <input value={baseUrl} onChange={e => setBaseUrl(e.target.value)}
                placeholder={selectedProvider?.defaultUrl || "https://api.example.com/v1"}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs focus:outline-none focus:border-[#1a3a5c] font-mono bg-white transition-colors" />
            </div>

            {selectedProvider?.requiresKey && (
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Clé API <span className="text-red-400">*</span></label>
                <div className="relative">
                  <input type={showKey ? "text" : "password"} value={apiKey} onChange={e => setApiKey(e.target.value)}
                    placeholder="sk-..."
                    className="w-full px-3 py-2 pr-9 rounded-lg border border-gray-200 text-xs focus:outline-none focus:border-[#1a3a5c] font-mono bg-white transition-colors" />
                  <button onClick={() => setShowKey(s => !s)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs" type="button">
                    {showKey ? "🙈" : "👁"}
                  </button>
                </div>
                <p className="text-[10px] text-gray-400 mt-0.5">Stockée de façon sécurisée dans votre compte</p>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Modèle <span className="text-red-400">*</span></label>
              {selectedProvider?.models && selectedProvider.models.length > 0 ? (
                <select value={model} onChange={e => setModel(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs focus:outline-none focus:border-[#1a3a5c] bg-white transition-colors">
                  {selectedProvider.models.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              ) : (
                <input value={model} onChange={e => setModel(e.target.value)} placeholder="nom-du-modèle"
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs focus:outline-none focus:border-[#1a3a5c] font-mono bg-white transition-colors" />
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Format API</label>
              <select value={apiFormat} onChange={e => setApiFormat(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs focus:outline-none focus:border-[#1a3a5c] bg-white transition-colors">
                <option value="openai">OpenAI Chat Completions (compatible)</option>
                <option value="anthropic">Anthropic Messages API</option>
              </select>
            </div>
          </div>
        )}

        {/* Builtin model selector */}
        {provider === "convex_builtin" && (
          <div className="space-y-2 p-3.5 rounded-xl bg-emerald-50 border border-emerald-100">
            <label className="block text-xs font-medium text-emerald-700 mb-1">Modèle intégré</label>
            <select value={model} onChange={e => setModel(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-emerald-200 text-xs focus:outline-none focus:border-emerald-500 bg-white transition-colors">
              <option value="gpt-4.1-nano">GPT-4.1-nano (rapide, économique)</option>
              <option value="gpt-4o-mini">GPT-4o-mini (plus puissant)</option>
            </select>
          </div>
        )}

        {/* System prompt */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Instructions supplémentaires</label>
          <textarea value={systemPromptExtra} onChange={e => setSystemPromptExtra(e.target.value)} rows={4}
            placeholder="Ex: Toujours inclure des données chiffrées. Utiliser un ton formel. Cibler des acquéreurs industriels européens..."
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs focus:outline-none focus:border-[#1a3a5c] resize-none transition-colors" />
          <p className="text-[10px] text-gray-400 mt-1">Ces instructions s'ajoutent au prompt système de base.</p>
        </div>

        {/* Status */}
        <div className={`p-3 rounded-xl text-xs flex items-start gap-2 ${isConfigured ? "bg-emerald-50 border border-emerald-100 text-emerald-700" : "bg-amber-50 border border-amber-100 text-amber-700"}`}>
          <span className="flex-shrink-0 mt-0.5">{isConfigured ? "✓" : "⚠"}</span>
          <div>
            {provider === "convex_builtin"
              ? <><strong>Prêt</strong> — Utilise le crédit IA intégré PitchForge ({model})</>
              : isConfigured
                ? <><strong>Configuré</strong> — {selectedProvider?.name} · {model}</>
                : <><strong>Configuration incomplète</strong> — URL de base, clé API et modèle requis</>
            }
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-gray-100">
        <button onClick={handleSave} disabled={saving || (needsConfig && !model)}
          className="w-full px-4 py-2.5 rounded-xl bg-[#1a3a5c] text-white text-xs font-semibold hover:bg-[#1a3a5c]/90 disabled:opacity-50 transition-colors">
          {saving ? "Sauvegarde en cours..." : "Sauvegarder la configuration"}
        </button>
      </div>
    </div>
  );
}
