import { httpAction, internalAction } from './_generated/server';
import { api, internal } from './_generated/api';
import { v } from 'convex/values';

interface ParsedSlide {
  id: string;
  title: string;
  layout: string;
  elements: ParsedElement[];
  notes?: string;
}

interface ParsedElement {
  id: string;
  type: 'text' | 'image' | 'shape' | 'chart' | 'table';
  x: number;
  y: number;
  width: number;
  height: number;
  content?: string;
  style?: Record<string, unknown>;
  imageUrl?: string;
  rows?: string[][];
  chartType?: string;
}

interface ParsedPresentation {
  title: string;
  author: string;
  company: string;
  subject: string;
  slides: ParsedSlide[];
  theme?: {
    primaryColor: string;
    accentColor: string;
    backgroundColor: string;
    fontFamily: string;
  };
}

export const importPptx = httpAction(async (ctx, request) => {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  try {
    const url = new URL(request.url);
    const projectId = url.searchParams.get('projectId');

    if (!projectId) {
      return new Response(JSON.stringify({ error: 'Missing projectId' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    const project = await ctx.runQuery(api.projects.get, { projectId: projectId as any });
    if (!project) {
      return new Response(JSON.stringify({ error: 'Project not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return new Response(JSON.stringify({ error: 'No file provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    const validTypes = [
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.ms-powerpoint',
    ];
    if (
      !validTypes.includes(file.type) &&
      !file.name.endsWith('.pptx') &&
      !file.name.endsWith('.ppt')
    ) {
      return new Response(JSON.stringify({ error: 'Invalid file type' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');

    const parsedPresentation = await ctx.runAction(internal.parsePptxContent, {
      base64,
      fileName: file.name,
    });

    return new Response(JSON.stringify(parsedPresentation), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  } catch (error) {
    console.error('PPTX Import error:', error);
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
});

export const parsePptxContent = internalAction({
  args: {
    base64: v.string(),
    fileName: v.string(),
  },
  handler: async (ctx, args): Promise<ParsedPresentation> => {
    const { base64, fileName } = args;

    try {
      const buffer = Buffer.from(base64, 'base64');
      const JSZip = require('jszip');
      const zip = await JSZip.loadAsync(buffer);

      const coreXml = await zip.file('docProps/core.xml')?.async('text');
      const appXml = await zip.file('docProps/app.xml')?.async('text');

      const metadata = parseMetadata(coreXml, appXml);
      const theme = parseTheme(zip);

      const slideFiles = zip.file(/ppt\/slides\/slide[0-9]+\.xml$/);
      const slides: ParsedSlide[] = [];

      const sortedFiles = slideFiles.sort((a: any, b: any) => {
        const numA = parseInt(a.name.match(/slide(\d+)\.xml$/)?.[1] || '0');
        const numB = parseInt(b.name.match(/slide(\d+)\.xml$/)?.[1] || '0');
        return numA - numB;
      });

      for (let i = 0; i < sortedFiles.length; i++) {
        const slideXml = await sortedFiles[i].async('text');
        const slideNotesXml = await zip
          .file('ppt/notesSlides/notesSlide' + (i + 1) + '.xml')
          ?.async('text');
        const slide = parseSlide(slideXml, slideNotesXml, i + 1, theme);
        slides.push(slide);
      }

      return {
        title: metadata.title || fileName.replace(/\.(pptx|ppt)$/i, ''),
        author: metadata.author || 'Importé',
        company: metadata.company || '',
        subject: metadata.subject || '',
        slides,
        theme,
      };
    } catch (error) {
      console.error('Error parsing PPTX:', error);
      throw new Error(
        'Failed to parse PPTX: ' + (error instanceof Error ? error.message : String(error))
      );
    }
  },
});

function parseMetadata(
  coreXml: string | undefined,
  appXml: string | undefined
): { title?: string; author?: string; company?: string; subject?: string } {
  const result: { title?: string; author?: string; company?: string; subject?: string } = {};

  if (coreXml) {
    const titleMatch = coreXml.match(/<dc:title>([^<]*)<\/dc:title>/);
    const creatorMatch = coreXml.match(/<dc:creator>([^<]*)<\/dc:creator>/);
    const subjectMatch = coreXml.match(/<dc:subject>([^<]*)<\/dc:subject>/);

    if (titleMatch) result.title = decodeXml(titleMatch[1]);
    if (creatorMatch) result.author = decodeXml(creatorMatch[1]);
    if (subjectMatch) result.subject = decodeXml(subjectMatch[1]);
  }

  if (appXml) {
    const companyMatch = appXml.match(/<Company>([^<]*)<\/Company>/);
    if (companyMatch) result.company = decodeXml(companyMatch[1]);
  }

  return result;
}

function decodeXml(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

function parseTheme(zip: any) {
  const defaultTheme = {
    primaryColor: '#0a1628',
    accentColor: '#e91e63',
    backgroundColor: '#ffffff',
    fontFamily: 'Arial',
  };

  try {
    const themeXml = zip.file('ppt/theme/theme1.xml')?.async('text');
    if (!themeXml) return defaultTheme;

    const accentMatch = themeXml.match(
      /<a:accent1>.*?<a:srgbClr val="([^"]*)"[^>]*>.*?<\/a:accent1>/s
    );
    if (accentMatch) defaultTheme.accentColor = '#' + accentMatch[1];

    const majorFontMatch = themeXml.match(/<a:majorFont[^>]*xlink:href="([^"]*)"[^>]*>/);
    if (majorFontMatch) defaultTheme.fontFamily = majorFontMatch[1];
  } catch (error) {
    console.error('Error parsing theme:', error);
  }

  return defaultTheme;
}

function parseSlide(
  slideXml: string,
  notesXml: string | undefined,
  slideNumber: number,
  theme: { primaryColor: string; accentColor: string; backgroundColor: string; fontFamily: string }
): ParsedSlide {
  const elements: ParsedElement[] = [];
  const title = extractSlideTitle(slideXml);
  const notes = notesXml ? extractNotes(notesXml) : undefined;
  const layout = determineSlideLayout(slideXml);

  const shapeMatches = slideXml.match(/<p:sp[^>]*>[\s\S]*?<\/p:sp>/g) || [];
  const picMatches = slideXml.match(/<p:pic[^>]*>[\s\S]*?<\/p:pic>/g) || [];
  const graphicFrameMatches =
    slideXml.match(/<p:graphicFrame[^>]*>[\s\S]*?<\/p:graphicFrame>/g) || [];

  let elementId = 0;

  for (const shapeMatch of shapeMatches) {
    const element = parseShapeElement(shapeMatch, elementId++);
    if (element) elements.push(element);
  }

  for (const picMatch of picMatches) {
    const element = parsePictureElement(picMatch, elementId++);
    if (element) elements.push(element);
  }

  for (const frameMatch of graphicFrameMatches) {
    const element = parseGraphicFrameElement(frameMatch, elementId++);
    if (element) elements.push(element);
  }

  return {
    id: 'slide-' + slideNumber,
    title,
    layout,
    elements,
    notes,
  };
}

function extractSlideTitle(slideXml: string): string {
  const titleMatch = slideXml.match(
    /<p:sp[^>]*>[\s\S]*?<p:ph[^>]*type="title"[^>]*>[\s\S]*?<a:t>([^<]*)<\/a:t>[\s\S]*?<\/p:sp>/
  );
  if (titleMatch) return decodeXml(titleMatch[1]);

  const firstTextMatch = slideXml.match(/<a:t>([^<]{3,})<\/a:t>/);
  if (firstTextMatch) return decodeXml(firstTextMatch[1]).substring(0, 50);

  return 'Sans titre';
}

function extractNotes(notesXml: string): string {
  const notesMatch = notesXml.match(/<a:t>([^<]*)<\/a:t>/g);
  if (notesMatch) {
    return notesMatch
      .map((m: string) => m.replace(/<\/?a:t>/g, ''))
      .join(' ')
      .trim();
  }
  return '';
}

function determineSlideLayout(slideXml: string): string {
  if (slideXml.includes('type="title"')) return 'title';
  if (slideXml.includes('type="ctrTitle"')) return 'cover';
  if (slideXml.includes('type="sectionHeader"')) return 'section';
  if (slideXml.includes('type="pic"')) return 'image';
  return 'content';
}

function parseShapeElement(shapeXml: string, id: number): ParsedElement | null {
  const xMatch = shapeXml.match(/<a:off[^>]*x="([^"]*)"[^>]*\/?>/);
  const yMatch = shapeXml.match(/<a:off[^>]*y="([^"]*)"[^>]*\/?>/);
  const cxMatch = shapeXml.match(/<a:ext[^>]*cx="([^"]*)"[^>]*\/?>/);
  const cyMatch = shapeXml.match(/<a:ext[^>]*cy="([^"]*)"[^>]*\/?>/);

  const x = xMatch ? parseInt(xMatch[1]) / 914400 : 0.5;
  const y = yMatch ? parseInt(yMatch[1]) / 914400 : 0.5;
  const width = cxMatch ? parseInt(cxMatch[1]) / 914400 : 5;
  const height = cyMatch ? parseInt(cyMatch[1]) / 914400 : 1;

  const textMatches = shapeXml.match(/<a:t>([^<]*)<\/a:t>/g);
  const content = textMatches
    ? textMatches.map((m: string) => m.replace(/<\/?a:t>/g, '')).join('\n')
    : '';

  if (content === '&' || content === '') {
    const isWatermark = shapeXml.includes('fill="none"') || shapeXml.includes('rad="true"');
    if (isWatermark) return null;
  }

  const style: Record<string, unknown> = {};

  const fontSizeMatch = shapeXml.match(/<a:defRPr[^>]*sz="([^"]*)"[^>]*\/?>/);
  if (fontSizeMatch) style.fontSize = parseInt(fontSizeMatch[1]) / 100;

  const colorMatch = shapeXml.match(/<a:srgbClr[^>]*val="([^"]*)"[^>]*\/?>/);
  if (colorMatch) style.color = '#' + colorMatch[1];
  else style.color = '#ffffff';

  const boldMatch = shapeXml.match(/<a:defRPr[^>]*b="1"[^>]*\/?>/);
  if (boldMatch || shapeXml.includes('<a:defRPr b="1"')) style.bold = true;

  const alignMatch = shapeXml.match(/<a:algn[^>]*val="([^"]*)"[^>]*\/?>/);
  if (alignMatch) style.align = alignMatch[1];

  return {
    id: 'element-' + id,
    type: 'text',
    x,
    y,
    width,
    height,
    content: decodeXml(content),
    style,
  };
}

function parsePictureElement(picXml: string, id: number): ParsedElement | null {
  const xMatch = picXml.match(/<a:off[^>]*x="([^"]*)"[^>]*\/?>/);
  const yMatch = picXml.match(/<a:off[^>]*y="([^"]*)"[^>]*\/?>/);
  const cxMatch = picXml.match(/<a:ext[^>]*cx="([^"]*)"[^>]*\/?>/);
  const cyMatch = picXml.match(/<a:ext[^>]*cy="([^"]*)"[^>]*\/?>/);

  const x = xMatch ? parseInt(xMatch[1]) / 914400 : 0.5;
  const y = yMatch ? parseInt(yMatch[1]) / 914400 : 0.5;
  const width = cxMatch ? parseInt(cxMatch[1]) / 914400 : 5;
  const height = cyMatch ? parseInt(cyMatch[1]) / 914400 : 3;

  const embedMatch = picXml.match(/r:embed="([^"]*)"[^>]*\/?>/);
  const imageUrl = embedMatch ? 'embedded://' + embedMatch[1] : undefined;

  if (!imageUrl) return null;

  return {
    id: 'element-' + id,
    type: 'image',
    x,
    y,
    width,
    height,
    imageUrl,
  };
}

function parseGraphicFrameElement(frameXml: string, id: number): ParsedElement | null {
  const xMatch = frameXml.match(/<a:off[^>]*x="([^"]*)"[^>]*\/?>/);
  const yMatch = frameXml.match(/<a:off[^>]*y="([^"]*)"[^>]*\/?>/);
  const cxMatch = frameXml.match(/<a:ext[^>]*cx="([^"]*)"[^>]*\/?>/);
  const cyMatch = frameXml.match(/<a:ext[^>]*cy="([^"]*)"[^>]*\/?>/);

  const x = xMatch ? parseInt(xMatch[1]) / 914400 : 0.5;
  const y = yMatch ? parseInt(yMatch[1]) / 914400 : 0.5;
  const width = cxMatch ? parseInt(cxMatch[1]) / 914400 : 5;
  const height = cyMatch ? parseInt(cyMatch[1]) / 914400 : 3;

  if (frameXml.includes('<a:tbl>')) {
    return parseTableElement(frameXml, id, x, y, width, height);
  }

  if (frameXml.includes('<c:chart') || frameXml.includes('<c:catAx')) {
    return {
      id: 'element-' + id,
      type: 'chart',
      x,
      y,
      width,
      height,
      chartType: 'bar',
    };
  }

  return null;
}

function parseTableElement(
  tableXml: string,
  id: number,
  x: number,
  y: number,
  width: number,
  height: number
): ParsedElement {
  const rows: string[][] = [];

  const rowMatches = tableXml.match(/<a:tr[^>]*>[\s\S]*?<\/a:tr>/g) || [];
  for (const rowMatch of rowMatches) {
    const cells: string[] = [];
    const cellMatches = rowMatch.match(/<a:tc[^>]*>[\s\S]*?<\/a:tc>/g) || [];

    for (const cellMatch of cellMatches) {
      const textMatch = cellMatch.match(/<a:t>([^<]*)<\/a:t>/);
      cells.push(textMatch ? decodeXml(textMatch[1]) : '');
    }

    if (cells.length > 0) {
      rows.push(cells);
    }
  }

  return {
    id: 'element-' + id,
    type: 'table',
    x,
    y,
    width,
    height,
    rows,
  };
}
