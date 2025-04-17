import { ContainerStatus, ContainerAction, ContainerActionResponse } from '../types/container';

export class ContainerService {
  // Single URL for all container operations
  private baseUrl = '/api/proxy/containers';

  /**
   * Get the status of a container for a project
   */
  async getContainerStatus(projectId: string): Promise<ContainerStatus> {
    try {
      // Get token from localStorage if available
      const token = localStorage.getItem('token');
      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Use a single URL for container status
      const url = `${this.baseUrl}/${projectId}/status`;
      console.log(`CRITICAL DEBUG: Getting container status from: ${url}`);
      console.log(`CRITICAL DEBUG: Headers: ${JSON.stringify(headers)}`);

      // Add a timestamp to prevent caching
      const timestampedUrl = `${url}?_t=${Date.now()}`;
      console.log(`CRITICAL DEBUG: Using URL with timestamp: ${timestampedUrl}`);

      const response = await fetch(timestampedUrl, {
        headers,
        // Ensure no caching
        cache: 'no-store'
      });

      if (!response.ok) {
        console.log(`CRITICAL DEBUG: API error: ${response.status}`);
        const errorText = await response.text();
        console.log(`CRITICAL DEBUG: Error response: ${errorText}`);
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }

      const data: ContainerActionResponse = await response.json();
      return this.processContainerStatusResponse(data);
    } catch (error) {
      console.error('CRITICAL DEBUG: Error getting container status:', error);
      console.log('CRITICAL DEBUG: Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      return {
        exists: false,
        status: 'Error',
        running: false,
        pods: [],
        lastUpdated: new Date().toISOString(),
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  /**
   * Perform an action on a container (start, stop, restart, logs)
   */
  async performContainerAction(
    projectId: string,
    action: ContainerAction,
    tailLines: number = 100
  ): Promise<ContainerActionResponse> {
    try {
      // Get token from localStorage if available
      const token = localStorage.getItem('token');
      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${this.baseUrl}/${projectId}/action`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          action,
          tail_lines: tailLines
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error performing container action ${action}:`, error);
      return {
        success: false,
        message: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Create container resources for a project
   */
  async createContainerResources(projectId: string): Promise<ContainerActionResponse> {
    try {
      // Get token from localStorage if available
      const token = localStorage.getItem('token');
      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${this.baseUrl}/${projectId}/create`, {
        method: 'POST',
        headers,
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating container resources:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Get logs from a container
   */
  async getContainerLogs(projectId: string, tailLines: number = 100): Promise<string> {
    try {
      const response = await this.performContainerAction(projectId, 'logs', tailLines);

      if (!response.success) {
        throw new Error(response.message);
      }

      return response.logs || 'No logs available';
    } catch (error) {
      console.error('Error getting container logs:', error);
      return `Error getting logs: ${error instanceof Error ? error.message : String(error)}`;
    }
  }

  /**
   * Start a container
   */
  async startContainer(projectId: string): Promise<boolean> {
    const response = await this.performContainerAction(projectId, 'start');
    return response.success;
  }

  /**
   * Stop a container
   */
  async stopContainer(projectId: string): Promise<boolean> {
    const response = await this.performContainerAction(projectId, 'stop');
    return response.success;
  }

  /**
   * Restart a container
   */
  async restartContainer(projectId: string): Promise<boolean> {
    const response = await this.performContainerAction(projectId, 'restart');
    return response.success;
  }

  /**
   * Process container status response
   */
  private processContainerStatusResponse(data: ContainerActionResponse): ContainerStatus {
    if (!data.success) {
      throw new Error(data.message);
    }

    return {
      exists: data.data?.exists !== false,
      status: data.data?.status || 'Unknown',
      running: data.data?.deployment?.available_replicas > 0,
      pods: data.data?.pods || [],
      deployment: data.data?.deployment || null,
      service: data.data?.service || null,
      pvc: data.data?.pvc || null,
      lastUpdated: new Date().toISOString(),
    };
  }
}

export const containerService = new ContainerService();
