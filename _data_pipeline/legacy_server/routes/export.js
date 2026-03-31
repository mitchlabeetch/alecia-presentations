/**
 * Export routes (PPTX, PDF)
 */

import express from 'express';
import PptxGenJS from 'pptxgenjs';
import { getDb } from '../db/database.js';
import { authenticateToken } from './auth.js';

const router = express.Router();

router.use(authenticateToken);

// Alecia brand colors
const BRAND = {
  navy: '0a1628',
  navyLight: '1a2a42',
  pink: 'e91e63',
  white: 'ffffff',
  gray: '94a3b8'
};

/**
 * POST /api/export/pptx/:presentationId
 * Export presentation to PPTX
 */
router.post('/pptx/:presentationId', async (req, res) => {
  try {
    const db = getDb();
    const { presentationId } = req.params;
    const { includeNotes = false, quality = 'high' } = req.body;
    
    // Get presentation
    const presentation = db.prepare('SELECT * FROM presentations WHERE id = ?').get(presentationId);
    if (!presentation) {
      return res.status(404).json({ error: 'Présentation non trouvée' });
    }
    
    // Get slides
    const slides = db.prepare('SELECT * FROM slides WHERE presentation_id = ? ORDER BY "order"').all(presentationId);
    
    // Create PPTX
    const pptx = new PptxGenJS();
    
    // Set metadata
    pptx.title = presentation.title;
    pptx.subject = presentation.description || '';
    pptx.author = 'Alecia';
    pptx.company = 'Alecia';
    pptx.revision = '1';
    
    // Set layout
    pptx.layout = 'LAYOUT_16x9';
    
    // Define master slide with branding
    pptx.defineSlideMaster({
      title: 'MASTER_SLIDE',
      background: { color: BRAND.navy },
      objects: [
        // Footer
        {
          rect: { x: 0.5, y: 7.0, w: 9.0, h: 0.5 },
          fill: { color: BRAND.navy }
        },
        {
          text: {
            text: 'Alecia - Conseil en financement',
            options: { x: 0.5, y: 7.0, w: 4.0, h: 0.3, fontSize: 10, color: BRAND.gray }
          }
        },
        {
          slideNumber: { x: 9.0, y: 7.0, fontSize: 10, color: BRAND.gray }
        }
      ]
    });
    
    // Process each slide
    for (const slideData of slides) {
      if (slideData.is_hidden) continue;
      
      const content = JSON.parse(slideData.content_json);
      const slide = pptx.addSlide({ masterName: 'MASTER_SLIDE' });
      
      // Add watermark ampersand
      slide.addText('&', {
        x: 3, y: 2, w: 4, h: 4,
        fontSize: 200,
        color: BRAND.navyLight,
        align: 'center',
        valign: 'middle',
        transparency: 90
      });
      
      switch (slideData.type) {
        case 'title':
          addTitleSlide(slide, slideData.title, content.subtitle);
          break;
        case 'content':
          addContentSlide(slide, slideData.title, content);
          break;
        case 'two-column':
          addTwoColumnSlide(slide, slideData.title, content);
          break;
        case 'image':
          addImageSlide(slide, slideData.title, content);
          break;
        case 'chart':
          addChartSlide(slide, slideData.title, content);
          break;
        case 'table':
          addTableSlide(slide, slideData.title, content);
          break;
        case 'team':
          addTeamSlide(slide, slideData.title, content);
          break;
        case 'clients':
          addClientsSlide(slide, slideData.title, content);
          break;
        case 'section':
          addSectionSlide(slide, slideData.title);
          break;
        case 'closing':
          addClosingSlide(slide, slideData.title, content);
          break;
        default:
          addContentSlide(slide, slideData.title, content);
      }
    }
    
    // Generate file
    const fileName = `${presentation.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pptx`;
    
    // Set headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    
    // Stream the file
    const buffer = await pptx.write({ outputType: 'nodebuffer' });
    res.send(buffer);
    
  } catch (error) {
    console.error('Export PPTX error:', error);
    res.status(500).json({ error: 'Erreur lors de l\'export PPTX' });
  }
});

// Slide type handlers
function addTitleSlide(slide, title, subtitle) {
  slide.addText(title || '', {
    x: 1, y: 2.5, w: 8, h: 1.5,
    fontSize: 44,
    bold: true,
    color: BRAND.white,
    align: 'center',
    valign: 'middle'
  });
  
  if (subtitle) {
    slide.addText(subtitle, {
      x: 1, y: 4.2, w: 8, h: 0.8,
      fontSize: 24,
      color: BRAND.pink,
      align: 'center'
    });
  }
  
  // Add Alecia logo text
  slide.addText('alecia', {
    x: 1, y: 6, w: 8, h: 0.5,
    fontSize: 18,
    color: BRAND.gray,
    align: 'center'
  });
}

function addContentSlide(slide, title, content) {
  // Title
  slide.addText(title || '', {
    x: 0.5, y: 0.5, w: 9, h: 0.8,
    fontSize: 32,
    bold: true,
    color: BRAND.white
  });
  
  // Accent line
  slide.addShape('rect', {
    x: 0.5, y: 1.3, w: 1, h: 0.05,
    fill: { color: BRAND.pink }
  });
  
  // Content
  if (content.bullets && content.bullets.length > 0) {
    slide.addText(content.bullets.map(b => ({ text: b, options: { bullet: true } })), {
      x: 0.5, y: 1.8, w: 9, h: 5,
      fontSize: 18,
      color: BRAND.white,
      lineSpacing: 32
    });
  } else if (content.text) {
    slide.addText(content.text, {
      x: 0.5, y: 1.8, w: 9, h: 5,
      fontSize: 18,
      color: BRAND.white
    });
  }
}

function addTwoColumnSlide(slide, title, content) {
  slide.addText(title || '', {
    x: 0.5, y: 0.5, w: 9, h: 0.8,
    fontSize: 32,
    bold: true,
    color: BRAND.white
  });
  
  slide.addShape('rect', {
    x: 0.5, y: 1.3, w: 1, h: 0.05,
    fill: { color: BRAND.pink }
  });
  
  // Left column
  if (content.left) {
    slide.addText(content.left.title || '', {
      x: 0.5, y: 1.8, w: 4, h: 0.5,
      fontSize: 20,
      bold: true,
      color: BRAND.pink
    });
    
    if (content.left.bullets) {
      slide.addText(content.left.bullets.map(b => ({ text: b, options: { bullet: true } })), {
        x: 0.5, y: 2.4, w: 4, h: 4,
        fontSize: 16,
        color: BRAND.white
      });
    }
  }
  
  // Divider
  slide.addShape('line', {
    x: 4.75, y: 1.8, w: 0, h: 4.5,
    line: { color: BRAND.navyLight, width: 1 }
  });
  
  // Right column
  if (content.right) {
    slide.addText(content.right.title || '', {
      x: 5, y: 1.8, w: 4, h: 0.5,
      fontSize: 20,
      bold: true,
      color: BRAND.pink
    });
    
    if (content.right.bullets) {
      slide.addText(content.right.bullets.map(b => ({ text: b, options: { bullet: true } })), {
        x: 5, y: 2.4, w: 4, h: 4,
        fontSize: 16,
        color: BRAND.white
      });
    }
  }
}

function addImageSlide(slide, title, content) {
  slide.addText(title || '', {
    x: 0.5, y: 0.5, w: 9, h: 0.8,
    fontSize: 32,
    bold: true,
    color: BRAND.white
  });
  
  if (content.imageUrl) {
    slide.addImage({
      path: content.imageUrl,
      x: 0.5, y: 1.5, w: 9, h: 5,
      sizing: { type: 'contain', w: 9, h: 5 }
    });
  }
  
  if (content.caption) {
    slide.addText(content.caption, {
      x: 0.5, y: 6.7, w: 9, h: 0.3,
      fontSize: 12,
      color: BRAND.gray,
      align: 'center'
    });
  }
}

function addChartSlide(slide, title, content) {
  slide.addText(title || '', {
    x: 0.5, y: 0.5, w: 9, h: 0.8,
    fontSize: 32,
    bold: true,
    color: BRAND.white
  });
  
  if (content.chartData) {
    slide.addChart(content.chartType || 'bar', content.chartData, {
      x: 0.5, y: 1.5, w: 9, h: 5,
      chartColors: [BRAND.pink, BRAND.navyLight, BRAND.gray],
      showLegend: true,
      showValue: true
    });
  }
}

function addTableSlide(slide, title, content) {
  slide.addText(title || '', {
    x: 0.5, y: 0.5, w: 9, h: 0.8,
    fontSize: 32,
    bold: true,
    color: BRAND.white
  });
  
  if (content.tableData && content.tableData.length > 0) {
    const rows = content.tableData.length;
    const cols = content.tableData[0].length;
    
    slide.addTable(content.tableData, {
      x: 0.5, y: 1.5, w: 9, h: 5,
      fontSize: 14,
      color: BRAND.white,
      border: { type: 'solid', pt: 1, color: BRAND.navyLight },
      fill: { color: BRAND.navy },
      colW: Array(cols).fill(9 / cols)
    });
  }
}

function addTeamSlide(slide, title, content) {
  slide.addText(title || '', {
    x: 0.5, y: 0.5, w: 9, h: 0.8,
    fontSize: 32,
    bold: true,
    color: BRAND.white
  });
  
  if (content.members && content.members.length > 0) {
    const startX = 0.5;
    const startY = 2;
    const cardW = 2.8;
    const cardH = 3.5;
    const gap = 0.4;
    
    content.members.forEach((member, index) => {
      const x = startX + (index % 3) * (cardW + gap);
      const y = startY + Math.floor(index / 3) * (cardH + gap);
      
      // Card background
      slide.addShape('rect', {
        x, y, w: cardW, h: cardH,
        fill: { color: BRAND.navyLight },
        line: { color: BRAND.pink, width: 1 }
      });
      
      // Name
      slide.addText(member.name || '', {
        x: x + 0.2, y: y + 0.2, w: cardW - 0.4, h: 0.5,
        fontSize: 18,
        bold: true,
        color: BRAND.white
      });
      
      // Role
      slide.addText(member.role || '', {
        x: x + 0.2, y: y + 0.7, w: cardW - 0.4, h: 0.4,
        fontSize: 14,
        color: BRAND.pink
      });
      
      // Description
      if (member.description) {
        slide.addText(member.description, {
          x: x + 0.2, y: y + 1.2, w: cardW - 0.4, h: 2,
          fontSize: 12,
          color: BRAND.gray
        });
      }
    });
  }
}

function addClientsSlide(slide, title, content) {
  slide.addText(title || '', {
    x: 0.5, y: 0.5, w: 9, h: 0.8,
    fontSize: 32,
    bold: true,
    color: BRAND.white
  });
  
  // Create logo grid
  const logos = content.logos || [];
  const cols = 4;
  const rows = 3;
  const cellW = 2.25;
  const cellH = 1.8;
  const startX = 0.5;
  const startY = 1.5;
  
  for (let i = 0; i < Math.min(logos.length, cols * rows); i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = startX + col * cellW;
    const y = startY + row * cellH;
    
    // Logo placeholder
    slide.addShape('rect', {
      x: x + 0.2, y: y + 0.2, w: cellW - 0.4, h: cellH - 0.4,
      fill: { color: BRAND.navyLight },
      line: { color: BRAND.navyLight, width: 1 }
    });
    
    slide.addText(logos[i].name || `Client ${i + 1}`, {
      x: x + 0.2, y: y + 0.5, w: cellW - 0.4, h: 1,
      fontSize: 14,
      color: BRAND.white,
      align: 'center',
      valign: 'middle'
    });
  }
}

function addSectionSlide(slide, title) {
  slide.addText(title || '', {
    x: 0.5, y: 3, w: 9, h: 1.5,
    fontSize: 48,
    bold: true,
    color: BRAND.white,
    align: 'center',
    valign: 'middle'
  });
  
  // Accent line
  slide.addShape('rect', {
    x: 4, y: 4.8, w: 2, h: 0.05,
    fill: { color: BRAND.pink }
  });
}

function addClosingSlide(slide, title, content) {
  slide.addText(title || 'Merci', {
    x: 0.5, y: 2.5, w: 9, h: 1.5,
    fontSize: 48,
    bold: true,
    color: BRAND.white,
    align: 'center',
    valign: 'middle'
  });
  
  if (content.contact) {
    slide.addText(content.contact, {
      x: 0.5, y: 4.5, w: 9, h: 0.5,
      fontSize: 18,
      color: BRAND.pink,
      align: 'center'
    });
  }
  
  if (content.email) {
    slide.addText(content.email, {
      x: 0.5, y: 5.2, w: 9, h: 0.4,
      fontSize: 16,
      color: BRAND.gray,
      align: 'center'
    });
  }
  
  // Alecia branding
  slide.addText('alecia', {
    x: 0.5, y: 6, w: 9, h: 0.5,
    fontSize: 24,
    color: BRAND.gray,
    align: 'center'
  });
}

export default router;
