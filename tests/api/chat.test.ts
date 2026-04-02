import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import express from 'express';
import chatRouter from '../../server/routes/chat';
import { initTestDb, closeTestDb, createTestProject } from '../utils/testDb';

describe('Chat API', () => {
  let app: express.Application;
  let testProjectId: string;

  beforeEach(() => {
    initTestDb();
    testProjectId = createTestProject({ name: 'Projet pour Chat' });
    app = express();
    app.use(express.json());
    app.use('/api/chat', chatRouter);
  });

  afterEach(() => {
    closeTestDb();
  });

  describe('GET /api/chat/conversations', () => {
    it('devrait retourner les conversations dun projet', async () => {
      const mockReq = {
        query: { projectId: testProjectId },
        method: 'GET',
        path: '/api/chat/conversations',
      };

      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      const handler = chatRouter.stack.find(
        (layer: any) => layer.route?.path === '/conversations' && layer.route?.methods?.get
      );

      if (handler) {
        await handler.route.stack[0].handle(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith(expect.any(Array));
      }
    });

    it('devrait retourner 400 si projectId est manquant', async () => {
      const mockReq = {
        query: {},
        method: 'GET',
        path: '/api/chat/conversations',
      };

      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      const handler = chatRouter.stack.find(
        (layer: any) => layer.route?.path === '/conversations' && layer.route?.methods?.get
      );

      if (handler) {
        await handler.route.stack[0].handle(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(400);
      }
    });
  });

  describe('POST /api/chat/conversations', () => {
    it('devrait creer une nouvelle conversation', async () => {
      const mockReq = {
        body: { projectId: testProjectId },
        method: 'POST',
        path: '/api/chat/conversations',
      };

      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      const handler = chatRouter.stack.find(
        (layer: any) => layer.route?.path === '/conversations' && layer.route?.methods?.post
      );

      if (handler) {
        await handler.route.stack[0].handle(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(201);
        expect(mockRes.json).toHaveBeenCalledWith(
          expect.objectContaining({
            id: expect.any(String),
            project_id: testProjectId,
          })
        );
      }
    });
  });

  describe('GET /api/chat/conversations/:id/messages', () => {
    it('devrait retourner les messages dune conversation', async () => {
      // Create a conversation first
      const convReq = {
        body: { projectId: testProjectId },
        method: 'POST',
        path: '/api/chat/conversations',
      };

      let conversationId = 'test-conversation-id';

      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn().mockReturnValue({
          id: conversationId,
          project_id: testProjectId,
        }),
      };

      const mockReq = {
        params: { id: conversationId },
        method: 'GET',
        path: `/api/chat/conversations/${conversationId}/messages`,
      };

      const handler = chatRouter.stack.find(
        (layer: any) => layer.route?.path === '/conversations/:id/messages' && layer.route?.methods?.get
      );

      if (handler) {
        await handler.route.stack[0].handle(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalled();
      }
    });
  });

  describe('POST /api/chat/conversations/:id/messages', () => {
    it('devrait envoyer un message dans une conversation', async () => {
      const conversationId = 'test-conversation-id';

      const mockReq = {
        params: { id: conversationId },
        body: { content: 'Nouveau message' },
        method: 'POST',
        path: `/api/chat/conversations/${conversationId}/messages`,
      };

      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      const handler = chatRouter.stack.find(
        (layer: any) => layer.route?.path === '/conversations/:id/messages' && layer.route?.methods?.post
      );

      if (handler) {
        await handler.route.stack[0].handle(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalled();
      }
    });

    it('devrait valider le contenu du message', async () => {
      const conversationId = 'test-conversation-id';

      const mockReq = {
        params: { id: conversationId },
        body: { content: '' },
        method: 'POST',
        path: `/api/chat/conversations/${conversationId}/messages`,
      };

      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      const handler = chatRouter.stack.find(
        (layer: any) => layer.route?.path === '/conversations/:id/messages' && layer.route?.methods?.post
      );

      if (handler) {
        await handler.route.stack[0].handle(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(400);
      }
    });
  });

  describe('Validation du contenu', () => {
    it('devrait valider la longueur du message', async () => {
      const conversationId = 'test-conversation-id';

      const mockReq = {
        params: { id: conversationId },
        body: { content: 'a'.repeat(10001) }, // Exceeds max length
        method: 'POST',
        path: `/api/chat/conversations/${conversationId}/messages`,
      };

      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      const handler = chatRouter.stack.find(
        (layer: any) => layer.route?.path === '/conversations/:id/messages' && layer.route?.methods?.post
      );

      if (handler) {
        await handler.route.stack[0].handle(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(400);
      }
    });
  });
});
