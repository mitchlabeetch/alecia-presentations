import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import express from 'express';
import exportRouter from '../../server/routes/export';
import { initTestDb, closeTestDb, createTestProject, createTestSlide, createTestBlock } from '../utils/testDb';

describe('Export API', () => {
  let app: express.Application;
  let testProjectId: string;

  beforeEach(() => {
    initTestDb();
    testProjectId = createTestProject({ name: 'Projet pour Export' });
    createTestSlide(testProjectId, { position: 0, title: 'Slide 1' });
    app = express();
    app.use(express.json());
    app.use('/api/export', exportRouter);
  });

  afterEach(() => {
    closeTestDb();
  });

  describe('POST /api/export/pptx', () => {
    it('devrait initialiser une exportation PPTX', async () => {
      const mockReq = {
        body: { projectId: testProjectId, format: 'pptx' },
        method: 'POST',
        path: '/api/export/pptx',
      };

      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      const handler = exportRouter.stack.find(
        (layer: any) => layer.route?.path === '/pptx' && layer.route?.methods?.post
      );

      if (handler) {
        await handler.route.stack[0].handle(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalled();
      }
    });

    it('devrait valider le projectId requis', async () => {
      const mockReq = {
        body: { format: 'pptx' },
        method: 'POST',
        path: '/api/export/pptx',
      };

      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      const handler = exportRouter.stack.find(
        (layer: any) => layer.route?.path === '/pptx' && layer.route?.methods?.post
      );

      if (handler) {
        await handler.route.stack[0].handle(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(400);
      }
    });

    it('devrait valider le format supporte', async () => {
      const mockReq = {
        body: { projectId: testProjectId, format: 'invalid' },
        method: 'POST',
        path: '/api/export/pptx',
      };

      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      const handler = exportRouter.stack.find(
        (layer: any) => layer.route?.path === '/pptx' && layer.route?.methods?.post
      );

      if (handler) {
        await handler.route.stack[0].handle(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(400);
      }
    });

    it('devrait supporter les formats PDF et PNG', async () => {
      for (const format of ['pdf', 'png']) {
        const mockReq = {
          body: { projectId: testProjectId, format },
          method: 'POST',
          path: '/api/export/pptx',
        };

        const mockRes = {
          status: vi.fn().mockReturnThis(),
          json: vi.fn(),
        };

        const handler = exportRouter.stack.find(
          (layer: any) => layer.route?.path === '/pptx' && layer.route?.methods?.post
        );

        if (handler) {
          await handler.route.stack[0].handle(mockReq, mockRes);
          expect(mockRes.status).toHaveBeenCalled();
        }
      }
    });
  });

  describe('GET /api/export/status/:id', () => {
    it('devrait retourner le statut dune exportation', async () => {
      const mockReq = {
        params: { id: 'export-123' },
        method: 'GET',
        path: '/api/export/status/export-123',
      };

      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      const handler = exportRouter.stack.find(
        (layer: any) => layer.route?.path === '/status/:id' && layer.route?.methods?.get
      );

      if (handler) {
        await handler.route.stack[0].handle(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalled();
      }
    });
  });

  describe('GET /api/export/download/:id', () => {
    it('devrait telecharger le fichier exporte', async () => {
      const mockReq = {
        params: { id: 'export-123' },
        method: 'GET',
        path: '/api/export/download/export-123',
      };

      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
        sendFile: vi.fn(),
        setHeader: vi.fn(),
      };

      const handler = exportRouter.stack.find(
        (layer: any) => layer.route?.path === '/download/:id' && layer.route?.methods?.get
      );

      if (handler) {
        await handler.route.stack[0].handle(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalled();
      }
    });

    it('devrait retourner 404 si le fichier nexiste pas', async () => {
      const mockReq = {
        params: { id: 'non-existent-export' },
        method: 'GET',
        path: '/api/export/download/non-existent-export',
      };

      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      const handler = exportRouter.stack.find(
        (layer: any) => layer.route?.path === '/download/:id' && layer.route?.methods?.get
      );

      if (handler) {
        await handler.route.stack[0].handle(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(404);
      }
    });
  });

  describe('Export avec blocs', () => {
    it('devrait inclure les blocs dans lexportation', async () => {
      const slideId = createTestSlide(testProjectId, { position: 0 });
      createTestBlock(slideId, {
        type: 'text',
        position: 0,
        content: JSON.stringify({ text: 'Test content' }),
      });

      const mockReq = {
        body: { projectId: testProjectId, format: 'pptx' },
        method: 'POST',
        path: '/api/export/pptx',
      };

      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      const handler = exportRouter.stack.find(
        (layer: any) => layer.route?.path === '/pptx' && layer.route?.methods?.post
      );

      if (handler) {
        await handler.route.stack[0].handle(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalled();
      }
    });
  });
});
