import { httpAction } from "./_generated/server";
import { api, internal } from "./_generated/api";

export const exportPptx = httpAction(async (ctx, request) => {
    if (request.method === "OPTIONS") {
        return new Response(null, {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
            },
        });
    }

    try {
        const url = new URL(request.url);
        const projectId = url.searchParams.get("projectId");

        if (!projectId) {
            return new Response(JSON.stringify({ error: "Missing projectId" }), {
                status: 400,
                headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
            });
        }

        const project = await ctx.runQuery(api.projects.get, { projectId: projectId as any });
        if (!project) {
            return new Response(JSON.stringify({ error: "Project not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
            });
        }

        const slides = await ctx.runQuery(api.slides.list, { projectId: projectId as any }) ?? [];

        // Call the Node.js internal action to do the heavy lifting
        const base64Str = await ctx.runAction(internal.exportAction.generatePptxBase64, { project, slides });

        const binaryString = atob(base64Str);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }

        const fileName = `${project.name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}.pptx`;

        return new Response(bytes.buffer, {
            headers: {
                "Content-Type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                "Content-Disposition": `attachment; filename="${fileName}"`,
                "Access-Control-Allow-Origin": "*",
            },
        });
    } catch (error) {
        console.error("Export PPTX error:", error);
        return new Response(JSON.stringify({ error: String(error) }), {
            status: 500,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        });
    }
});
