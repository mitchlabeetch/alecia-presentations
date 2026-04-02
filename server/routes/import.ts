import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { getDb, saveDb, execQuery } from '../db/index.js';
import { createError } from '../middleware/errorHandler.js';
import { mkdirSync, existsSync, unlinkSync } from 'fs';

const router = Router();

const UPLOAD_DIR = path.join(process.cwd(), 'uploads', 'imports');
if (!existsSync(UPLOAD_DIR)) {
  mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (['.pptx', '.ppt', '.pdf'].includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Type de fichier non supporté. Utilisez PPTX, PPT ou PDF.'));
    }
  },
});

router.post('/pptx', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      throw createError('Aucun fichier fourni', 400);
    }

    const fileId = uuidv4();
    const db = await getDb();
    db.run(`
      INSERT INTO uploads (id, project_id, file_path, file_name, file_type, file_size, created_at)
      VALUES (?, NULL, ?, ?, 'pptx', ?, ?)
    `, [fileId, req.file.path, req.file.originalname, req.file.size, Date.now()]);
    saveDb();

    res.json({
      success: true,
      data: { fileId, originalName: req.file.originalname, path: req.file.path },
      message: 'Fichier importé. Utilisez /api/import/convert pour convertir.',
    });
  } catch (error) {
    next(error);
  }
});

router.post('/pdf', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      throw createError('Aucun fichier fourni', 400);
    }

    const fileId = uuidv4();
    const db = await getDb();
    db.run(`
      INSERT INTO uploads (id, project_id, file_path, file_name, file_type, file_size, created_at)
      VALUES (?, NULL, ?, ?, 'pdf', ?, ?)
    `, [fileId, req.file.path, req.file.originalname, req.file.size, Date.now()]);
    saveDb();

    res.json({
      success: true,
      data: { fileId, originalName: req.file.originalname, path: req.file.path },
      message: 'Fichier PDF importé.',
    });
  } catch (error) {
    next(error);
  }
});

router.post('/convert', async (req, res, next) => {
  try {
    const { fileId, projectId } = req.body;

    if (!fileId) {
      throw createError('ID de fichier requis', 400);
    }

    const uploads = execQuery<{
      id: string;
      file_path: string;
      file_name: string;
      file_type: string;
    }>('SELECT * FROM uploads WHERE id = ?', [fileId]);
    const uploadRecord = uploads[0];

    if (!uploadRecord) {
      throw createError('Fichier non trouvé', 404);
    }

    const fallbackSlides = [
      {
        type: 'Titre',
        title: 'Diapositive 1',
        content: { text: 'Contenu importé depuis ' + uploadRecord.file_name },
        notes: null,
      },
    ];

    const slides = fallbackSlides.map((slide, index) => ({
      id: uuidv4(),
      projectId: projectId || null,
      orderIndex: index,
      type: slide.type,
      title: slide.title,
      content: slide.content,
      notes: slide.notes,
    }));

    if (projectId) {
      const db = await getDb();
      const lastSlide = execQuery<{ maxIndex: number | null }>(
        'SELECT MAX(order_index) as maxIndex FROM slides WHERE project_id = ?',
        [projectId]
      );
      const startIndex = ((lastSlide[0]?.maxIndex) ?? -1) + 1;

      for (let i = 0; i < slides.length; i++) {
        const slide = slides[i];
        db.run(`
          INSERT INTO slides (id, project_id, order_index, type, title, content, notes, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          slide.id,
          projectId,
          startIndex + i,
          slide.type,
          slide.title,
          JSON.stringify(slide.content),
          slide.notes,
          Date.now(),
          Date.now(),
        ]);
      }
      saveDb();
    }

    res.json({
      success: true,
      data: { slides, slideCount: slides.length },
      message: projectId
        ? `${slides.length} diapositives créées`
        : 'Conversion terminée. Spécifiez projectId pour enregistrer.',
    });
  } catch (error) {
    next(error);
  }
});

router.get('/health', (_req, res) => {
  res.json({
    success: true,
    data: { status: 'available', message: 'Service d\'import prêt' },
  });
});

export default router;
