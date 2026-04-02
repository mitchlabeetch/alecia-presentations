/**
 * Alecia Presentation Builder - Docling Service
 * Client TypeScript pour communiquer avec le Python Docling Sidecar
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import { Readable } from 'stream';
import FormData from 'form-data';
import type { SlideType, SlideContent } from '../types/index.js';

// ============================================================================
// Configuration
// ============================================================================

const DOCLING_URL = process.env.DOCLING_SIDECAR_URL || 'http://localhost:8000';
const REQUEST_TIMEOUT = 60000; // 60 secondes

// ============================================================================
// Types
// ============================================================================

export interface DoclingSlideContent {
  text?: string;
  subtitle?: string;
  items?: string[];
  image_url?: string;
  table_data?: Record<string, unknown>;
  chart_type?: string;
  chart_data?: Record<string, unknown>;
  quote?: string;
  author?: string;
  kpis?: Array<{
    label: string;
    value: string;
    change?: string;
    trend?: 'up' | 'down' | 'neutral';
  }>;
  timeline?: Array<{
    date: string;
    title: string;
    description?: string;
  }>;
  team?: Array<{
    name: string;
    role: string;
    image?: string;
  }>;
  sections?: string[];
  metadata?: Record<string, unknown>;
}

export interface DoclingSlide {
  order_index: number;
  type: string;
  title: string;
  content: DoclingSlideContent;
  notes?: string;
  image_path?: string;
}

export interface DoclingConversionResponse {
  status: 'success' | 'error';
  slides?: DoclingSlide[];
  document?: Record<string, unknown>;
  error?: string;
  filename?: string;
  slide_count?: number;
}

export interface DoclingBatchItemResult {
  filename: string;
  status: 'success' | 'error';
  slides?: DoclingSlide[];
  error?: string;
}

export interface DoclingBatchResponse {
  status: string;
  results: DoclingBatchItemResult[];
  total_count: number;
  success_count: number;
  error_count: number;
}

export interface DoclingValidationResult {
  status: 'valid';
  filename: string;
  extension: string;
  size: number;
  size_mb: number;
  supported: boolean;
}

export interface DoclingHealthResponse {
  status: 'ok';
  service: string;
  version: string;
}

// ============================================================================
// Client Docling
// ============================================================================

class DoclingClient {
  private client: AxiosInstance;

  constructor(baseURL: string = DOCLING_URL) {
    this.client = axios.create({
      baseURL,
      timeout: REQUEST_TIMEOUT,
      headers: {
        'Accept': 'application/json',
      },
    });
  }

  /**
   * Vérifie que le service Docling est disponible
   */
  async healthCheck(): Promise<DoclingHealthResponse> {
    try {
      const response = await this.client.get<DoclingHealthResponse>('/health');
      return response.data;
    } catch (error) {
      throw new DoclingServiceError(
        'Le service Docling est inaccessible',
        error as AxiosError
      );
    }
  }

  /**
   * Valide un fichier sans le convertir
   */
  async validateFile(filePath: string): Promise<DoclingValidationResult> {
    try {
      const formData = new FormData();
      formData.append('file', fs.createReadStream(filePath));

      const response = await this.client.post<DoclingValidationResult>(
        '/validate',
        formData,
        {
          headers: formData.getHeaders(),
        }
      );

      return response.data;
    } catch (error) {
      throw new DoclingServiceError(
        `Erreur lors de la validation du fichier: ${path.basename(filePath)}`,
        error as AxiosError
      );
    }
  }

  /**
   * Convertit un fichier PPTX en slides Alecia
   */
  async convertPPTX(filePath: string): Promise<DoclingConversionResponse> {
    try {
      // Vérifier que le fichier existe
      if (!fs.existsSync(filePath)) {
        return {
          status: 'error',
          error: `Fichier non trouvé: ${filePath}`,
        };
      }

      // Vérifier l'extension
      const ext = path.extname(filePath).toLowerCase();
      if (!['.pptx', '.ppt'].includes(ext)) {
        return {
          status: 'error',
          error: `Type de fichier non supporté: ${ext}`,
        };
      }

      const formData = new FormData();
      formData.append('file', fs.createReadStream(filePath));

      const response = await this.client.post<DoclingConversionResponse>(
        '/convert/pptx',
        formData,
        {
          headers: formData.getHeaders(),
        }
      );

      return response.data;
    } catch (error) {
      console.error('Erreur conversion PPTX:', error);

      // Fallback: retourner une slide générique
      return {
        status: 'error',
        error: error instanceof Error ? error.message : 'Erreur inconnue',
        filename: path.basename(filePath),
      };
    }
  }

  /**
   * Convertit un fichier PDF en slides Alecia
   */
  async convertPDF(filePath: string): Promise<DoclingConversionResponse> {
    try {
      // Vérifier que le fichier existe
      if (!fs.existsSync(filePath)) {
        return {
          status: 'error',
          error: `Fichier non trouvé: ${filePath}`,
        };
      }

      // Vérifier l'extension
      const ext = path.extname(filePath).toLowerCase();
      if (ext !== '.pdf') {
        return {
          status: 'error',
          error: `Type de fichier non supporté: ${ext}`,
        };
      }

      const formData = new FormData();
      formData.append('file', fs.createReadStream(filePath));

      const response = await this.client.post<DoclingConversionResponse>(
        '/convert/pdf',
        formData,
        {
          headers: formData.getHeaders(),
        }
      );

      return response.data;
    } catch (error) {
      console.error('Erreur conversion PDF:', error);

      // Fallback: retourner une slide générique
      return {
        status: 'error',
        error: error instanceof Error ? error.message : 'Erreur inconnue',
        filename: path.basename(filePath),
      };
    }
  }

  /**
   * Convertit un fichier en fonction de son extension
   */
  async convert(filePath: string): Promise<DoclingConversionResponse> {
    const ext = path.extname(filePath).toLowerCase();

    if (ext === '.pdf') {
      return this.convertPDF(filePath);
    } else if (['.pptx', '.ppt'].includes(ext)) {
      return this.convertPPTX(filePath);
    } else {
      return {
        status: 'error',
        error: `Type de fichier non supporté: ${ext}`,
      };
    }
  }

  /**
   * Convertit plusieurs fichiers en une seule requête
   */
  async convertBatch(
    filePaths: string[]
  ): Promise<DoclingBatchResponse> {
    try {
      const formData = new FormData();

      for (const filePath of filePaths) {
        if (fs.existsSync(filePath)) {
          formData.append('files', fs.createReadStream(filePath));
        }
      }

      const response = await this.client.post<DoclingBatchResponse>(
        '/convert/batch',
        formData,
        {
          headers: formData.getHeaders(),
        }
      );

      return response.data;
    } catch (error) {
      throw new DoclingServiceError(
        'Erreur lors de la conversion batch',
        error as AxiosError
      );
    }
  }
}

// ============================================================================
// Erreurs
// ============================================================================

export class DoclingServiceError extends Error {
  constructor(
    message: string,
    public readonly axiosError?: AxiosError
  ) {
    super(message);
    this.name = 'DoclingServiceError';

    if (axiosError?.response) {
      this.message = `${message} (Status: ${axiosError.response.status})`;
    } else if (axiosError?.code === 'ECONNREFUSED') {
      this.message = `${message} - Le service Docling n'est pas accessible`;
    } else if (axiosError?.code === 'ETIMEDOUT') {
      this.message = `${message} - Timeout de la requête`;
    }
  }
}

// ============================================================================
// Instance singleton
// ============================================================================

let doclingClientInstance: DoclingClient | null = null;

export function getDoclingClient(): DoclingClient {
  if (!doclingClientInstance) {
    doclingClientInstance = new DoclingClient(DOCLING_URL);
  }
  return doclingClientInstance;
}

export function resetDoclingClient(): void {
  doclingClientInstance = null;
}

// ============================================================================
// Exports par défaut
// ============================================================================

export default DoclingClient;
