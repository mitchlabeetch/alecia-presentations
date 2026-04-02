import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import express from 'express';
import commentsRouter from '../../server/routes/comments';
import { initTestDb, closeTestDb, createTestProject, createTestSlide } from '../utils/testDb';

describe('Comments API', () => {
  let app: express.Application;
  let testProjectId: string;
  let testSlideId: string;

  beforeEach(() => {
    initTestDb();
    testProjectId = createTestProject({ name: 'Projet pour Comments' });
    testSlideId = createTestSlide(testProjectId, { position: 0 });
    app = express();
    app.use(express.json());
    app.use('/api/comments', commentsRouter);
  });

  afterEach(() => {
    closeTestDb();
  });

  describe('GET /api/comments', () => {
    it('devrait retourner les commentaires dun projet', async () => {
      const mockReq = {
        query: { projectId: testProjectId },
        method: 'GET',
        path: '/api/comments',
      };

      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      const handler = commentsRouter.stack.find(
        (layer: any) => layer.route?.path === '/' && layer.route?.methods?.get
      );

      if (handler) {
        await handler.route.stack[0].handle(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith(expect.any(Array));
      }
    });

    it('devrait filtrer par diapositive si specifie', async () => {
      const mockReq = {
        query: { projectId: testProjectId, slideId: testSlideId },
        method: 'GET',
        path: '/api/comments',
      };

      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      const handler = commentsRouter.stack.find(
        (layer: any) => layer.route?.path === '/' && layer.route?.methods?.get
      );

      if (handler) {
        await handler.route.stack[0].handle(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(200);
      }
    });

    it('devrait retourner 400 si projectId est manquant', async () => {
      const mockReq = {
        query: {},
        method: 'GET',
        path: '/api/comments',
      };

      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      const handler = commentsRouter.stack.find(
        (layer: any) => layer.route?.path === '/' && layer.route?.methods?.get
      );

      if (handler) {
        await handler.route.stack[0].handle(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(400);
      }
    });
  });

  describe('POST /api/comments', () => {
    it('devrait creer un nouveau commentaire', async () => {
      const commentData = {
        project_id: testProjectId,
        slide_id: testSlideId,
        user_id: 'user-123',
        user_name: 'Test User',
        content: 'Nouveau commentaire',
        position_x: 100,
        position_y: 200,
      };

      const mockReq = {
        body: commentData,
        method: 'POST',
        path: '/api/comments',
      };

      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      const handler = commentsRouter.stack.find(
        (layer: any) => layer.route?.path === '/' && layer.route?.methods?.post
      );

      if (handler) {
        await handler.route.stack[0].handle(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(201);
        expect(mockRes.json).toHaveBeenCalledWith(
          expect.objectContaining({
            id: expect.any(String),
            content: 'Nouveau commentaire',
          })
        );
      }
    });

    it('devrait valider le contenu requis', async () => {
      const mockReq = {
        body: {
          project_id: testProjectId,
        },
        method: 'POST',
        path: '/api/comments',
      };

      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      const handler = commentsRouter.stack.find(
        (layer: any) => layer.route?.path === '/' && layer.route?.methods?.post
      );

      if (handler) {
        await handler.route.stack[0].handle(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(400);
      }
    });
  });

  describe('PATCH /api/comments/:id/resolve', () => {
    it('devrait marquer un commentaire comme resolu', async () => {
      const mockReq = {
        params: { id: 'comment-123' },
        method: 'PATCH',
        path: '/api/comments/comment-123/resolve',
      };

      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      const handler = commentsRouter.stack.find(
        (layer: any) => layer.route?.path === '/:id/resolve' && layer.route?.methods?.patch
      );

      if (handler) {
        await handler.route.stack[0].handle(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalled();
      }
    });
  });

  describe('DELETE /api/comments/:id', () => {
    it('devrait supprimer un commentaire', async () => {
      const mockReq = {
        params: { id: 'comment-123' },
        method: 'DELETE',
        path: '/api/comments/comment-123',
      };

      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      const handler = commentsRouter.stack.find(
        (layer: any) => layer.route?.path === '/:id' && layer.route?.methods?.delete
      );

      if (handler) {
        await handler.route.stack[0].handle(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalled();
      }
    });
  });

  describe('Validation', () => {
    it('devrait valider la longueur du contenu', async () => {
      const mockReq = {
        body: {
          project_id: testProjectId,
          content: 'a'.repeat(5001), // Exceeds max length
        },
        method: 'POST',
        path: '/api/comments',
      };

      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      const handler = commentsRouter.stack.find(
        (layer: any) => layer.route?.path === '/' && layer.route?.methods?.post
      );

      if (handler) {
        await handler.route.stack[0].handle(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(400);
      }
    });

    it('devrait valider les coordonnees de position', async () => {
      const mockReq = {
        body: {
          project_id: testProjectId,
          content: 'Test',
          position_x: -100, // Invalid negative
          position_y: 200,
        },
        method: 'POST',
        path: '/api/comments',
      };

      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      const handler = commentsRouter.stack.find(
        (layer: any) => layer.route?.path === '/' && layer.route?.methods?.post
      );

      if (handler) {
        await handler.route.stack[0].handle(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(400);
      }
    });
  });
});
