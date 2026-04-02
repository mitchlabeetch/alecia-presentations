import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { OpenAI } from 'openai';
import { getDb, saveDb, execQuery } from '../db/index.js';
import { createError } from '../middleware/errorHandler.js';

const router = Router();

router.get('/providers', (_req, res) => {
  const providers = [
    { id: 'openrouter', name: 'OpenRouter', supportsStreaming: true, defaultModel: 'anthropic/claude-3.5-sonnet' },
    { id: 'openai', name: 'OpenAI', supportsStreaming: true, defaultModel: 'gpt-4' },
    { id: 'anthropic', name: 'Anthropic', supportsStreaming: true, defaultModel: 'claude-3-5-sonnet-20241022' },
  ];

  res.json({ success: true, data: providers });
});

router.get('/:projectId', async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { limit = '50' } = req.query;

    const limitNum = Math.min(parseInt(limit as string, 10) || 50, 200);

    const messages = execQuery(`
      SELECT id, project_id as projectId, role, content, created_at as createdAt
      FROM chat_messages
      WHERE project_id = ?
      ORDER BY created_at DESC
      LIMIT ?
    `, [projectId, limitNum]);

    messages.reverse();

    res.json({ success: true, data: messages, total: messages.length });
  } catch (error) {
    next(error);
  }
});

router.post('/:projectId', async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { content, provider, model } = req.body;

    if (!content || content.trim().length === 0) {
      throw createError('Le message ne peut pas être vide', 400);
    }

    const db = await getDb();
    const now = Date.now();
    const userMessageId = uuidv4();
    const assistantMessageId = uuidv4();

    db.run(`
      INSERT INTO chat_messages (id, project_id, role, content, created_at)
      VALUES (?, ?, ?, ?, ?)
    `, [userMessageId, projectId, 'user', content, now]);
    saveDb();

    const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw createError('Configuration API IA manquante', 500);
    }

    const openai = new OpenAI({ 
      apiKey,
      baseURL: process.env.OPENAI_BASE_URL || 'https://openrouter.ai/api/v1'
    });

    const systemPrompt = `Tu es un expert en M&A pour PME et ETI françaises. Tu travailles pour alecia, un cabinet de conseil financier indépendant. Réponds toujours en français.`;

    const response = await openai.chat.completions.create({
      model: model || 'anthropic/claude-3.5-sonnet',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const assistantContent = response.choices[0]?.message?.content || 'Je n\'ai pas pu générer de réponse.';

    db.run(`
      INSERT INTO chat_messages (id, project_id, role, content, created_at)
      VALUES (?, ?, ?, ?, ?)
    `, [assistantMessageId, projectId, 'assistant', assistantContent, Date.now()]);
    saveDb();

    res.json({
      success: true,
      data: {
        message: {
          id: assistantMessageId,
          role: 'assistant',
          content: assistantContent,
          createdAt: Date.now(),
        },
        usage: response.usage,
        provider: provider || 'openrouter',
        model: model || 'anthropic/claude-3.5-sonnet',
      },
    });
  } catch (error) {
    next(error);
  }
});

router.post('/:projectId/stream', async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { content, provider, model } = req.body;

    if (!content || content.trim().length === 0) {
      throw createError('Le message ne peut pas être vide', 400);
    }

    const db = await getDb();
    const now = Date.now();
    const userMessageId = uuidv4();
    const assistantMessageId = uuidv4();

    db.run(`
      INSERT INTO chat_messages (id, project_id, role, content, created_at)
      VALUES (?, ?, ?, ?, ?)
    `, [userMessageId, projectId, 'user', content, now]);
    saveDb();

    const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw createError('Configuration API IA manquante', 500);
    }

    const openai = new OpenAI({ 
      apiKey,
      baseURL: process.env.OPENAI_BASE_URL || 'https://openrouter.ai/api/v1'
    });

    const systemPrompt = `Tu es un expert en M&A pour PME et ETI françaises. Tu travailles pour alecia. Réponds toujours en français.`;

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    });

    let fullContent = '';

    try {
      const stream = await openai.chat.completions.create({
        model: model || 'anthropic/claude-3.5-sonnet',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content },
        ],
        temperature: 0.7,
        max_tokens: 2000,
        stream: true,
      });

      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content || '';
        if (delta) {
          fullContent += delta;
          res.write(`data: ${JSON.stringify({ content: delta })}\n\n`);
        }
      }

      db.run(`
        INSERT INTO chat_messages (id, project_id, role, content, created_at)
        VALUES (?, ?, ?, ?, ?)
      `, [assistantMessageId, projectId, 'assistant', fullContent, Date.now()]);
      saveDb();

      res.write(`data: ${JSON.stringify({ done: true, messageId: assistantMessageId })}\n\n`);
    } catch (streamError) {
      fullContent = 'Erreur lors de la génération de la réponse.';
      res.write(`data: ${JSON.stringify({ error: fullContent })}\n\n`);
    }

    res.end();
  } catch (error) {
    if (!res.headersSent) {
      next(error);
    } else {
      res.end();
    }
  }
});

router.delete('/:projectId', async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const db = await getDb();

    db.run('DELETE FROM chat_messages WHERE project_id = ?', [projectId]);
    saveDb();

    res.json({ success: true, message: 'Historique du chat supprimé avec succès' });
  } catch (error) {
    next(error);
  }
});

export default router;
