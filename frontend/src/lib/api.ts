import type {
  Project,
  Slide,
  Template,
  Deal,
  Variable,
  Comment,
  ChatMessage,
  AISettings,
  ExportOptions,
  Upload,
} from '@/types';

// ============================================
// Base Configuration
// ============================================

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// ============================================
// Types
// ============================================

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface ChatStreamChunk {
  id: string;
  content: string;
  done: boolean;
}

// ============================================
// Fetch Wrapper with Auth
// ============================================

async function fetchWithAuth(
  input: RequestInfo,
  init: RequestInit = {}
): Promise<Response> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...init.headers,
  };

  // Add auth token if available
  const token = localStorage.getItem('alecia-auth-token');
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${input}`, {
    ...init,
    headers,
  });

  return response;
}

// ============================================
// API Client
// ============================================

export const api = {
  // ============================================
  // Auth API
  // ============================================

  auth: {
    verify: async (pin: string, userTag?: string): Promise<ApiResponse<{
      success: boolean;
      userTag: string;
      hasMasterAccess: boolean;
      token: string;
    }>> => {
      const response = await fetchWithAuth('/auth/verify', {
        method: 'POST',
        body: JSON.stringify({ pin, userTag }),
      });
      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem('alecia-auth-token', data.token);
      }

      return data;
    },

    verifyMaster: async (pin: string): Promise<ApiResponse<{
      success: boolean;
      token: string;
    }>> => {
      const response = await fetchWithAuth('/auth/master', {
        method: 'POST',
        body: JSON.stringify({ pin }),
      });
      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem('alecia-auth-token', data.token);
      }

      return data;
    },

    verifyProjectPin: async (projectId: string, pin: string): Promise<ApiResponse<{
      success: boolean;
    }>> => {
      const response = await fetchWithAuth(`/auth/project/${projectId}`, {
        method: 'POST',
        body: JSON.stringify({ pin }),
      });
      return response.json();
    },

    logout: async (): Promise<void> => {
      localStorage.removeItem('alecia-auth-token');
      await fetchWithAuth('/auth/logout', { method: 'POST' });
    },
  },

  // ============================================
  // Projects API
  // ============================================

  projects: {
    list: async (params?: {
      page?: number;
      limit?: number;
      search?: string;
      sortBy?: 'name' | 'createdAt' | 'updatedAt';
      sortOrder?: 'asc' | 'desc';
    }): Promise<PaginatedResponse<Project>> => {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.set('page', String(params.page));
      if (params?.limit) searchParams.set('limit', String(params.limit));
      if (params?.search) searchParams.set('search', params.search);
      if (params?.sortBy) searchParams.set('sortBy', params.sortBy);
      if (params?.sortOrder) searchParams.set('sortOrder', params.sortOrder);

      const queryString = searchParams.toString();
      const response = await fetchWithAuth(`/projects${queryString ? `?${queryString}` : ''}`);
      return response.json();
    },

    get: async (projectId: string): Promise<ApiResponse<Project>> => {
      const response = await fetchWithAuth(`/projects/${projectId}`);
      return response.json();
    },

    create: async (data: Partial<Project>): Promise<ApiResponse<Project>> => {
      const response = await fetchWithAuth('/projects', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return response.json();
    },

    update: async (projectId: string, data: Partial<Project>): Promise<ApiResponse<Project>> => {
      const response = await fetchWithAuth(`/projects/${projectId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      return response.json();
    },

    delete: async (projectId: string): Promise<ApiResponse<void>> => {
      const response = await fetchWithAuth(`/projects/${projectId}`, {
        method: 'DELETE',
      });
      return response.json();
    },

    duplicate: async (projectId: string, newName?: string): Promise<ApiResponse<Project>> => {
      const response = await fetchWithAuth(`/projects/${projectId}/duplicate`, {
        method: 'POST',
        body: JSON.stringify({ newName }),
      });
      return response.json();
    },

    export: async (
      projectId: string,
      options: ExportOptions
    ): Promise<Blob> => {
      const response = await fetchWithAuth(`/projects/${projectId}/export`, {
        method: 'POST',
        body: JSON.stringify(options),
      });
      return response.blob();
    },
  },

  // ============================================
  // Slides API
  // ============================================

  slides: {
    list: async (projectId: string): Promise<ApiResponse<Slide[]>> => {
      const response = await fetchWithAuth(`/projects/${projectId}/slides`);
      return response.json();
    },

    get: async (projectId: string, slideId: string): Promise<ApiResponse<Slide>> => {
      const response = await fetchWithAuth(`/projects/${projectId}/slides/${slideId}`);
      return response.json();
    },

    create: async (projectId: string, data: Partial<Slide>): Promise<ApiResponse<Slide>> => {
      const response = await fetchWithAuth(`/projects/${projectId}/slides`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return response.json();
    },

    update: async (
      projectId: string,
      slideId: string,
      data: Partial<Slide>
    ): Promise<ApiResponse<Slide>> => {
      const response = await fetchWithAuth(`/projects/${projectId}/slides/${slideId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      return response.json();
    },

    delete: async (projectId: string, slideId: string): Promise<ApiResponse<void>> => {
      const response = await fetchWithAuth(`/projects/${projectId}/slides/${slideId}`, {
        method: 'DELETE',
      });
      return response.json();
    },

    reorder: async (
      projectId: string,
      slideIds: string[]
    ): Promise<ApiResponse<Slide[]>> => {
      const response = await fetchWithAuth(`/projects/${projectId}/slides/reorder`, {
        method: 'PUT',
        body: JSON.stringify({ slideIds }),
      });
      return response.json();
    },

    duplicate: async (
      projectId: string,
      slideId: string
    ): Promise<ApiResponse<Slide>> => {
      const response = await fetchWithAuth(`/projects/${projectId}/slides/${slideId}/duplicate`, {
        method: 'POST',
      });
      return response.json();
    },

    bulkCreate: async (
      projectId: string,
      slides: Partial<Slide>[]
    ): Promise<ApiResponse<Slide[]>> => {
      const response = await fetchWithAuth(`/projects/${projectId}/slides/bulk`, {
        method: 'POST',
        body: JSON.stringify({ slides }),
      });
      return response.json();
    },
  },

  // ============================================
  // Templates API
  // ============================================

  templates: {
    list: async (params?: {
      category?: string;
      search?: string;
    }): Promise<ApiResponse<Template[]>> => {
      const searchParams = new URLSearchParams();
      if (params?.category) searchParams.set('category', params.category);
      if (params?.search) searchParams.set('search', params.search);

      const queryString = searchParams.toString();
      const response = await fetchWithAuth(`/templates${queryString ? `?${queryString}` : ''}`);
      return response.json();
    },

    get: async (templateId: string): Promise<ApiResponse<Template>> => {
      const response = await fetchWithAuth(`/templates/${templateId}`);
      return response.json();
    },

    create: async (data: Partial<Template>): Promise<ApiResponse<Template>> => {
      const response = await fetchWithAuth('/templates', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return response.json();
    },

    update: async (
      templateId: string,
      data: Partial<Template>
    ): Promise<ApiResponse<Template>> => {
      const response = await fetchWithAuth(`/templates/${templateId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      return response.json();
    },

    delete: async (templateId: string): Promise<ApiResponse<void>> => {
      const response = await fetchWithAuth(`/templates/${templateId}`, {
        method: 'DELETE',
      });
      return response.json();
    },

    createFromProject: async (projectId: string): Promise<ApiResponse<Template>> => {
      const response = await fetchWithAuth(`/templates/from-project/${projectId}`, {
        method: 'POST',
      });
      return response.json();
    },
  },

  // ============================================
  // Deals API
  // ============================================

  deals: {
    list: async (params?: {
      page?: number;
      limit?: number;
      type?: string;
      sector?: string;
      year?: number;
      search?: string;
    }): Promise<PaginatedResponse<Deal>> => {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.set('page', String(params.page));
      if (params?.limit) searchParams.set('limit', String(params.limit));
      if (params?.type) searchParams.set('type', params.type);
      if (params?.sector) searchParams.set('sector', params.sector);
      if (params?.year) searchParams.set('year', String(params.year));
      if (params?.search) searchParams.set('search', params.search);

      const queryString = searchParams.toString();
      const response = await fetchWithAuth(`/deals${queryString ? `?${queryString}` : ''}`);
      return response.json();
    },

    get: async (dealId: string): Promise<ApiResponse<Deal>> => {
      const response = await fetchWithAuth(`/deals/${dealId}`);
      return response.json();
    },

    getSectors: async (): Promise<ApiResponse<string[]>> => {
      const response = await fetchWithAuth('/deals/sectors');
      return response.json();
    },

    getYears: async (): Promise<ApiResponse<number[]>> => {
      const response = await fetchWithAuth('/deals/years');
      return response.json();
    },

    getTypes: async (): Promise<ApiResponse<string[]>> => {
      const response = await fetchWithAuth('/deals/types');
      return response.json();
    },
  },

  // ============================================
  // Variables API
  // ============================================

  variables: {
    list: async (projectId?: string): Promise<ApiResponse<Variable[]>> => {
      const searchParams = new URLSearchParams();
      if (projectId) searchParams.set('projectId', projectId);

      const queryString = searchParams.toString();
      const response = await fetchWithAuth(`/variables${queryString ? `?${queryString}` : ''}`);
      return response.json();
    },

    create: async (data: Partial<Variable>): Promise<ApiResponse<Variable>> => {
      const response = await fetchWithAuth('/variables', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return response.json();
    },

    update: async (
      variableId: string,
      data: Partial<Variable>
    ): Promise<ApiResponse<Variable>> => {
      const response = await fetchWithAuth(`/variables/${variableId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      return response.json();
    },

    delete: async (variableId: string): Promise<ApiResponse<void>> => {
      const response = await fetchWithAuth(`/variables/${variableId}`, {
        method: 'DELETE',
      });
      return response.json();
    },

    bulkCreate: async (
      projectId: string,
      variables: Partial<Variable>[]
    ): Promise<ApiResponse<Variable[]>> => {
      const response = await fetchWithAuth(`/variables/bulk`, {
        method: 'POST',
        body: JSON.stringify({ projectId, variables }),
      });
      return response.json();
    },

    replaceInText: async (
      text: string,
      projectId?: string
    ): Promise<ApiResponse<{ replacedText: string }>> => {
      const response = await fetchWithAuth('/variables/replace', {
        method: 'POST',
        body: JSON.stringify({ text, projectId }),
      });
      return response.json();
    },
  },

  // ============================================
  // Comments API
  // ============================================

  comments: {
    list: async (projectId: string, slideId?: string): Promise<ApiResponse<Comment[]>> => {
      const searchParams = new URLSearchParams();
      searchParams.set('projectId', projectId);
      if (slideId) searchParams.set('slideId', slideId);

      const response = await fetchWithAuth(`/comments?${searchParams.toString()}`);
      return response.json();
    },

    create: async (data: Partial<Comment>): Promise<ApiResponse<Comment>> => {
      const response = await fetchWithAuth('/comments', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return response.json();
    },

    update: async (
      commentId: string,
      data: Partial<Comment>
    ): Promise<ApiResponse<Comment>> => {
      const response = await fetchWithAuth(`/comments/${commentId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      return response.json();
    },

    delete: async (commentId: string): Promise<ApiResponse<void>> => {
      const response = await fetchWithAuth(`/comments/${commentId}`, {
        method: 'DELETE',
      });
      return response.json();
    },

    resolve: async (commentId: string): Promise<ApiResponse<Comment>> => {
      const response = await fetchWithAuth(`/comments/${commentId}/resolve`, {
        method: 'PUT',
      });
      return response.json();
    },

    resolveAi: async (
      commentId: string,
      text: string
    ): Promise<ApiResponse<Comment>> => {
      const response = await fetchWithAuth(`/comments/${commentId}/resolve-ai`, {
        method: 'POST',
        body: JSON.stringify({ text }),
      });
      return response.json();
    },
  },

  // ============================================
  // Chat API (with streaming support)
  // ============================================

  chat: {
    sendMessage: async (
      projectId: string,
      message: string,
      onChunk?: (chunk: ChatStreamChunk) => void
    ): Promise<ApiResponse<ChatMessage>> => {
      const response = await fetchWithAuth(`/chat/${projectId}`, {
        method: 'POST',
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        return response.json();
      }

      // Handle streaming response
      if (response.headers.get('content-type')?.includes('text/event-stream')) {
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let fullContent = '';

        if (!reader) {
          return { error: 'Failed to read stream' };
        }

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                try {
                  const data = JSON.parse(line.slice(6)) as ChatStreamChunk;
                  fullContent += data.content;
                  onChunk?.(data);
                } catch {
                  // Ignore parse errors for incomplete JSON
                }
              }
            }
          }

          return {
            data: {
              id: `temp-${Date.now()}`,
              projectId,
              role: 'assistant',
              content: fullContent,
              createdAt: Date.now(),
            },
          };
        } catch (streamError) {
          return { error: 'Stream processing error' };
        }
      }

      return response.json();
    },

    getHistory: async (projectId: string): Promise<ApiResponse<ChatMessage[]>> => {
      const response = await fetchWithAuth(`/chat/${projectId}/history`);
      return response.json();
    },

    clearHistory: async (projectId: string): Promise<ApiResponse<void>> => {
      const response = await fetchWithAuth(`/chat/${projectId}/history`, {
        method: 'DELETE',
      });
      return response.json();
    },
  },

  // ============================================
  // AI Settings API
  // ============================================

  aiSettings: {
    get: async (): Promise<ApiResponse<AISettings>> => {
      const response = await fetchWithAuth('/ai/settings');
      return response.json();
    },

    update: async (data: Partial<AISettings>): Promise<ApiResponse<AISettings>> => {
      const response = await fetchWithAuth('/ai/settings', {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      return response.json();
    },

    testConnection: async (): Promise<ApiResponse<{ success: boolean }>> => {
      const response = await fetchWithAuth('/ai/settings/test', {
        method: 'POST',
      });
      return response.json();
    },
  },

  // ============================================
  // Export API
  // ============================================

  export: {
    toPptx: async (
      projectId: string,
      options?: {
        variablePresetId?: string;
        includeNotes?: boolean;
        includeWatermarks?: boolean;
      }
    ): Promise<Blob> => {
      const response = await fetchWithAuth(`/export/${projectId}/pptx`, {
        method: 'POST',
        body: JSON.stringify(options || {}),
      });
      return response.blob();
    },

    toPdf: async (
      projectId: string,
      options?: {
        variablePresetId?: string;
        slideRange?: 'all' | 'current' | number[];
      }
    ): Promise<Blob> => {
      const response = await fetchWithAuth(`/export/${projectId}/pdf`, {
        method: 'POST',
        body: JSON.stringify(options || {}),
      });
      return response.blob();
    },

    toImages: async (
      projectId: string,
      options?: {
        format?: 'png' | 'jpg';
        quality?: number;
      }
    ): Promise<Blob> => {
      const response = await fetchWithAuth(`/export/${projectId}/images`, {
        method: 'POST',
        body: JSON.stringify(options || {}),
      });
      return response.blob();
    },
  },

  // ============================================
  // Import API
  // ============================================

  import: {
    fromPptx: async (
      file: File,
      options?: {
        createAsTemplate?: boolean;
        targetProjectId?: string;
      }
    ): Promise<ApiResponse<{ project?: Project; template?: Template }>> => {
      const formData = new FormData();
      formData.append('file', file);
      if (options?.createAsTemplate) formData.append('createAsTemplate', 'true');
      if (options?.targetProjectId) formData.append('targetProjectId', options.targetProjectId);

      const response = await fetchWithAuth('/import/pptx', {
        method: 'POST',
        body: formData,
        headers: {}, // Let browser set Content-Type for FormData
      });
      return response.json();
    },

    fromUrl: async (
      url: string,
      options?: {
        createAsTemplate?: boolean;
      }
    ): Promise<ApiResponse<{ project?: Project; template?: Template }>> => {
      const response = await fetchWithAuth('/import/url', {
        method: 'POST',
        body: JSON.stringify({ url, ...options }),
      });
      return response.json();
    },
  },

  // ============================================
  // Uploads API
  // ============================================

  uploads: {
    upload: async (
      projectId: string,
      file: File,
      onProgress?: (progress: number) => void
    ): Promise<ApiResponse<Upload>> => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('projectId', projectId);

      return new Promise((resolve) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            onProgress?.(progress);
          }
        });

        xhr.addEventListener('load', () => {
          try {
            const data = JSON.parse(xhr.responseText);
            resolve(data);
          } catch {
            resolve({ error: 'Failed to parse response' });
          }
        });

        xhr.addEventListener('error', () => {
          resolve({ error: 'Upload failed' });
        });

        const token = localStorage.getItem('alecia-auth-token');
        if (token) {
          xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        }

        xhr.open('POST', `${API_BASE_URL}/uploads`);
        xhr.send(formData);
      });
    },

    list: async (projectId: string): Promise<ApiResponse<Upload[]>> => {
      const response = await fetchWithAuth(`/uploads/${projectId}`);
      return response.json();
    },

    delete: async (uploadId: string): Promise<ApiResponse<void>> => {
      const response = await fetchWithAuth(`/uploads/${uploadId}`, {
        method: 'DELETE',
      });
      return response.json();
    },

    getUrl: (filePath: string): string => {
      return `${API_BASE_URL}/uploads/files/${encodeURIComponent(filePath)}`;
    },
  },
};

// ============================================
// Utility Functions
// ============================================

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function handleApiError<T>(promise: Promise<ApiResponse<T>>): Promise<{
  data?: T;
  error?: string;
}> {
  try {
    const response = await promise;
    if (response.error) {
      return { error: response.error };
    }
    return { data: response.data };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Une erreur est survenue',
    };
  }
}

// ============================================
// Export default
// ============================================

export default api;
