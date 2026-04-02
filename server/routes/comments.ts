import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDb, saveDb, execQuery, getOne } from '../db/index.js';
import { createError } from '../middleware/errorHandler.js';
import { OpenAI } from 'openai';

const router = Router();

router.get('/slide/:slideId', async (req, res, next) => {
  try {
    const { slideId } = req.params;
    const { resolved } = req.query;

    let query = `
      SELECT 
        id, slide_id as slideId, project_id as projectId, author_tag as authorTag,
        field, text, resolved, ai_response as aiResponse,
        parent_comment_id as parentCommentId, created_at as createdAt
      FROM comments
      WHERE slide_id = ?
    `;
    const params: (string | number)[] = [slideId];

    if (resolved !== undefined) {
      query += ' AND resolved = ?';
      params.push(resolved === 'true' ? 1 : 0);
    }

    query += ' ORDER BY created_at ASC';

    const comments = execQuery(query, params);

    res.json(comments);
  } catch (error) {
    next(error);
  }
});

router.get('/project/:projectId', async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { resolved, slideId } = req.query;

    let query = `
      SELECT 
        id, slide_id as slideId, project_id as projectId, author_tag as authorTag,
        field, text, resolved, ai_response as aiResponse,
        parent_comment_id as parentCommentId, created_at as createdAt
      FROM comments
      WHERE project_id = ?
    `;
    const params: (string | number)[] = [projectId];

    if (resolved !== undefined) {
      query += ' AND resolved = ?';
      params.push(resolved === 'true' ? 1 : 0);
    }

    if (slideId) {
      query += ' AND slide_id = ?';
      params.push(slideId as string);
    }

    query += ' ORDER BY created_at ASC';

    const comments = execQuery(query, params);

    res.json(comments);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { slideId, projectId, authorTag, field, text, parentCommentId } = req.body;
    const db = await getDb();
    const now = Date.now();
    const id = uuidv4();

    db.run(`
      INSERT INTO comments (
        id, slide_id, project_id, author_tag, field, text,
        resolved, parent_comment_id, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, 0, ?, ?)
    `, [id, slideId, projectId, authorTag || null, field || null, text, parentCommentId || null, now]);
    saveDb();

    const comments = execQuery(`
      SELECT 
        id, slide_id as slideId, project_id as projectId, author_tag as authorTag,
        field, text, resolved, ai_response as aiResponse,
        parent_comment_id as parentCommentId, created_at as createdAt
      FROM comments WHERE id = ?
    `, [id]);

    res.status(201).json(comments[0]);
  } catch (error) {
    next(error);
  }
});

router.patch('/:commentId', async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const { text, resolved } = req.body;

    const updates: string[] = [];
    const params: (string | number | null)[] = [];

    if (text !== undefined) {
      updates.push('text = ?');
      params.push(text);
    }

    if (resolved !== undefined) {
      updates.push('resolved = ?');
      params.push(resolved ? 1 : 0);
    }

    if (updates.length === 0) {
      throw createError('Aucune mise à jour fournie', 400);
    }

    params.push(commentId);

    const db = await getDb();
    db.run(`UPDATE comments SET ${updates.join(', ')} WHERE id = ?`, params);
    saveDb();

    res.json({ message: 'Commentaire mis à jour avec succès' });
  } catch (error) {
    next(error);
  }
});

router.delete('/:commentId', async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const db = await getDb();

    db.run('DELETE FROM comments WHERE parent_comment_id = ?', [commentId]);
    db.run('DELETE FROM comments WHERE id = ?', [commentId]);
    saveDb();

    res.json({ message: 'Commentaire supprimé avec succès' });
  } catch (error) {
    next(error);
  }
});

router.post('/:commentId/resolve', async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const db = await getDb();

    const existing = getOne<{ resolved: number }>('SELECT resolved FROM comments WHERE id = ?', [commentId]);
    if (!existing) {
      throw createError('Commentaire non trouvé', 404);
    }

    const newStatus = existing.resolved === 1 ? 0 : 1;
    db.run('UPDATE comments SET resolved = ? WHERE id = ?', [newStatus, commentId]);
    saveDb();

    res.json({ message: newStatus === 1 ? 'Commentaire résolu' : 'Résolution annulée' });
  } catch (error) {
    next(error);
  }
});

router.post('/:commentId/ai-response', async (req, res, next) => {
  try {
    const { commentId } = req.params;

    const comments = execQuery('SELECT * FROM comments WHERE id = ?', [commentId]);
    const comment = comments[0];

    if (!comment) {
      throw createError('Commentaire non trouvé', 404);
    }

    const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw createError('Configuration IA manquante', 500);
    }

    const openai = new OpenAI({ 
      apiKey,
      baseURL: process.env.OPENAI_BASE_URL || 'https://openrouter.ai/api/v1'
    });

    const response = await openai.chat.completions.create({
      model: 'anthropic/claude-3.5-sonnet',
      messages: [
        { 
          role: 'system', 
          content: 'Tu es un assistant expert en finance M&A pour alecia. Réponds toujours en français de manière claire et professionnelle.'
        },
        { role: 'user', content: `Réponds au commentaire suivant:\n"${comment.text}"` },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const aiResponse = response.choices[0]?.message?.content || 'Je n\'ai pas pu générer de réponse.';

    const db = await getDb();
    db.run('UPDATE comments SET ai_response = ? WHERE id = ?', [aiResponse, commentId]);
    saveDb();

    res.json({ response: aiResponse });
  } catch (error) {
    next(error);
  }
});

export default router;
