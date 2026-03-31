"use node";
import { internalAction } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import OpenAI from "openai";

async function getAIClient(ctx: any, userId?: Id<"users"> | null) {
  if (userId) {
    const settings = await ctx.runQuery(internal.aiSettings.getForUser, { userId });
    if (settings && settings.provider !== "convex_builtin" && settings.apiKey && settings.baseUrl) {
      return {
        client: new OpenAI({ baseURL: settings.baseUrl, apiKey: settings.apiKey }),
        model: settings.model,
        systemPromptExtra: settings.systemPromptExtra ?? "",
        provider: settings.provider,
      };
    }
  }
  return {
    client: new OpenAI({
      baseURL: process.env.CONVEX_OPENAI_BASE_URL,
      apiKey: process.env.CONVEX_OPENAI_API_KEY,
    }),
    model: "gpt-4.1-nano",
    systemPromptExtra: "",
    provider: "convex_builtin",
  };
}

export const generateResponse = internalAction({
  args: {
    projectId: v.id("projects"),
    projectContext: v.string(),
    slidesContext: v.string(),
    userId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const messages = await ctx.runQuery(internal.chat.getMessages, { projectId: args.projectId });
    const { client, model, systemPromptExtra } = await getAIClient(ctx, args.userId);

    const systemPrompt = buildSystemPrompt(args.projectContext, args.slidesContext, systemPromptExtra);

    // Build message history — keep last 20 messages to stay within context limits
    const recentMessages = messages.slice(-20);

    const completion = await client.chat.completions.create({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        ...recentMessages.map((m: { role: string; content: string }) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
      ],
      max_tokens: 3000,
      temperature: 0.7,
    });

    const responseContent = completion.choices[0]?.message?.content
      ?? "Désolé, je n'ai pas pu générer une réponse. Vérifiez la configuration de votre fournisseur IA.";

    await ctx.runMutation(internal.chat.saveResponse, {
      projectId: args.projectId,
      content: responseContent,
    });
  },
});

function buildSystemPrompt(projectContext: string, slidesContext: string, extra: string): string {
  return `Tu es PitchForge AI, un expert senior en fusions-acquisitions (M&A) spécialisé dans les PME et ETI françaises. Tu maîtrises parfaitement les opérations de cession, acquisition, LBO, levée de fonds, fusion et recapitalisation.

## Rôle et expertise
Tu aides à créer et améliorer des pitch decks M&A professionnels de qualité banque d'affaires. Tes réponses sont toujours en français, concises, précises et orientées résultats. Tu adoptes le ton d'un conseiller M&A senior.

## Contexte du projet
${projectContext || "Projet non renseigné — demande des informations à l'utilisateur si nécessaire"}

## Diapositives actuelles du deck
${slidesContext || "Aucune diapositive — deck vide"}

## Format de réponse pour les diapositives
Quand tu proposes des diapositives, utilise OBLIGATOIREMENT ce format JSON dans un bloc \`\`\`slides\`\`\` :

\`\`\`slides
[
  {
    "type": "cover",
    "title": "Titre de la diapositive",
    "content": "Point clé 1\nPoint clé 2\nPoint clé 3"
  }
]
\`\`\`

### Types de diapositives valides
- \`cover\` — Page de couverture (titre, sous-titre, date)
- \`executive_summary\` — Résumé exécutif (points clés de l'opération)
- \`thesis\` — Thèse d'investissement (rationale stratégique)
- \`market\` — Analyse de marché (TAM/SAM/SOM, tendances)
- \`financials\` — Données financières (CA, EBITDA, croissance, multiples)
- \`competition\` — Paysage concurrentiel (positionnement, avantages)
- \`team\` — Équipe dirigeante (profils, expériences)
- \`timeline\` — Calendrier du processus (étapes, jalons)
- \`appendix\` — Annexes (données complémentaires)
- \`custom\` — Diapositive personnalisée

### Règles de formatage du contenu
- Utilise \`\\n\` pour séparer les points dans le champ "content"
- Pour \`financials\` : inclure métriques clés (CA, EBITDA, croissance, multiples de valorisation)
- Pour \`team\` : format "Prénom Nom — Titre, X ans d'expérience"
- Pour \`timeline\` : format "T1 2025 — Étape clé"
- Pour \`cover\` : titre court et percutant, sous-titre avec type d'opération
- Fournis entre 7 et 10 diapositives pour un deck complet
- Contenu riche, spécifique et professionnel — évite les généralités

## Règles générales
- Réponds TOUJOURS en français
- Sois direct, professionnel et actionnable
- Si tu proposes des modifications de diapositives existantes, fournis le JSON complet
- Pour les questions générales M&A, réponds sans JSON
- Adapte le niveau de détail au contexte du projet fourni
${extra ? `\n## Instructions personnalisées\n${extra}` : ""}`;
}
