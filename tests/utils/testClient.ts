import http from 'http';

export interface ApiResponse<T = any> {
  status: number;
  data: T;
  headers: http.IncomingHttpHeaders;
}

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  body?: any;
  headers?: Record<string, string>;
  query?: Record<string, string>;
}

export class TestApiClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseUrl: string = 'http://localhost:3001') {
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  setAuth(token: string): void {
    this.defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  clearAuth(): void {
    delete this.defaultHeaders['Authorization'];
  }

  private buildUrl(path: string, query?: Record<string, string>): string {
    const url = new URL(`${this.baseUrl}${path}`);
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }
    return url.toString();
  }

  private async request<T>(options: RequestOptions): Promise<ApiResponse<T>> {
    return new Promise((resolve, reject) => {
      const url = this.buildUrl(options.path, options.query);
      const headers = { ...this.defaultHeaders, ...options.headers };

      const reqOptions: http.RequestOptions = {
        method: options.method || 'GET',
        headers,
      };

      const req = http.request(url, reqOptions, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          try {
            const parsedData = data ? JSON.parse(data) : null;
            resolve({
              status: res.statusCode || 500,
              data: parsedData,
              headers: res.headers,
            });
          } catch {
            resolve({
              status: res.statusCode || 500,
              data: data,
              headers: res.headers,
            });
          }
        });
      });

      req.on('error', (err) => {
        reject(err);
      });

      if (options.body) {
        req.write(JSON.stringify(options.body));
      }

      req.end();
    });
  }

  // Auth methods
  async verifyPin(pin: string): Promise<ApiResponse<{ hasAccess: boolean; hasMasterAccess?: boolean }>> {
    return this.request({
      method: 'POST',
      path: '/api/auth/verify',
      body: { pin },
    });
  }

  async verifyProjectPin(projectId: string, pin: string): Promise<ApiResponse<{ hasAccess: boolean }>> {
    return this.request({
      method: 'POST',
      path: '/api/auth/verify-project',
      body: { projectId, pin },
    });
  }

  // Projects methods
  async getProjects(): Promise<ApiResponse<any[]>> {
    return this.request({ path: '/api/projects' });
  }

  async getProject(id: string): Promise<ApiResponse<any>> {
    return this.request({ path: `/api/projects/${id}` });
  }

  async createProject(data: Partial<{
    name: string;
    description: string;
    pin_code: string;
  }>): Promise<ApiResponse<any>> {
    return this.request({
      method: 'POST',
      path: '/api/projects',
      body: data,
    });
  }

  async updateProject(id: string, data: Partial<{
    name: string;
    description: string;
    pin_code: string;
  }>): Promise<ApiResponse<any>> {
    return this.request({
      method: 'PUT',
      path: `/api/projects/${id}`,
      body: data,
    });
  }

  async deleteProject(id: string): Promise<ApiResponse<{ success: boolean }>> {
    return this.request({
      method: 'DELETE',
      path: `/api/projects/${id}`,
    });
  }

  // Slides methods
  async getSlides(projectId: string): Promise<ApiResponse<any[]>> {
    return this.request({
      path: '/api/slides',
      query: { projectId },
    });
  }

  async getSlide(id: string): Promise<ApiResponse<any>> {
    return this.request({ path: `/api/slides/${id}` });
  }

  async createSlide(data: Partial<{
    project_id: string;
    position: number;
    title: string;
    layout: string;
    background_color: string;
    background_image: string;
  }>): Promise<ApiResponse<any>> {
    return this.request({
      method: 'POST',
      path: '/api/slides',
      body: data,
    });
  }

  async updateSlide(id: string, data: Partial<{
    title: string;
    layout: string;
    background_color: string;
    background_image: string;
    position: number;
  }>): Promise<ApiResponse<any>> {
    return this.request({
      method: 'PATCH',
      path: `/api/slides/${id}`,
      body: data,
    });
  }

  async deleteSlide(id: string): Promise<ApiResponse<{ success: boolean }>> {
    return this.request({
      method: 'DELETE',
      path: `/api/slides/${id}`,
    });
  }

  async reorderSlides(projectId: string, slideIds: string[]): Promise<ApiResponse<{ success: boolean }>> {
    return this.request({
      method: 'POST',
      path: '/api/slides/reorder',
      body: { projectId, slideIds },
    });
  }

  // Blocks methods
  async getBlocks(slideId: string): Promise<ApiResponse<any[]>> {
    return this.request({
      path: `/api/slides/${slideId}/blocks`,
    });
  }

  async createBlock(slideId: string, data: Partial<{
    type: string;
    position: number;
    content: string;
    style: string;
  }>): Promise<ApiResponse<any>> {
    return this.request({
      method: 'POST',
      path: `/api/slides/${slideId}/blocks`,
      body: data,
    });
  }

  async updateBlock(blockId: string, data: Partial<{
    content: string;
    style: string;
    position: number;
  }>): Promise<ApiResponse<any>> {
    return this.request({
      method: 'PATCH',
      path: `/api/blocks/${blockId}`,
      body: data,
    });
  }

  async deleteBlock(blockId: string): Promise<ApiResponse<{ success: boolean }>> {
    return this.request({
      method: 'DELETE',
      path: `/api/blocks/${blockId}`,
    });
  }

  // Templates methods
  async getTemplates(): Promise<ApiResponse<any[]>> {
    return this.request({ path: '/api/templates' });
  }

  async getTemplate(id: string): Promise<ApiResponse<any>> {
    return this.request({ path: `/api/templates/${id}` });
  }

  async createTemplate(data: Partial<{
    name: string;
    description: string;
    category: string;
    slides_data: string;
  }>): Promise<ApiResponse<any>> {
    return this.request({
      method: 'POST',
      path: '/api/templates',
      body: data,
    });
  }

  async deleteTemplate(id: string): Promise<ApiResponse<{ success: boolean }>> {
    return this.request({
      method: 'DELETE',
      path: `/api/templates/${id}`,
    });
  }

  // Chat methods
  async createConversation(projectId: string): Promise<ApiResponse<any>> {
    return this.request({
      method: 'POST',
      path: '/api/chat/conversations',
      body: { projectId },
    });
  }

  async sendMessage(conversationId: string, content: string): Promise<ApiResponse<any>> {
    return this.request({
      method: 'POST',
      path: `/api/chat/conversations/${conversationId}/messages`,
      body: { content },
    });
  }

  async getConversations(projectId: string): Promise<ApiResponse<any[]>> {
    return this.request({
      path: '/api/chat/conversations',
      query: { projectId },
    });
  }

  // Comments methods
  async getComments(projectId: string): Promise<ApiResponse<any[]>> {
    return this.request({
      path: '/api/comments',
      query: { projectId },
    });
  }

  async createComment(data: Partial<{
    project_id: string;
    slide_id: string;
    user_id: string;
    user_name: string;
    content: string;
    position_x: number;
    position_y: number;
  }>): Promise<ApiResponse<any>> {
    return this.request({
      method: 'POST',
      path: '/api/comments',
      body: data,
    });
  }

  async resolveComment(id: string): Promise<ApiResponse<any>> {
    return this.request({
      method: 'PATCH',
      path: `/api/comments/${id}/resolve`,
    });
  }

  async deleteComment(id: string): Promise<ApiResponse<{ success: boolean }>> {
    return this.request({
      method: 'DELETE',
      path: `/api/comments/${id}`,
    });
  }

  // Variables methods
  async getVariables(projectId: string): Promise<ApiResponse<any[]>> {
    return this.request({
      path: '/api/variables',
      query: { projectId },
    });
  }

  async createVariable(data: Partial<{
    project_id: string;
    name: string;
    value: string;
    type: string;
  }>): Promise<ApiResponse<any>> {
    return this.request({
      method: 'POST',
      path: '/api/variables',
      body: data,
    });
  }

  async updateVariable(id: string, data: Partial<{
    name: string;
    value: string;
    type: string;
  }>): Promise<ApiResponse<any>> {
    return this.request({
      method: 'PUT',
      path: `/api/variables/${id}`,
      body: data,
    });
  }

  async deleteVariable(id: string): Promise<ApiResponse<{ success: boolean }>> {
    return this.request({
      method: 'DELETE',
      path: `/api/variables/${id}`,
    });
  }

  // Export methods
  async exportProject(projectId: string, format: string): Promise<ApiResponse<any>> {
    return this.request({
      method: 'POST',
      path: '/api/export/pptx',
      body: { projectId, format },
    });
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<{ status: string }>> {
    return this.request({ path: '/health' });
  }
}

// Factory function for creating clients
export function createTestClient(baseUrl?: string): TestApiClient {
  return new TestApiClient(baseUrl);
}
