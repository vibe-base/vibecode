import React, { useState, useEffect } from 'react';
import { ContainerStatus as ContainerStatusType } from '../../types/container';
import { containerService } from '../../services/container-service';
import { Button } from '../ui/button';
import { Spinner } from '../ui/spinner';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useTheme } from '../../lib/theme';
import { cn } from '../../lib/utils';

interface ContainerStatusProps {
  projectId: string;
  className?: string;
}

export function ContainerStatus({ projectId, className }: ContainerStatusProps) {
  const { mode } = useTheme();
  const [status, setStatus] = useState<ContainerStatusType | null>(null);
  const [logs, setLogs] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('status');
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);

  // Fetch container status
  const fetchStatus = async () => {
    try {
      const containerStatus = await containerService.getContainerStatus(projectId);
      setStatus(containerStatus);
    } catch (error) {
      console.error('Error fetching container status:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch container logs
  const fetchLogs = async () => {
    if (!status?.exists) return;
    
    try {
      const logs = await containerService.getContainerLogs(projectId);
      setLogs(logs);
    } catch (error) {
      console.error('Error fetching container logs:', error);
    }
  };

  // Start container
  const handleStart = async () => {
    setActionLoading(true);
    try {
      const success = await containerService.startContainer(projectId);
      if (success) {
        await fetchStatus();
      }
    } catch (error) {
      console.error('Error starting container:', error);
    } finally {
      setActionLoading(false);
    }
  };

  // Stop container
  const handleStop = async () => {
    setActionLoading(true);
    try {
      const success = await containerService.stopContainer(projectId);
      if (success) {
        await fetchStatus();
      }
    } catch (error) {
      console.error('Error stopping container:', error);
    } finally {
      setActionLoading(false);
    }
  };

  // Restart container
  const handleRestart = async () => {
    setActionLoading(true);
    try {
      const success = await containerService.restartContainer(projectId);
      if (success) {
        await fetchStatus();
      }
    } catch (error) {
      console.error('Error restarting container:', error);
    } finally {
      setActionLoading(false);
    }
  };

  // Create container resources
  const handleCreate = async () => {
    setActionLoading(true);
    try {
      const response = await containerService.createContainerResources(projectId);
      if (response.success) {
        await fetchStatus();
      }
    } catch (error) {
      console.error('Error creating container resources:', error);
    } finally {
      setActionLoading(false);
    }
  };

  // Set up polling for status updates
  useEffect(() => {
    fetchStatus();
    
    // Set up polling every 10 seconds
    const interval = setInterval(() => {
      fetchStatus();
      if (activeTab === 'logs') {
        fetchLogs();
      }
    }, 10000);
    
    setRefreshInterval(interval);
    
    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [projectId]);

  // Fetch logs when switching to logs tab
  useEffect(() => {
    if (activeTab === 'logs') {
      fetchLogs();
    }
  }, [activeTab]);

  // Get status badge color
  const getStatusColor = () => {
    if (!status) return 'bg-gray-500';
    
    if (status.error) return 'bg-red-500';
    
    if (!status.exists) return 'bg-gray-500';
    
    if (status.running) return 'bg-green-500';
    
    switch (status.status) {
      case 'Running':
        return 'bg-green-500';
      case 'Pending':
        return 'bg-yellow-500';
      case 'Failed':
        return 'bg-red-500';
      case 'Creating':
        return 'bg-blue-500';
      case 'Stopped':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Get theme-specific styles
  const getThemeStyles = () => {
    if (mode === 'light') {
      return {
        container: 'bg-white border border-gray-200',
        header: 'bg-gray-100 border-b border-gray-200',
        content: 'bg-white',
        logs: 'bg-gray-100 text-gray-800',
      };
    } else if (mode === 'terminal') {
      return {
        container: 'bg-black border border-green-900',
        header: 'bg-green-900 border-b border-green-700',
        content: 'bg-black text-green-500',
        logs: 'bg-black text-green-500 font-mono',
      };
    } else {
      // Dark mode (default)
      return {
        container: 'bg-[#1E1E1E] border border-[#3E3E3E]',
        header: 'bg-[#252526] border-b border-[#3E3E3E]',
        content: 'bg-[#1E1E1E]',
        logs: 'bg-[#1E1E1E] text-[#D4D4D4]',
      };
    }
  };

  const styles = getThemeStyles();

  if (loading) {
    return (
      <div className={cn('p-4 rounded-md flex items-center justify-center', styles.container, className)}>
        <Spinner size="md" />
        <span className="ml-2">Loading container status...</span>
      </div>
    );
  }

  return (
    <div className={cn('rounded-md overflow-hidden', styles.container, className)}>
      <div className={cn('p-4 flex justify-between items-center', styles.header)}>
        <div className="flex items-center">
          <h3 className="text-lg font-semibold">Container</h3>
          <Badge className={cn('ml-2', getStatusColor())}>
            {status?.exists 
              ? status.running 
                ? 'Running' 
                : status.status || 'Stopped'
              : 'Not Created'}
          </Badge>
        </div>
        <div className="flex space-x-2">
          {status?.exists ? (
            <>
              {status.running ? (
                <>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={handleStop}
                    disabled={actionLoading}
                  >
                    {actionLoading ? <Spinner size="sm" /> : 'Stop'}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={handleRestart}
                    disabled={actionLoading}
                  >
                    {actionLoading ? <Spinner size="sm" /> : 'Restart'}
                  </Button>
                </>
              ) : (
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={handleStart}
                  disabled={actionLoading}
                >
                  {actionLoading ? <Spinner size="sm" /> : 'Start'}
                </Button>
              )}
            </>
          ) : (
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleCreate}
              disabled={actionLoading}
            >
              {actionLoading ? <Spinner size="sm" /> : 'Create Container'}
            </Button>
          )}
          <Button 
            size="sm" 
            variant="outline" 
            onClick={fetchStatus}
            disabled={actionLoading}
          >
            Refresh
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="status" className="flex-1">Status</TabsTrigger>
          <TabsTrigger value="logs" className="flex-1">Logs</TabsTrigger>
          <TabsTrigger value="details" className="flex-1">Details</TabsTrigger>
        </TabsList>
        
        <TabsContent value="status" className={cn('p-4', styles.content)}>
          {status?.error ? (
            <div className="text-red-500 p-2 rounded-md bg-red-100 dark:bg-red-900/20">
              {status.error}
            </div>
          ) : status?.exists ? (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-1">Status</h4>
                <p>{status.status}</p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-1">Pods</h4>
                {status.pods && status.pods.length > 0 ? (
                  <ul className="space-y-2">
                    {status.pods.map((pod: any, index: number) => (
                      <li key={index} className="border p-2 rounded-md">
                        <div className="flex justify-between">
                          <span className="font-medium">{pod.name}</span>
                          <Badge className={pod.status === 'Running' && pod.ready ? 'bg-green-500' : 'bg-yellow-500'}>
                            {pod.status} {pod.ready ? '(Ready)' : ''}
                          </Badge>
                        </div>
                        <div className="text-sm mt-1">
                          <div>Restarts: {pod.restart_count}</div>
                          {pod.start_time && <div>Started: {new Date(pod.start_time).toLocaleString()}</div>}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No pods found</p>
                )}
              </div>
              
              <div>
                <h4 className="font-semibold mb-1">Last Updated</h4>
                <p>{new Date(status.lastUpdated).toLocaleString()}</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="mb-4">No container resources have been created for this project.</p>
              <Button onClick={handleCreate} disabled={actionLoading}>
                {actionLoading ? <Spinner size="sm" /> : 'Create Container Resources'}
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="logs" className={styles.content}>
          <div className="flex justify-end p-2">
            <Button size="sm" variant="outline" onClick={fetchLogs}>
              Refresh Logs
            </Button>
          </div>
          <pre className={cn('p-4 rounded-md overflow-auto h-80', styles.logs)}>
            {logs || 'No logs available. The container may not be running.'}
          </pre>
        </TabsContent>
        
        <TabsContent value="details" className={cn('p-4', styles.content)}>
          {status?.exists ? (
            <div className="space-y-4">
              {status.deployment && (
                <div>
                  <h4 className="font-semibold mb-1">Deployment</h4>
                  <div className="border p-2 rounded-md">
                    <div><span className="font-medium">Name:</span> {status.deployment.name}</div>
                    <div><span className="font-medium">Replicas:</span> {status.deployment.replicas}</div>
                    <div><span className="font-medium">Available:</span> {status.deployment.available_replicas || 0}</div>
                    <div><span className="font-medium">Ready:</span> {status.deployment.ready_replicas || 0}</div>
                  </div>
                </div>
              )}
              
              {status.service && (
                <div>
                  <h4 className="font-semibold mb-1">Service</h4>
                  <div className="border p-2 rounded-md">
                    <div><span className="font-medium">Name:</span> {status.service.name}</div>
                    <div><span className="font-medium">Cluster IP:</span> {status.service.cluster_ip}</div>
                    {status.service.ports && (
                      <div>
                        <span className="font-medium">Ports:</span>
                        <ul className="ml-4">
                          {status.service.ports.map((port: any, index: number) => (
                            <li key={index}>
                              {port.port} → {port.target_port}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {status.pvc && (
                <div>
                  <h4 className="font-semibold mb-1">Persistent Volume Claim</h4>
                  <div className="border p-2 rounded-md">
                    <div><span className="font-medium">Name:</span> {status.pvc.name}</div>
                    <div><span className="font-medium">Status:</span> {status.pvc.status}</div>
                    <div><span className="font-medium">Capacity:</span> {status.pvc.capacity || 'Unknown'}</div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p>No container resources have been created for this project.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
