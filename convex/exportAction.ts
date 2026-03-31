"use node";
import { internalAction } from "./_generated/server";
import { v } from "convex/values";
import PptxGenJS from "pptxgenjs";

const BRAND = {
    navy: '0a1628',
    navyLight: '1a2a42',
    pink: 'e91e63',
    white: 'ffffff',
    gray: '94a3b8'
};

export const generatePptxBase64 = internalAction({
    args: {
        project: v.any(),
        slides: v.any(),
    },
    handler: async (ctx, args) => {
        const { project, slides } = args;
        const pptx = new PptxGenJS();

        pptx.title = project.name || "Présentation M&A";
        pptx.subject = project.dealType || "Présentation M&A";
        pptx.author = "Alecia";
        pptx.company = "Alecia";
        pptx.layout = "LAYOUT_16x9";

        pptx.defineSlideMaster({
            title: "MASTER_SLIDE",
            background: { color: BRAND.navy },
            slideNumber: { x: 9.0, y: 7.0, fontSize: 10, color: BRAND.gray },
            objects: [
                { rect: { x: 0.5, y: 7.0, w: 9.0, h: 0.5, fill: { color: BRAND.navy } } },
                { text: { text: "Alecia - Conseil en financement", options: { x: 0.5, y: 7.0, w: 4.0, h: 0.3, fontSize: 10, color: BRAND.gray } } }
            ]
        });

        for (const slideData of slides) {
            const slide = pptx.addSlide({ masterName: "MASTER_SLIDE" });

            slide.addText("&", {
                x: 3, y: 2, w: 4, h: 4,
                fontSize: 200,
                color: BRAND.navyLight,
                align: "center",
                valign: "middle",
                transparency: 90
            });

            const lines = (slideData.content || "").split("\n").filter(Boolean);

            if (slideData.type === "title" || slideData.type === "cover") {
                addTitleSlide(slide, slideData.title, lines[0] || "");
            } else if (slideData.type === "section") {
                addSectionSlide(slide, slideData.title);
            } else if (slideData.type === "closing") {
                addClosingSlide(slide, slideData.title, lines);
            } else {
                addContentSlide(slide, slideData.title, lines);
            }
        }

        const base64Str = await pptx.write({ outputType: "base64" }) as string;
        return base64Str;
    }
});

function addTitleSlide(slide: any, title: string, subtitle: string) {
    slide.addText(title || "", {
        x: 1, y: 2.5, w: 8, h: 1.5,
        fontSize: 44, bold: true, color: BRAND.white,
        align: "center", valign: "middle"
    });
    if (subtitle) {
        slide.addText(subtitle, {
            x: 1, y: 4.2, w: 8, h: 0.8,
            fontSize: 24, color: BRAND.pink, align: "center"
        });
    }
    slide.addText("alecia", {
        x: 1, y: 6, w: 8, h: 0.5,
        fontSize: 18, color: BRAND.gray, align: "center"
    });
}

function addContentSlide(slide: any, title: string, blocks: string[]) {
    slide.addText(title || "", {
        x: 0.5, y: 0.5, w: 9, h: 0.8,
        fontSize: 32, bold: true, color: BRAND.white
    });
    slide.addShape("rect", {
        x: 0.5, y: 1.3, w: 1, h: 0.05,
        fill: { color: BRAND.pink }
    });

    if (blocks.length > 0) {
        slide.addText(blocks.map((b: string) => ({ text: b, options: { bullet: true } })), {
            x: 0.5, y: 1.8, w: 9, h: 5,
            fontSize: 18, color: BRAND.white, lineSpacing: 32
        });
    }
}

function addSectionSlide(slide: any, title: string) {
    slide.addText(title || "", {
        x: 0.5, y: 3, w: 9, h: 1.5,
        fontSize: 48, bold: true, color: BRAND.white,
        align: "center", valign: "middle"
    });
    slide.addShape("rect", {
        x: 4, y: 4.8, w: 2, h: 0.05,
        fill: { color: BRAND.pink }
    });
}

function addClosingSlide(slide: any, title: string, lines: string[]) {
    slide.addText(title || "Merci", {
        x: 0.5, y: 2.5, w: 9, h: 1.5,
        fontSize: 48, bold: true, color: BRAND.white,
        align: "center", valign: "middle"
    });

    const contact = lines.length > 0 ? lines[0] : "";
    const email = lines.length > 1 ? lines[1] : "";

    if (contact) {
        slide.addText(contact, { x: 0.5, y: 4.5, w: 9, h: 0.5, fontSize: 18, color: BRAND.pink, align: "center" });
    }
    if (email) {
        slide.addText(email, { x: 0.5, y: 5.2, w: 9, h: 0.4, fontSize: 16, color: BRAND.gray, align: "center" });
    }
    slide.addText("alecia", {
        x: 0.5, y: 6, w: 9, h: 0.5,
        fontSize: 24, color: BRAND.gray, align: "center"
    });
}
