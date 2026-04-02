import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { existsSync, mkdirSync } from 'fs';
import type { Request } from 'express';

const uploadsDir = path.join(process.cwd(), 'uploads');
if (!existsSync(uploadsDir)) {
  mkdirSync(uploadsDir, { recursive: true });
}

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
const ALLOWED_DOC_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
];

const ALL_ALLOWED_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_DOC_TYPES];

const maxSize = parseInt(process.env.MAX_UPLOAD_SIZE_MB || '10', 10) * 1024 * 1024;

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname).toLowerCase()}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (ALL_ALLOWED_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Type de fichier non supporté : ${file.mimetype}. Types acceptés : images (JPEG, PNG, GIF, WebP, SVG) et documents (PDF, PPTX, DOCX, XLSX)`));
  }
};

export const upload = multer({
  storage,
  limits: { fileSize: maxSize },
  fileFilter,
});

export default upload;
