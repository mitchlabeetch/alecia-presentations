"use node";
import { internalAction } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import OpenAI from "openai";

/**
 * AI Chat Actions for PitchForge M&A Presentation Generator
 *
 * Features:
 * - Deck Brief → Full Deck generation
 * - Context-aware slide suggestions
 * - Content enhancement (polish/shorten/expand)
 * - Executive summary generation
 * - Talking points generation
 * - Slide sequence suggestions
 * - Multi-provider support (OpenAI, Anthropic, Azure, AWS Bedrock)
 */

interface AIProviderConfig {
  client: OpenAI;
  model: string;
  systemPromptExtra: string;
  provider: string;
}

interface DeckBriefInput {
  clientName: string;
  clientSector: string;
  dealType: string;
  keyMetrics?: {
    revenue?: number;
    ebitda?: number;
    growth?: number;
    multiple?: number;
  };
  teamSize?: number;
  yearFounded?: number;
  transactionRationale?: string;
}

/**
 * Get AI client based on user settings or default
 */
async function getAIClient(
  ctx: any,
  userId?: Id<"users"> | null,
): Promise<AIProviderConfig> {
  if (userId) {
    const settings = await ctx.runQuery(internal.aiSettings.getForUser, {
      userId,
    });
    if (
      settings &&
      settings.provider !== "convex_builtin" &&
      settings.apiKey &&
      settings.baseUrl
    ) {
      return {
        client: new OpenAI({
          baseURL: settings.baseUrl,
          apiKey: settings.apiKey,
        }),
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

/**
 * Build M&A expert system prompt
 */
function buildSystemPrompt(
  projectContext: string,
  slidesContext: string,
  extra: string,
): string {
  return `Tu es PitchForge AI, un expert senior en fusions-acquisitions (M&A) spécialisé dans les PME et ETI françaises. Tu maîtrises parfaitement les opérations de cession, acquisition, LBO, levée de fonds, fusion, recapitalisation et IPO.

## Rôle et expertise
Tu aides à créer et améliorer des pitch decks M&A professionnels de qualité banque d'affaires. Tes réponses sont toujours en français, concises, précises et orientées résultats. Tu adoptes le ton d'un conseiller M&A senior.

## Contexte du projet
${projectContext || "Projet non renseigné — demande des informations à l'utilisateur si nécessaire"}

## Diapositives actuelles du deck
${slidesContext || "Aucune diapositive — deck vide"}

## Capacités Spéciales

### 1. Génération de Deck Complet depuis Brief
Quand l'utilisateur fournit un brief complet (nom client, secteur, type d'opération, métriques clés), génère un deck M&A complet de 7-10 diapositives.

### 2. Suggestions Contextuelles
Détecte automatiquement :
- Données financières → suggère des slides KPIs, graphiques, tableaux
- Mentions d'équipe → suggère slide équipe dirigeante
- Données marché → suggère analyse TAM/SAM/SOM
- Processus → suggère timeline/calendrier

### 3. Amélioration de Contenu Existant
- "polish" : Rend le texte plus professionnel et percutant
- "shorten" : Réduit à l'essentiel (3-5 points max)
- "expand" : Enrichit avec détails et arguments

### 4. Génération de Résumé Exécutif
Analyse toutes les slides et génère un résumé exécutif de 1 page.

### 5. Points de Discussion
Génère des talking points pour chaque slide (3-5 points par slide).

## Format de réponse pour les diapositives
Quand tu proposes des diapositives, utilise OBLIGATOIREMENT ce format JSON dans un bloc \`\`\`slides\`\`\` :

\`\`\`slides
[
  {
    "type": "cover|executive_summary|thesis|market|financials|team|timeline|closing|custom",
    "title": "Titre de la diapositive",
    "content": "Point clé 1\\nPoint clé 2\\nPoint clé 3",
    "notes": "Notes pour le présentateur (optionnel)"
  }
]
\`\`\`

### Types de diapositives valides
- \`cover\` — Page de couverture (titre, sous-titre, date, logo)
- \`executive_summary\` — Résumé exécutif (points clés de l'opération)
- \`thesis\` — Thèse d'investissement (rationale stratégique)
- \`market\` — Analyse de marché (TAM/SAM/SOM, tendances)
- \`financials\` — Données financières (CA, EBITDA, croissance, multiples)
- \`team\` — Équipe dirigeante (profils, expériences)
- \`timeline\` — Calendrier du processus (étapes, jalons)
- \`competition\` — Analyse concurrentielle
- \`risk\` — Facteurs de risque et mitigation
- \`appendix\` — Annexes (données complémentaires)
- \`closing\` — Call-to-action et contact
- \`custom\` — Diapositive personnalisée

### Règles de formatage du contenu
- Utilise \`\\n\` pour séparer les points dans le champ "content"
- Pour \`financials\` : inclure métriques clés (CA, EBITDA, croissance, multiples)
- Pour \`team\` : format "Prénom Nom — Titre, X ans d'expérience"
- Pour \`timeline\` : format "T1 2025 — Étape clé"
- Pour \`cover\` : titre court et percutant, sous-titre avec type d'opération
- Fournis entre 7 et 10 diapositives pour un deck complet
- Contenu riche, spécifique et professionnel — évite les généralités

## Commandes Spéciales
- "génère le deck" / "generate deck" → Génère deck complet depuis brief
- "améliore" / "polish" → Améliore le contenu existant
- "raccourcis" / "shorten" → Réduit le contenu
- "développe" / "expand" → Enrichit le contenu
- "résumé" / "summary" → Génère résumé exécutif
- "points de discussion" / "talking points" → Génère talking points
- "séquence" / "sequence" → Suggère séquence de slides

## Règles générales
- Réponds TOUJOURS en français
- Sois direct, professionnel et actionnable
- Si tu proposes des modifications de diapositives existantes, fournis le JSON complet
- Pour les questions générales M&A, réponds sans JSON
- Adapte le niveau de détail au contexte du projet fourni
${extra ? `\n## Instructions personnalisées\n${extra}` : ""}`;
}

/**
 * Generate AI response for chat
 */
export const generateResponse = internalAction({
  args: {
    projectId: v.id("projects"),
    projectContext: v.string(),
    slidesContext: v.string(),
    userId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const messages = await ctx.runQuery(internal.chat.getMessages, {
      projectId: args.projectId,
    });
    const { client, model, systemPromptExtra } = await getAIClient(
      ctx,
      args.userId,
    );

    const systemPrompt = buildSystemPrompt(
      args.projectContext,
      args.slidesContext,
      systemPromptExtra,
    );

    // Build message history — keep last 20 messages
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
      max_tokens: 4000,
      temperature: 0.7,
    });

    const responseContent =
      completion.choices[0]?.message?.content ??
      "Désolé, je n'ai pas pu générer une réponse. Vérifiez la configuration de votre fournisseur IA.";

    await ctx.runMutation(internal.chat.saveResponse, {
      projectId: args.projectId,
      content: responseContent,
    });
  },
});

/**
 * Generate complete deck from brief
 */
export const generateDeckFromBrief = internalAction({
  args: {
    projectId: v.id("projects"),
    brief: v.object({
      clientName: v.string(),
      clientSector: v.string(),
      dealType: v.string(),
      keyMetrics: v.optional(
        v.object({
          revenue: v.optional(v.number()),
          ebitda: v.optional(v.number()),
          growth: v.optional(v.number()),
          multiple: v.optional(v.number()),
        }),
      ),
      teamSize: v.optional(v.number()),
      yearFounded: v.optional(v.number()),
      transactionRationale: v.optional(v.string()),
    }),
    userId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const { client, model, systemPromptExtra } = await getAIClient(
      ctx,
      args.userId,
    );

    const brief = args.brief;
    const metricsStr = brief.keyMetrics
      ? `\nMétriques clés :\n- CA : ${brief.keyMetrics.revenue ?? "N/A"} K€\n- EBITDA : ${brief.keyMetrics.ebitda ?? "N/A"} K€\n- Croissance : ${brief.keyMetrics.growth ?? "N/A"}%\n- Multiple : ${brief.keyMetrics.multiple ?? "N/A"}x`
      : "";

    const prompt = `Génère un pitch deck M&A complet et professionnel pour l'opération suivante :

**Client :** ${brief.clientName}
**Secteur :** ${brief.clientSector}
**Type d'opération :** ${brief.dealType}
${metricsStr}
${brief.teamSize ? `**Taille de l'équipe :** ${brief.teamSize} personnes` : ""}
${brief.yearFounded ? `**Année de création :** ${brief.yearFounded}` : ""}
${brief.transactionRationale ? `\n**Rationale de la transaction :** ${brief.transactionRationale}` : ""}

Génère 7-10 diapositives couvrant :
1. Page de couverture
2. Résumé exécutif
3. Thèse d'investissement
4. Analyse de marché
5. Données financières
6. Équipe dirigeante
7. Calendrier du processus
8. Call-to-action / Contact

Utilise le format JSON suivant pour les diapositives :
\`\`\`slides
[
  {
    "type": "cover|executive_summary|...",
    "title": "Titre",
    "content": "Contenu avec \\n pour séparér les points",
    "notes": "Notes présentateur (optionnel)"
  }
]
\`\`\``;

    const completion = await client.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content: `Tu es PitchForge AI, expert M&A senior. Génère des pitch decks professionnels de qualité banque d'affaires. Réponds uniquement en français. Fournis toujours le JSON des diapositives dans un bloc \`\`\`slides\`\`\`.`,
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 4000,
      temperature: 0.7,
    });

    const responseContent =
      completion.choices[0]?.message?.content ??
      "Erreur lors de la génération du deck.";

    // Save the generated slides as assistant message
    await ctx.runMutation(internal.chat.saveResponse, {
      projectId: args.projectId,
      content: `Deck généré pour ${brief.clientName} :

${responseContent}`,
    });
  },
});

/**
 * Enhance existing content (polish/shorten/expand)
 */
export const enhanceContent = internalAction({
  args: {
    projectId: v.id("projects"),
    content: v.string(),
    intent: v.union(
      v.literal("polish"),
      v.literal("shorten"),
      v.literal("expand"),
    ),
    userId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const { client, model, systemPromptExtra } = await getAIClient(
      ctx,
      args.userId,
    );

    const intentMap = {
      polish: {
        label: "améliorer et rendre plus professionnel",
        instruction:
          "Rends ce texte plus professionnel, percutant et bancairement admissible. Conserve le sens mais enrichis le vocabulaire.",
      },
      shorten: {
        label: "raccourcir",
        instruction:
          "Réduis ce texte à l'essentiel : 3 à 5 points maximum. Supprime les redondances. Sois direct.",
      },
      expand: {
        label: "développer",
        instruction:
          "Enrichis ce texte avec des détails, arguments et données de support. Reste pertinent et professionnel.",
      },
    };

    const intentConfig = intentMap[args.intent];

    const prompt = `${intentConfig.instruction}

Texte à traiter :
${args.content}

Réponds uniquement avec le texte modifié, sans explanation.`;

    const completion = await client.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content: `Tu es PitchForge AI, expert en rédaction M&A. Tu réponds uniquement en français avec le texte modifié demandé. Pas d'explications, juste le contenu.`,
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 2000,
      temperature: 0.6,
    });

    const responseContent =
      completion.choices[0]?.message?.content ?? args.content;

    await ctx.runMutation(internal.chat.saveResponse, {
      projectId: args.projectId,
      content: `**Contenu ${intentConfig.label} :**

${responseContent}`,
    });
  },
});

/**
 * Generate executive summary from project slides
 */
export const generateExecutiveSummary = internalAction({
  args: {
    projectId: v.id("projects"),
    slidesContext: v.string(),
    userId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const { client, model } = await getAIClient(ctx, args.userId);

    const prompt = `Génère un résumé exécutif de 1 page (max 500 mots) pour ce pitch deck M&A.

Le résumé doit couvrir :
1. L'entreprise et son activité (2-3 phrases)
2. L'opération et la rationale stratégique (2-3 phrases)
3. Les points financiers clés (métriques, valorisation) (2-3 phrases)
4. L'équipe dirigeante (1 phrase)
5. Le calendrier et prochaines étapes (1-2 phrases)

Diapositives du deck :
${args.slidesContext}

Réponds en français, de manière synthétique et professionnelle.`;

    const completion = await client.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content:
            "Tu es PitchForge AI, expert M&A senior. Génère des résumés exécutifs de qualité banque d'affaires. Réponds en français.",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 2000,
      temperature: 0.6,
    });

    const responseContent =
      completion.choices[0]?.message?.content ??
      "Erreur lors de la génération du résumé.";

    await ctx.runMutation(internal.chat.saveResponse, {
      projectId: args.projectId,
      content: `**Résumé Exécutif :**

${responseContent}

---
*Généré par PitchForge AI*`,
    });
  },
});

/**
 * Generate talking points for a slide
 */
export const generateTalkingPoints = internalAction({
  args: {
    projectId: v.id("projects"),
    slideTitle: v.string(),
    slideContent: v.string(),
    userId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const { client, model } = await getAIClient(ctx, args.userId);

    const prompt = `Génère 3 à 5 points de discussion pour cette diapositive M&A.

**Titre :** ${args.slideTitle}
**Contenu :** ${args.slideContent}

Pour chaque point de discussion :
- Devrait durer ~30 secondes à ~1 minute de présentation
- Doit approfondir le contenu de la slide
- Doit inclure des exemples ou données à mentionner
- Doit anticiper les questions probables

Réponds au format :
1. [Point 1]
2. [Point 2]
3. [Point 3]
(etc.)

Réponds uniquement en français.`;

    const completion = await client.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content:
            "Tu es PitchForge AI, expert en présentation M&A. Génère des talking points percutants et actionnables. Réponds en français.",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 1500,
      temperature: 0.6,
    });

    const responseContent =
      completion.choices[0]?.message?.content ??
      "Erreur lors de la génération des points de discussion.";

    await ctx.runMutation(internal.chat.saveResponse, {
      projectId: args.projectId,
      content: `**Points de Discussion - "${args.slideTitle}" :**

${responseContent}`,
    });
  },
});

/**
 * Suggest slide sequence based on deal type
 */
export const suggestSlideSequence = internalAction({
  args: {
    projectId: v.id("projects"),
    dealType: v.string(),
    userId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const { client, model } = await getAIClient(ctx, args.userId);

    const dealTypeContext: Record<string, string> = {
      cession:
        "Opération de vente d'entreprise ou de participation. Focus sur valorisation, processus, due diligence.",
      acquisition:
        "Opération d'achat. Focus sur cible, synergies, stratégie d'intégration.",
      lbo: "Leveraged Buy Out. Focus sur levier, rendements, projections.",
      "levée de fonds":
        "Collecte de capitaux. Focus sur uses of funds, traction, équipe.",
      fusion: "Opération de fusion. Focus sur complementarity, synergies.",
      partenariat:
        "Collaboration stratégique. Focus sur valeur ajoutée, governance.",
      ipo: "Introduction en bourse. Focus sur storytelling, financials, governance.",
    };

    const context =
      dealTypeContext[args.dealType.toLowerCase()] ||
      "Transaction M&A standard.";

    const prompt = `Suggère une séquence optimale de diapositives pour une opération de type : **${args.dealType}**

${context}

Fournis :
1. Nombre total de slides recommandé (7-12)
2. Séquence détaillée avec type et titre de chaque slide
3. Rationale courte pour chaque slide

Réponds au format JSON :
\`\`\`json
{
  "totalSlides": X,
  "sequence": [
    {"type": "cover", "title": "Titre", "rationale": "Pourquoi cette slide"},
    ...
  ]
}
\`\`\`

Types disponibles : cover, executive_summary, thesis, market, financials, team, timeline, competition, risk, closing, appendix

Réponds en français.`;

    const completion = await client.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content:
            "Tu es PitchForge AI, expert M&A. Suggère des séquences de slides optimales pour pitch decks professionnels. Réponds en français avec JSON.",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 2000,
      temperature: 0.6,
    });

    const responseContent =
      completion.choices[0]?.message?.content ??
      "Erreur lors de la suggestion de séquence.";

    await ctx.runMutation(internal.chat.saveResponse, {
      projectId: args.projectId,
      content: `**Séquence recommandée pour ${args.dealType} :**

${responseContent}

---
*Tu peux demander à l'IA de générer ces slides une par une ou en bloc.*`,
    });
  },
});

/**
 * Analyze content and suggest improvements
 */
export const suggestImprovements = internalAction({
  args: {
    projectId: v.id("projects"),
    slidesContext: v.string(),
    userId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const { client, model } = await getAIClient(ctx, args.userId);

    const prompt = `Analyse ce pitch deck et suggère des améliorations :

${args.slidesContext}

Pour chaque slide, identifie :
1. Points forts
2. Points à améliorer
3. Suggestions concrètes

Fournis aussi une оценка globale du deck (1-10) avec justification.

Réponds en français, de manière détaillée mais concise.`;

    const completion = await client.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content:
            "Tu es PitchForge AI, expert M&A senior. Évalue et améliore des pitch decks avec regard critique de banque d'affaires. Réponds en français.",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 2500,
      temperature: 0.6,
    });

    const responseContent =
      completion.choices[0]?.message?.content ??
      "Erreur lors de l'analyse du deck.";

    await ctx.runMutation(internal.chat.saveResponse, {
      projectId: args.projectId,
      content: `**Analyse et Suggestions d'Amélioration :**

${responseContent}`,
    });
  },
});

/**
 * Enhance content across all slides in a project (batch operation)
 */
export const enhanceAllSlides = internalAction({
  args: {
    projectId: v.id("projects"),
    intent: v.union(
      v.literal("polish"),
      v.literal("shorten"),
      v.literal("expand"),
    ),
    userId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const { client, model, systemPromptExtra } = await getAIClient(
      ctx,
      args.userId,
    );

    // Get all slides for this project
    const slides = await ctx.runQuery(internal.slides.list, {
      projectId: args.projectId,
    });

    const intentMap = {
      polish: {
        label: "améliorer et rendre plus professionnel",
        instruction:
          "Rends ce texte plus professionnel, percutant et bancairement admissible. Conserve le sens mais enrichis le vocabulaire.",
      },
      shorten: {
        label: "raccourcir",
        instruction:
          "Réduis ce texte à l'essentiel : 3 à 5 points maximum. Supprime les redondances. Sois direct.",
      },
      expand: {
        label: "développer",
        instruction:
          "Enrichis ce texte avec des détails, arguments et données de support. Reste pertinent et professionnel.",
      },
    };

    const intentConfig = intentMap[args.intent];
    const results: { slideId: string; title: string; content: string }[] = [];

    for (const slide of slides) {
      const prompt = `${intentConfig.instruction}

Titre: ${slide.title}
Contenu actuel:
${slide.content}

Réponds uniquement avec le texte modifié, sans explanation. Format: TITLE|NEW_CONTENT`;

      try {
        const completion = await client.chat.completions.create({
          model,
          messages: [
            {
              role: "system",
              content: `Tu es PitchForge AI, expert en rédaction M&A. Tu réponds uniquement en français avec le texte modifié demandé. Pas d'explications, juste le contenu. Le format de réponse est: TITLE|NEW_CONTENT (séparés par |)`,
            },
            { role: "user", content: prompt },
          ],
          max_tokens: 2000,
          temperature: 0.6,
        });

        const response =
          completion.choices[0]?.message?.content ?? "";

        // Parse response - expect "Title|NewContent" format
        const parts = response.split("|");
        if (parts.length >= 2) {
          const newTitle = parts[0].trim();
          const newContent = parts.slice(1).join("|").trim();
          results.push({
            slideId: slide._id,
            title: newTitle || slide.title,
            content: newContent || slide.content,
          });
        } else {
          // If format is wrong, use original
          results.push({
            slideId: slide._id,
            title: slide.title,
            content: response.trim() || slide.content,
          });
        }
      } catch (error) {
        // On error, keep original
        results.push({
          slideId: slide._id,
          title: slide.title,
          content: slide.content,
        });
      }
    }

    // Update all slides in bulk
    if (results.length > 0) {
      await ctx.runMutation(internal.slides.bulkUpdate, {
        slides: results.map(r => ({
          slideId: r.slideId as Id<"slides">,
          title: r.title,
          content: r.content,
        })),
      });
    }

    // Save confirmation to chat
    await ctx.runMutation(internal.chat.saveResponse, {
      projectId: args.projectId,
      content: `**Enhancement appliqué à ${results.length} diapositive(s)**

Intent: ${intentConfig.label}

Les diapositives ont été mises à jour avec le contenu amélioré.`,
    });
  },
});
