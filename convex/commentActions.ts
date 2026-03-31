"use node";
import { internalAction } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import OpenAI from "openai";

async function getAIClient(ctx: any, userId: Id<"users">) {
  const settings = await ctx.runQuery(internal.aiSettings.getForUser, { userId });
  if (settings && settings.provider !== "convex_builtin" && settings.apiKey && settings.baseUrl) {
    return {
      client: new OpenAI({ baseURL: settings.baseUrl, apiKey: settings.apiKey }),
      model: settings.model,
    };
  }
  return {
    client: new OpenAI({
      baseURL: process.env.CONVEX_OPENAI_BASE_URL,
      apiKey: process.env.CONVEX_OPENAI_API_KEY,
    }),
    model: "gpt-4.1-nano",
  };
}

export const resolveWithAI = internalAction({
  args: {
    commentId: v.id("comments"),
    userId: v.id("users"),
    slideContent: v.string(),
    slideTitle: v.string(),
    slideType: v.string(),
  },
  handler: async (ctx, args) => {
    const comment = await ctx.runQuery(internal.comments.getComment, { commentId: args.commentId });
    if (!comment) return;

    const { client, model } = await getAIClient(ctx, args.userId);

    const systemPrompt = `Tu es un expert senior en M&A et en communication financière. Tu analyses des commentaires sur des diapositives de pitch deck M&A et proposes des améliorations concrètes, précises et directement applicables.

Règles :
- Réponds TOUJOURS en français
- Sois concis et professionnel (maximum 200 mots)
- Fournis une suggestion directement applicable, pas une analyse théorique
- Si pertinent, propose le texte révisé directement entre guillemets
- Adapte le ton au contexte M&A professionnel`;

    const userPrompt = `Diapositive : "${args.slideTitle}" (type : ${args.slideType})

Contenu actuel :
${args.slideContent}

Commentaire à traiter : "${comment.text}"

Propose une amélioration concrète et directement applicable pour adresser ce commentaire. Si tu révises du texte, fournis la version améliorée directement.`;

    const completion = await client.chat.completions.create({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_tokens: 600,
      temperature: 0.6,
    });

    const response = completion.choices[0]?.message?.content
      ?? "Impossible de générer une suggestion. Vérifiez la configuration IA.";

    await ctx.runMutation(internal.comments.saveAiResponse, {
      commentId: args.commentId,
      response,
    });
  },
});
