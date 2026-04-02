import { Router } from 'express';
import PptxGenJS from 'pptxgenjs';
import { execQuery, getOne, getDb } from '../db/index.js';
import { createError } from '../middleware/errorHandler.js';

const router = Router();

const ALECIA_BRANDING = {
  primaryColor: '#061a40',
  accentColor: '#b80c09',
  fontFamily: 'Bierstadt',
  watermark: '&',
};

router.get('/pptx/:projectId', async (req, res, next) => {
  try {
    const { projectId } = req.params;

    const project = getOne<{
      id: string;
      name: string;
      target_company: string;
      theme_primary_color: string;
      theme_accent_color: string;
    }>('SELECT * FROM projects WHERE id = ?', [projectId]);

    if (!project) {
      throw createError('Projet non trouvé', 404);
    }

    const slides = execQuery<{
      id: string;
      type: string;
      title: string;
      content: string;
      notes: string;
    }>(`
      SELECT id, type, title, content, notes
      FROM slides WHERE project_id = ? ORDER BY order_index ASC
    `, [projectId]);

    const pptx = new PptxGenJS();
    pptx.title = project.name || 'Pitch Deck';
    pptx.author = 'alecia';
    pptx.company = 'alecia';

    for (const slide of slides) {
      const pptxSlide = pptx.addSlide({
        background: { color: project.theme_primary_color || ALECIA_BRANDING.primaryColor },
      });

      pptxSlide.addText(slide.title || '', {
        x: 0.5,
        y: 0.3,
        w: 9,
        h: 0.8,
        fontSize: 32,
        color: 'FFFFFF',
        fontFace: ALECIA_BRANDING.fontFamily,
        bold: true,
      });

      try {
        const content = JSON.parse(slide.content || '{}');
        if (content.text) {
          const text = Array.isArray(content.text) ? content.text.join('\n') : content.text;
          pptxSlide.addText(text, {
            x: 0.5,
            y: 1.5,
            w: 9,
            h: 5,
            fontSize: 16,
            color: 'FFFFFF',
            fontFace: 'Inter',
          });
        }
        if (content.subtitle) {
          pptxSlide.addText(content.subtitle as string, {
            x: 0.5,
            y: 1.1,
            w: 9,
            h: 0.5,
            fontSize: 18,
            color: project.theme_accent_color || ALECIA_BRANDING.accentColor,
            fontFace: 'Inter',
          });
        }
      } catch {
        // Ignore parse errors
      }

      pptxSlide.addText(ALECIA_BRANDING.watermark, {
        x: 6.5,
        y: 1.5,
        w: 3,
        h: 3,
        fontSize: 150,
        color: 'FFFFFF',
        transparency: 90,
      });

      pptxSlide.addText('alecia', {
        x: 0.5,
        y: 6.8,
        w: 9,
        h: 0.3,
        fontSize: 10,
        color: '#AAAAAA',
        fontFace: ALECIA_BRANDING.fontFamily,
        align: 'right',
      });
    }

    const buffer = await pptx.write({ outputType: 'nodebuffer' });
    const fileName = `${project.name || 'pitch-deck'}.pptx`;

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.send(buffer);
  } catch (error) {
    next(error);
  }
});

router.get('/pdf/:projectId', async (req, res, next) => {
  try {
    const { projectId } = req.params;

    const project = getOne<{
      name: string;
      theme_primary_color: string;
      theme_accent_color: string;
    }>('SELECT name, theme_primary_color, theme_accent_color FROM projects WHERE id = ?', [projectId]);

    if (!project) {
      throw createError('Projet non trouvé', 404);
    }

    const slides = execQuery<{
      type: string;
      title: string;
      content: string;
    }>('SELECT type, title, content FROM slides WHERE project_id = ? ORDER BY order_index ASC', [projectId]);

    const slidesHTML = slides.map((slide, index) => {
      let text = '';
      try {
        const content = JSON.parse(slide.content || '{}');
        text = content.text || content.subtitle || '';
      } catch {
        text = '';
      }

      return `
        <div style="width:100%;height:100vh;background:${project.theme_primary_color || ALECIA_BRANDING.primaryColor};color:white;padding:40px;position:relative;page-break-after:always;box-sizing:border-box;display:flex;flex-direction:column;">
          <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:300px;opacity:0.05;font-family:${ALECIA_BRANDING.fontFamily};color:white;">&</div>
          <div style="flex:1;display:flex;flex-direction:column;justify-content:center;">
            <h1 style="font-size:48px;margin-bottom:20px;font-family:${ALECIA_BRANDING.fontFamily};">${slide.title || ''}</h1>
            <p style="font-size:18px;line-height:1.6;">${text}</p>
          </div>
          <div style="display:flex;justify-content:flex-end;align-items:center;">
            <span style="font-size:14px;color:#888;font-family:${ALECIA_BRANDING.fontFamily};">alecia</span>
          </div>
        </div>
      `;
    }).join('\n');

    res.json({
      success: true,
      data: {
        html: `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${project.name || 'Pitch Deck'}</title><style>body{margin:0;padding:0;font-family:'Inter',sans-serif;}@media print{.slide{page-break-after:always;}}</style></head><body>${slidesHTML}</body></html>`,
        slideCount: slides.length,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
