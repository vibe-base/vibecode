export type ContainerAction = 'start' | 'stop' | 'restart' | 'logs' | 'status' | 'delete';

export interface ContainerStatus {
  exists: boolean;
  status: string;
  running: boolean;
  pods: any[];
  deployment?: any;
  service?: any;
  pvc?: any;
  lastUpdated: string;
  error?: string;
}

export interface ContainerActionResponse {
  success: boolean;
  message: string;
  data?: any;
  logs?: string;
  timestamp: string;
}

export interface ContainerConfig {
  image?: string;
  port?: number;
  command?: string[];
  args?: string[];
  env_vars?: { name: string; value: string }[];
  cpu_limit?: string;
  memory_limit?: string;
  storage_size?: string;
}
